import { getUserByFinderId } from '@/lib/api-helpers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function sanitizeMessageParam(text: string): string {
  return text
    .replace(/\r\n/g, " ")
    .replace(/[\r\n]/g, " ")
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/\{\{.*?\}\}/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, 500);
}

export async function POST(request: Request) {

  const cookieStore = await cookies();
  const senderFinderId = cookieStore.get("finder_id")?.value;
  const receiverFinderId = cookieStore.get("receiver_finder_id")?.value;
  const whatsAppPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const whatsAppToken = process.env.WHATSAPP_PERMANENT_TOKEN;
  if (!whatsAppPhoneNumberId || !whatsAppToken) {
    return NextResponse.json(
      { error: { message: "WhatsApp configuration is missing" } },
      { status: 500 }
    );
  }

  if (!receiverFinderId) {
    return NextResponse.json(
      { error: { message: "Receiver not found. Please refresh the page." } },
      { status: 404 }
    );
  }

  if (senderFinderId && receiverFinderId === senderFinderId) {
    return NextResponse.json(
      { error: { message: "Please do not message yourself." } },
      { status: 404 }
    );
  }

  const { alertMessage } = await request.json();

  if (!alertMessage || !alertMessage.trim()) {
    return NextResponse.json(
      { error: { message: "Please enter a message" } },
      { status: 400 }
    );
  }

  const recipientBsuidResult = await getUserByFinderId(receiverFinderId);
  if (!recipientBsuidResult.success) {
    return NextResponse.json(
      { error: { message: "Receiver not found. Please refresh the page." } },
      { status: 404 }
    );
  }
  const recipientBsuid = recipientBsuidResult.user?.phone_num;
  // const recipientBsuid = recipientBsuidResult.user?.bsuid; // uncomment this line and comment the above line to switch to using bsuid instead of phone number for WhatsApp messaging
  if (!recipientBsuid) {
    return NextResponse.json(
      { error: { message: "Receiver has not connected their WhatsApp yet but you can still contact them via Call." } },
      { status: 404 }
    );
  }

  let bsuid = recipientBsuid;
  if (recipientBsuid.startsWith("+")) {
    bsuid = recipientBsuid.replace(/^\+/, "");
  }

  let formattedMessage = sanitizeMessageParam(alertMessage);

  if (formattedMessage.length > 500) {
    return NextResponse.json(
      { error: { message: "Message too long (max 500 characters)" } },
      { status: 400 }
    );
  }

  // From this line 84 the code will be removed after early may(tbd)
  const url = `https://graph.facebook.com/v25.0/${whatsAppPhoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    // recipient: bsuid, // uncomment this line and comment the below line to switch to using bsuid instead of phone number for WhatsApp messaging
    to: bsuid,
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
              text: formattedMessage
            }
          ]
        }
      ]
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${whatsAppToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: { message: "Failed to send alert" } }, { status: 500 });
  }
  //  remove till here 132 uncomment from below after early may(tbd)
  // const message = `To: ${bsuid}\n\nMessage: ${formattedMessage}`;
  // const encodedMessage = encodeURIComponent(message);

  // const waLink = `https://wa.me/916124530919?text=${encodedMessage}`;
  // return NextResponse.json({ success: true, waLink });

}
