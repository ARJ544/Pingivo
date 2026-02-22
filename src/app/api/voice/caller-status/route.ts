import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callStatus = formData.get("CallStatus");
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const callee = searchParams.get("callee");
  const caller = searchParams.get("caller");

  if (!room) {
    return NextResponse.json({ error: "No room found for conference" });
  }
  if (!callee || !caller) {
    return NextResponse.json(
      { error: "Missing callee or caller number" },
      { status: 400 },
    );
  }

  if (
    ["completed", "no-answer", "busy", "failed"].includes(callStatus as string)
  ) {
    const conferences = await client.conferences.list({
      friendlyName: room,
      status: "in-progress",
    });
    for (const conf of conferences) {
      await client.conferences(conf.sid).update({ status: "completed" });
    }
  }

  if (callStatus === "in-progress" || callStatus === "answered") {
    await client.calls.create({
      to: callee,
      from: process.env.TWILIO_NUMBER!,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/webhook?room=${room}&role=B`,
      timeout: 20,
      fallbackUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/busy-message`,
      fallbackMethod: "POST",
      statusCallback: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/callee-status?room=${room}&caller=${caller}`,
      statusCallbackMethod: "POST",
      statusCallbackEvent: ["completed", "no-answer", "failed", "busy", "initiated", "ringing", "answered", "completed"],
    });
  }

  return NextResponse.json({ received: true });
}
