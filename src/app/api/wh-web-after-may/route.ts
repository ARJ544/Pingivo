import { after, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSecretCode } from "@/app/api/verify-phone/route";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "error";

function ok(message: string) {
  return NextResponse.json({ status: 200, message });
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

const MSG = {
  unrecognized:
    "⚠️ *Unrecognized Command*\nPlease send a message starting with *CONNECT_<token>* to connect or *DISCONNECT_ME* to disconnect your WhatsApp number from Pingivo account.",
  dbError:
    "❌ *An error occurred.*\nPlease resend your message again.",
  notConnected:
    "⚠️ *Not Connected*\nThis number is not connected to any Pingivo account. You can recconnect it by sending the *CONNECT_token* from your profile menu on the Pingivo dashboard.",
  disconnectFailed:
    "❌ *Failed to disconnect.*\nPlease resend your message again.",
  disconnected:
    "✅ *Disconnected successfully!*\nThis WhatsApp number has been removed from Pingivo account. You can connect it again anytime.",
  tokenMissing:
    "⚠️ *Token Missing*\nPlease provide a token after CONNECT_. You can find the token in the profile menu of your Pingivo dashboard.",
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

    const { data: upsertData, error: upsertError } = await supabase
      .from("processed_webhooks")
      .upsert(
        { message_id: messageId },
        { onConflict: "message_id", ignoreDuplicates: true }
      )
      .select("id");

    if (upsertError) {
      return ok("Database error tracking webhook");
    }

    if (!upsertData || upsertData.length === 0) {
      return ok("Duplicate webhook ignored");
    }

    const bsuid = contact.user_id || message.from_user_id;
    const text = message.text?.body?.trim().replace(/^\*+|\*+$/g, "").trim();
    const upperText = text?.toUpperCase() ?? "";

    if (!bsuid) {
      console.error("No bsuid found in webhook");
      return ok("No bsuid found");
    }

    if (!text || (!upperText.startsWith("CONNECT_") && !upperText.startsWith("DISCONNECT_ME"))) {
      after(sendWhatsAppMessage(bsuid, MSG.unrecognized));
      return ok("Message does not start with CONNECT_ or DISCONNECT_ME");
    }

    if (upperText.startsWith("DISCONNECT_ME")) {
      return handleDisconnect(bsuid);
    }

    return handleConnect(bsuid, text);
  } catch (error) {
    console.error("Webhook error:", error);
    return ok("Internal server error");
  }
}