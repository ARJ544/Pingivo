import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
const BeforeOldWebhook = {
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "262xxx114xxxx",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "916124530919",
              "phone_number_id": "101232xxxxxxxx"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Payal Kumari"
                },
                "wa_id": "91997xxxxxxx"
              }
            ],
            "messages": [
              {
                "from": "91997xxxxxxx",
                "id": "wamid.HBgMOTE5Oxxxxxg4NDA0N0U4M0E5MAA=",
                "timestamp": "1773829844",
                "text": {
                  "body": "hi"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook message:", JSON.stringify(body.entry?.[0]?.changes?.[0]?.value?.messages?.[0], null, 2));

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: "no message" });
    }
    const bsuid = message.user_id || message.from;
    const text = message.text?.body;

    if (!text || !text.toUpperCase().startsWith("CONNECT_")) {
      return NextResponse.json({ status: "ignored" });
    }

    const token = text.replace(/CONNECT_/i, "").trim();

    const { data: user, error } = await supabase
      .from("simplified_users")
      .select("id, token")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      sendWhatsAppMessage(bsuid, "An error occurred while connecting. Please Refresh that Page and Try again.");
      return NextResponse.json({ error: "db error" }, { status: 500 });
    }

    if (!user) {
      console.log("Invalid token:", token);
      sendWhatsAppMessage(bsuid, "Invalid token or expired. Please Refresh that Page and Try again.");
      return NextResponse.json({ status: "invalid token" });
    }

    const { error: updateError } = await supabase
      .from("simplified_users")
      .update({
        bsuid: bsuid,
        token: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      sendWhatsAppMessage(bsuid, "Failed to connect. Please Refresh that Page and Try again.");
      return NextResponse.json({ error: "update failed" }, { status: 500 });
    }

    sendWhatsAppMessage(bsuid, "Connected successfully! You can now receive messages to this number.");

    return NextResponse.json({ status: "linked" }, { status: 200 });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}