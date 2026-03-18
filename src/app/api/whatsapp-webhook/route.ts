import { NextResponse } from 'next/server';

const VERIFY_TOKEN = "ccc";


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


export async function POST(req: Request) {
  try {
    const body = await req.json();

    
    console.log("Incoming WhatsApp Webhook:", JSON.stringify(body, null, 2));

    
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error("Error parsing webhook:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
