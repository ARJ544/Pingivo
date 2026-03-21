import { setNotCalling } from "@/lib/api-helpers";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

const twilio = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callerCallSid = formData.get("CallSid") as string;
  const callStatus = formData.get("CallStatus");
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const callee = searchParams.get("callee");
  const caller = searchParams.get("caller");

  console.log("Caller Status Update:", { room, callee, caller, callStatus });

  if (!room || !callee || !caller) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  if (["no-answer", "busy", "failed", "completed"].includes(callStatus as string)) {
    await Promise.allSettled([
      endConferenceRoom(room),
      setNotCalling(caller),
    ]);
    return NextResponse.json({ received: true });
  }

  if (callStatus === "answered") {
    try {
      await twilio.calls.create({
        to: callee,
        from: process.env.TWILIO_NUMBER!,
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/webhook?room=${encodeURIComponent(room)}&role=B`,
        timeout: 25,
        statusCallback: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/callee-status?room=${encodeURIComponent(room)}&caller=${encodeURIComponent(caller)}&callerCallSid=${encodeURIComponent(callerCallSid)}`,
        statusCallbackMethod: "POST",
        statusCallbackEvent: ["no-answer", "busy", "failed", "completed", "in-progress"],
      });
    } catch (err) {
      console.error("Failed to call callee:", err);
      await Promise.allSettled([
        endConferenceRoom(room),
        setNotCalling(caller),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}

async function endConferenceRoom(room: string) {
  const conferences = await twilio.conferences.list({
    friendlyName: room,
    status: "in-progress",
  });

  await Promise.allSettled(
    conferences.map((c) =>
      twilio.conferences(c.sid).update({ status: "completed" })
    )
  );
}