import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callerCallSid = formData.get("CallSid") as string;
  const callStatus = formData.get("CallStatus");
  console.log(`callerCallStatus: ${callStatus}`)
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const callee = searchParams.get("callee");
  const caller = searchParams.get("caller");

  if (!room || !callee || !caller) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  if (["no-answer", "busy", "failed"].includes(callStatus as string)) {
    return NextResponse.json({ received: true });
  }

  if (callStatus === "completed") {
    return NextResponse.json({ received: true });
  }


  if (callStatus === "in-progress" || callStatus === "answered") {
    await client.calls.create({
      to: callee,
      from: process.env.TWILIO_NUMBER!,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/webhook?room=${encodeURIComponent(room)}&role=B`,
      timeout: 20,
      statusCallback: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/callee-status?room=${encodeURIComponent(room)}&caller=${encodeURIComponent(caller)}&callerCallSid=${encodeURIComponent(callerCallSid)}`,
      statusCallbackMethod: "POST",
      statusCallbackEvent: ["no-answer", "busy", "failed", "completed", "in-progress"],
    });
  }

  return NextResponse.json({ received: true });
}
