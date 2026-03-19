import { NextResponse } from 'next/server';
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
        recipient: to,
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook only value:", JSON.stringify(body.entry?.[0]?.changes?.[0]?.value, null, 2));

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const contact = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];

    if (!message || !contact) {
      return NextResponse.json({ status: 200, message: "No message or contact found" });
    }

    const bsuid = contact.user_id || message.from_user_id;
    const text = message.text?.body?.trim().replace(/^\*+|\*+$/g, "").trim();

    if (!text || (!text.toUpperCase().startsWith("CONNECT_") && !text.toUpperCase().startsWith("DISCONNECT_ME"))) {

      await sendWhatsAppMessage(bsuid, "⚠️ *Unrecognized Command*\nPlease send a message starting with *CONNECT_<token>* to connect or *DISCONNECT_ME* to disconnect your WhatsApp number from Pingivo account.");

      return NextResponse.json({ status: 200, message: "Message does not start with CONNECT_ or DISCONNECT_ME" });
    }

    if (text.toUpperCase().startsWith("DISCONNECT_ME")) {
      const { data: existingUser, error: findError } = await supabase
        .from("simplified_users")
        .select("id")
        .eq("bsuid", bsuid)
        .maybeSingle();

      if (findError) {
        await sendWhatsAppMessage(bsuid, "❌ *An error occurred.*\nPlease resend your message again.");
        return NextResponse.json({ status: 200, message: "Database error" });
      }

      if (!existingUser) {
        await sendWhatsAppMessage(bsuid, "⚠️ *Not Connected*\nThis number is not connected to any Pingivo account. You can recconnect it by sending the *CONNECT_token* from your profile menu on the Pingivo dashboard.");
        return NextResponse.json({ status: 200, message: "Not connected" });
      }

      const newToken = generateSecretCode();
      const { error: disconnectError } = await supabase
        .from("simplified_users")
        .update({ bsuid: null, token: newToken })
        .eq("bsuid", bsuid);

      if (disconnectError) {
        await sendWhatsAppMessage(bsuid, "❌ *Failed to disconnect.*\nPlease resend your message again.");
        return NextResponse.json({ status: 200, message: "Disconnect failed" });
      }

      await sendWhatsAppMessage(bsuid, "✅ *Disconnected successfully!*\nThis WhatsApp number has been removed from Pingivo account. You can connect it again anytime.");
      return NextResponse.json({ status: 200, message: "Disconnected" });
    }

    const token = text.replace(/CONNECT_/i, "").trim();
    if (!token) {
      await sendWhatsAppMessage(bsuid, "⚠️ *Token Missing*\nPlease provide a token after CONNECT_. You can find the token in the profile menu of your Pingivo dashboard.");
      return NextResponse.json({ status: 200, message: "Token missing" });
    }
    const { data: user, error } = await supabase
      .from("simplified_users")
      .select("id, token, phone_num")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      await sendWhatsAppMessage(bsuid, "❌ *An error occurred while connecting.*\nPlease *Refresh that page* and try again.");
      return NextResponse.json({ status: 200, message: "Database error" });
    }

    if (!user) {
      console.log("Invalid token:", token);
      await sendWhatsAppMessage(bsuid, "❌ *Invalid or expired token.*\nPlease *Refresh that page* and try again.");
      return NextResponse.json({ status: 200, message: "Invalid or expired token" });
    }

    const { error: updateError } = await supabase
      .from("simplified_users")
      .update({
        bsuid: bsuid,
        token: null,
      })
      .eq("id", user.id);

    if (updateError) {
      if (updateError.code === '23405' || updateError.code === '23505') {
        await sendWhatsAppMessage(bsuid, "⚠️ *Duplicate Entry*\nThis number is already connected. You can disconnect it by sending *DISCONNECT_ME* in this chat.");

        return NextResponse.json({ status: 200, message: "Duplicate entry" });
      }
      await sendWhatsAppMessage(bsuid, "❌ *Failed to update.*\nPlease *Refresh that page* and try again.");
      return NextResponse.json({ status: 200, message: "Failed to update" });
    }

    await sendWhatsAppMessage(bsuid, `✅ *Connected successfully!*\n\nYou will now receive:\n• Messages on this WhatsApp number\n• Calls at *${user.phone_num}*\n\nYou can disconnect your number any time by sending *DISCONNECT_ME* in this chat or through the Pingivo profile menu.\n\n_You can now safely clear this chat._`);

    return NextResponse.json({ status: 200, message: "Successfully linked" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "invalid request" }, { status: 200 });
  }
}
