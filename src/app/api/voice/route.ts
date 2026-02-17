import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Twilio from 'twilio';

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const caller = cookieStore.get("temp_phone")?.value ?? cookieStore.get("phone_num")?.value;
    const callee = cookieStore.get("owner_phone_num")?.value;

    if (!caller || !callee) {
      return NextResponse.json(
        { error: 'caller and callee are required. Refresh or Re-Login' },
        { status: 400 }
      );
    }
    const mixed_num = `${caller.slice(4, 8)}${callee.slice(4, 8)}`

    const roomName = `conf_${mixed_num}_${Date.now()}`;

    const webhookUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/webhook?room=${roomName}`;

    await client.calls.create({
      to: caller,
      from: process.env.TWILIO_NUMBER!,
      url: webhookUrl,
    });

    await client.calls.create({
      to: callee,
      from: process.env.TWILIO_NUMBER!,
      url: webhookUrl,
    });

    return NextResponse.json({ success: true, message: "Call started" });
  } catch (error: any) {
    console.error('Twilio call error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}