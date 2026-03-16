import { getUserByFinderId } from '@/lib/api-helpers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  const cookieStore = await cookies();
  const receiverFinderId = cookieStore.get("receiver_finder_id")?.value;

  if (!receiverFinderId) {
    return NextResponse.json({ error: "Receiver not found. Please refresh the page." }, { status: 404 });
  }

  const recipientPhoneResult = await getUserByFinderId(receiverFinderId);
  if (!recipientPhoneResult.success) {
    return NextResponse.json({ error: "Receiver not found. Please refresh the page." }, { status: 404 });
  }
  const recipientPhone = recipientPhoneResult.user.phone_num;

  const { alertMessage } = await request.json();

  const url = `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: recipientPhone,
    type: "template",
    template: {
      name: "pingivo_safety_alerts",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: alertMessage
            }
          ]
        }
      ]
    }
  };

  const tempPayload = {
    messaging_product: "whatsapp",
    to: recipientPhone,
    type: "text",
    text: {
      body: alertMessage
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHATSAPP_PERMANENT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempPayload),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to send alert" }, { status: 500 });
  }
}