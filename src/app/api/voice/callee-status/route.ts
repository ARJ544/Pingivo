import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const status = formData.get("CallStatus") as string | null;
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const callerCallSid = searchParams.get("callerCallSid");

  if (!room) {
    return NextResponse.json({ error: "No room found for conference" });
  }

  if (!status) {
    return NextResponse.json({ error: "No call status found" }, { status: 400 });
  }

  if (status === "no-answer" || status === "busy" || status === "failed") {
    if (callerCallSid) {
      try {
        await client.calls(callerCallSid).update({
          url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/busy-message`,
          method: "POST",
        });

      } catch (e) {
        console.error("Failed to redirect caller call:", e);
      }
    }

    const conferences = await client.conferences.list({
      friendlyName: room,
      status: "in-progress",
    });
    for (const conf of conferences) {
      await client.conferences(conf.sid).update({ status: "completed" });
    }
  }

  return NextResponse.json({ success: true });
}
