import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const status = formData.get("CallStatus");
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");

  if (!room) {
    return NextResponse.json({ error: "No room found for conference" });
  }

  console.log("callee callback:", status);

  if (status === "no-answer" || status === "failed" || status === "busy") {
    const conferences = await client.conferences.list({ friendlyName: room, status: "in-progress" });

    for (const conf of conferences) {
      await client.conferences(conf.sid).update({ status: "completed" });
    }
  }

  return NextResponse.json({ success: true });
}