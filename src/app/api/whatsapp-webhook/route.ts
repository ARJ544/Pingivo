import { after, NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { generateSecretCode } from "@/app/api/verify-phone/route";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "error";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

async function sendWhatsAppMessage(to: string, message: string) {
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
        to: to,
        type: "text",
        text: {
          body: message
        }
      }),
    });
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

async function sendTestMessage(to: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_PERMANENT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "template",
        template: {
          name: "pingivo_messages_using_bsuids",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: "IN.873456..." },
                { type: "text", text: "Hello World! This is a test message." }
              ]
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                { type: "text", text: encodeURIComponent("IN.873456") }
              ]
            }
          ]
        }
      }),
    });
    const data = await response.json();
    console.log("Test message response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Failed to send test message:", error);
    return null;
  }
}

function ok(message: string) {
  return NextResponse.json({ status: 200, message });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook only value:", JSON.stringify(body.entry?.[0]?.changes?.[0]?.value, null, 2));

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const contact = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (!message || !contact) {
      return ok("No message or contact found");
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
    let userPhone = message.from || contact.wa_id;
    const text = message.text?.body?.trim().replace(/^\*+|\*+$/g, "").trim();

    if (userPhone) {
      after(sendTestMessage(userPhone));
      after(sendWhatsAppMessage(
        userPhone,
        "⏳ *Pingivo WhatsApp Integration — Coming Soon*\n\n" +
        "The WhatsApp API will be available from *31st March 2026*.\n\n" +
        "Once it's live, you'll be able to:\n" +
        "• Link this number to your Pingivo account\n" +
        "• Receive messages directly on WhatsApp\n\n" +
        "To connect after launch, go to your *Pingivo → Profile menu → Connect Whatsapp* and send it here as:\n" +
        "*CONNECT_<your-token>*\n\n" +
        "_Check back on or after 31st March 2026._"
      ));
      return ok("API not active yet");
    } // Will be removed after 31st march 2026

    if (!text || (!text.toUpperCase().startsWith("CONNECT_") && !text.toUpperCase().startsWith("DISCONNECT_ME"))) {

      if (userPhone) {
        after(sendWhatsAppMessage(userPhone, "⚠️ *Unrecognized Command*\nPlease send a message starting with *CONNECT_<token>* to connect or *DISCONNECT_ME* to disconnect your WhatsApp number from Pingivo account."));
      }
      return ok("Message does not start with CONNECT_ or DISCONNECT_ME");
    }

    if (text.toUpperCase().startsWith("DISCONNECT_ME")) {
      const newToken = generateSecretCode();
      const { data: disconnected, error: disconnectError } = await supabase
        .from("simplified_users")
        .update({ bsuid: null, token: newToken })
        .eq("bsuid", bsuid)
        .select("id")
        .maybeSingle();

      if (disconnectError) {
        after(sendWhatsAppMessage(userPhone, "❌ *An error occurred.*\nPlease resend your message again."));
        return ok("Database error");
      }

      if (!disconnected) {
        after(sendWhatsAppMessage(userPhone, "⚠️ *Not Connected*\nThis number is not connected to any Pingivo account."));
        return ok("Not connected");
      }
      if (userPhone) {
        after(sendWhatsAppMessage(userPhone, "✅ *Disconnected successfully!*\nThis WhatsApp number has been removed from Pingivo account. You can connect it again anytime."));
      }
      return ok("Disconnected successfully");
    }

    const token = text.replace(/CONNECT_/i, "").trim();
    if (!token) {
      if (userPhone) {
        after(sendWhatsAppMessage(userPhone, "⚠️ *Token Missing*\nPlease provide a token after CONNECT_. You can find the token in the profile menu of your Pingivo dashboard."));
      }
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
        after(sendWhatsAppMessage(userPhone, "⚠️ *Duplicate Entry*\nThis number is already connected.\nIf you want to disconnect this number, please send *DISCONNECT_ME* in this chat or through the Pingivo profile menu."));
        return ok("Duplicate entry");
      }
      after(sendWhatsAppMessage(userPhone, "❌ *Failed to update.*\nPlease *Refresh that page* and try again."));
      return ok("Failed to update");
    }

    if (!updated) {
      after(sendWhatsAppMessage(userPhone, "❌ *Invalid or expired token.*\nPlease *Refresh that page* and try again."));
      return ok("Invalid or expired token");
    }

    if (userPhone) {
      await sendWhatsAppMessage(userPhone, `✅ *Connected successfully!*\n\nWhat happens now:\n\n- You will receive WhatsApp messages on ${updated.phone_num}\n- You will receive calls on ${updated.phone_num}\n\nStarting from early May(Date To Be Decided):\n\n- WhatsApp messages will be sent only to this connected number\n- Calls will continue on ${updated.phone_num}\n\nYou can disconnect your number at any time by sending *DISCONNECT_ME* in this chat or from the Pingivo profile menu.\n\n*Note:\nIf you disconnect before May(Date To Be Decided), you may still receive messages if this number(${updated.phone_num}) is registered on Pingivo.*\n\n_You can safely clear this chat._`);
    }
    return ok("Connected successfully");
  } catch (error) {
    console.error("Webhook error:", error);
    return ok("Internal server error");
  }
}
