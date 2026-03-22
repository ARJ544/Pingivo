import { after, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSecretCode } from "@/app/api/verify-phone/route";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "error";

const MSG = {
  unrecognized:
    "⚠️ *Unrecognized Command*\nPlease send a message starting with *CONNECT_<your-token>* to connect or *DISCONNECT_ME* to disconnect your WhatsApp number from Pingivo account.\n*To Reply a User* use this *format*:\nTo: <sender_id>\nMessage: <your message>",
  dbError:
    "❌ *An error occurred.*\nPlease resend your message again.",
  notConnected:
    "⚠️ *Not Connected*\nThis number is not connected to any Pingivo account. You can recconnect it by sending the *CONNECT_<your-token>* from your profile menu on the Pingivo dashboard.",
  disconnectFailed:
    "❌ *Failed to disconnect.*\nPlease resend your message again.",
  disconnected:
    "✅ *Disconnected successfully!*\nThis WhatsApp number has been removed from Pingivo account. You can connect it again anytime.",
  tokenMissing:
    "⚠️ *Token Missing*\nPlease provide a token after CONNECT_<your-token>. You can find the token in the profile menu of your Pingivo dashboard.",
  connectDbError:
    "❌ *An error occurred while connecting.*\nPlease *Refresh that page* and try again.",
  invalidToken:
    "❌ *Invalid or expired token.*\nPlease *Refresh that page* and try again.",
  duplicateEntry:
    "⚠️ *Duplicate Entry*\nThis number is already connected. You can disconnect it by sending *DISCONNECT_ME* in this chat.",
  updateFailed:
    "❌ *Failed to update.*\nPlease *Refresh that page* and try again.",
  connected: (phoneNum: string) =>
    `✅ *Connected successfully!*\n\nYou will now receive:\n• Messages on this WhatsApp number\n• Calls at *${phoneNum}*\n\nYou can disconnect your number any time by sending *DISCONNECT_ME* in this chat or through the Pingivo profile menu.\n\n_You can now safely clear this chat._`,
};

function ok(message: string) {
  return NextResponse.json({ status: 200, message });
}

async function checkAndStoreMessageId(messageId: string) {
  try {
    const { error } = await supabase
      .from("processed_webhooks")
      .insert({ message_id: messageId });

    if (error) {
      if (error.code === "23505") {
        return {
          isDuplicate: true,
          error: null
        };
      }

      console.error("Database error tracking webhook:", error);

      return {
        isDuplicate: true,
        error: "Database error"
      };
    }

    return {
      isDuplicate: false,
      error: null
    };
  } catch (err) {
    console.error("Unexpected error in message check:", err);

    return {
      isDuplicate: true,
      error: "Unexpected error"
    };
  }
}

async function sendWhatsAppMessage(bsuid: string, message: string) {
  try {
    await fetch(`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_PERMANENT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        recipient: bsuid,
        type: "text",
        text: { body: message },
      }),
    });
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}

async function sendWhatsAppReplyMessage(to: string, from: string, message: string) {
  try {
    const safeFromId = encodeURIComponent(from);
    const displayId = from.substring(0, 9) + "...";

    const response = await fetch(`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_PERMANENT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        recipient: to,
        type: "template",
        template: {
          name: "pingivo_messages_using_bsuids",
          language: {
            code: "en"
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: displayId },
                { type: "text", text: message }
              ]
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                { type: "text", text: safeFromId }
              ]
            }
          ]
        }
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      after(sendWhatsAppMessage(from, "⚠️ Failed to send your message. There may be a temporary issue. Please try again later."));
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error("Failed to send WhatsApp template message:", error);
    return null;
  }
}

async function handleDisconnect(bsuid: string) {
  const newToken = generateSecretCode();

  const { data: disconnected, error: disconnectError } = await supabase
    .from("simplified_users")
    .update({ bsuid: null, token: newToken })
    .eq("bsuid", bsuid)
    .select("id")
    .maybeSingle();

  if (disconnectError) {
    after(sendWhatsAppMessage(bsuid, MSG.disconnectFailed));
    return ok("Disconnect failed");
  }

  if (!disconnected) {
    after(sendWhatsAppMessage(bsuid, MSG.notConnected));
    return ok("Not connected");
  }

  after(sendWhatsAppMessage(bsuid, MSG.disconnected));
  return ok("Disconnected");
}

async function handleConnect(bsuid: string, text: string) {
  const token = text.replace(/CONNECT_/i, "").trim();

  if (!token) {
    after(sendWhatsAppMessage(bsuid, MSG.tokenMissing));
    return ok("Token missing");
  }

  const { data: updated, error: updateError } = await supabase
    .from("simplified_users")
    .update({ bsuid: bsuid, token: null })
    .eq("token", token)
    .select("id, phone_num")
    .maybeSingle();

  if (updateError) {
    if (updateError.code === "23505") {
      after(sendWhatsAppMessage(bsuid, MSG.duplicateEntry));
      return ok("Duplicate entry");
    }
    after(sendWhatsAppMessage(bsuid, MSG.connectDbError));
    return ok("Database error");
  }

  if (!updated) {
    console.log("Invalid token:", token);
    after(sendWhatsAppMessage(bsuid, MSG.invalidToken));
    return ok("Invalid or expired token");
  }

  after(sendWhatsAppMessage(bsuid, MSG.connected(updated.phone_num)));
  return ok("Successfully linked");
}

function extractToAndMessage(text: string) {
  const toMatch = text.match(/To:\s*([^\n\r]+)/i);
  const messageMatch = text.match(/Message:\s*([\s\S]*)/i);

  const to = toMatch?.[1]?.trim().split(" ")[0];
  const message = messageMatch?.[1]
    ?.replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);

  if (!to || !message) return null;

  return { to, message };
}

async function handleUserReplyMessages(bsuid: string, text: string) {

  if (!/to:/i.test(text) || !/message:/i.test(text)) {
    after(sendWhatsAppMessage(bsuid, MSG.unrecognized));
    return ok("Invalid reply format structure");
  }
  const parsed = extractToAndMessage(text);

  if (!parsed) {
    after(sendWhatsAppMessage(
      bsuid, MSG.unrecognized
    ));
    return ok("Invalid message format");
  }
  const { to, message } = parsed;

  if (to === bsuid) {
    await sendWhatsAppMessage(bsuid, "⚠️ You cannot message yourself.");
    return ok("Self messaging blocked");
  }

  const res = await sendWhatsAppReplyMessage(to, bsuid, message);
  if (!res) {
    after(sendWhatsAppMessage(bsuid, "⚠️ Failed to send message. Please try again later."
    ));
    return ok("Failed to send reply message");
  }

  after(sendWhatsAppMessage(
    bsuid,
    `✅ Message sent successfully!`
  ));

  return ok("Message forwarded");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook only value:", JSON.stringify(body.entry?.[0]?.changes?.[0]?.value, null, 2));

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const contact = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (!message || !contact) {
      return ok("No message or contact found in webhook");
    }

    const messageId = message.id;

    const { isDuplicate, error } = await checkAndStoreMessageId(messageId);

    if (error) {
      return ok("Database error tracking webhook");
    }

    if (isDuplicate) {
      return ok("Duplicate webhook ignored");
    }

    const bsuid = contact.user_id || message.from_user_id;
    if (!bsuid) {
      console.error("No bsuid found in webhook");
      return ok("No bsuid found");
    }

    if (!message.text?.body) {
      after(sendWhatsAppMessage(
        bsuid,
        "⚠️ Only text messages are supported."
      ));
      return ok("Non-text message ignored");
    }
    const text = message.text.body.trim().replace(/^\*+|\*+$/g, "").trim();

    if (!text) {
      after(sendWhatsAppMessage(bsuid, MSG.unrecognized));
      return ok("Empty message");
    }
    const upperText = text.toUpperCase();

    if (upperText.startsWith("DISCONNECT_ME")) {
      return handleDisconnect(bsuid);
    }

    if (upperText.startsWith("CONNECT_")) {
      return handleConnect(bsuid, text);
    }

    return handleUserReplyMessages(bsuid, text);
  } catch (error) {
    console.error("Webhook error:", error);
    return ok("Internal server error");
  }
}