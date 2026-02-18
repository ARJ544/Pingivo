import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST() {
  const cookieStore = await cookies();
  const caller = cookieStore.get("temp_phone")?.value ?? cookieStore.get("phone_num")?.value;
  const callee = cookieStore.get("owner_phone_num")?.value;

  if (!caller || !callee) {
    return NextResponse.json(
      { error: "Caller and Callee are required. Refresh or Re-Login" },
      { status: 400 }
    );
  }

  if (caller === callee) {
    return NextResponse.json(
      { error: "Caller and Callee cannot be the same number" },
      { status: 400 }
    );
  }

  const mixedNum = `${caller.slice(-8)}${callee.slice(-8)}`;
  const roomName = `conf_${mixedNum}_${Date.now()}`;

  let callToCaller;

  try {
    callToCaller = await client.calls.create({
      to: caller,
      from: process.env.TWILIO_NUMBER!,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/webhook?room=${roomName}&role=A`,
      statusCallback: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/caller-status?room=${roomName}&callee=${callee}`,
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallbackMethod: "POST",
      timeout: 20,

    });
  } catch (err: any) {
    console.error("Error while calling caller:", err);
    return NextResponse.json(
      { error: "Failed to call You", details: err.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Call started" });
}