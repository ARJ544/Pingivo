import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const callerCallSid = formData.get("CallSid") as string;
  const callStatus = formData.get("CallStatus");
  console.log(`caller status: ${callStatus}`);
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
      statusCallback: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/callee-status?room=${encodeURIComponent(room)}&callerCallSid=${encodeURIComponent(callerCallSid)}`,
      statusCallbackMethod: "POST",
      statusCallbackEvent: ["no-answer", "busy", "failed", "completed", "in-progress", "answered"],
    });

    const { data, error } = await supabase
      .from("calling_credits")
      .select("credits_used")
      .eq("phone_num", caller)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Database read error" }, { status: 500 });
    }

    if (!data) {
      const { error: insertError } = await supabase
        .from("calling_credits")
        .insert({ phone_num: caller, credits_used: 1 });

      if (insertError) {
        return NextResponse.json({ error: "Database insert error" }, { status: 500 });
      }
    } else {
      const { error: updateError } = await supabase
        .from("calling_credits")
        .update({ credits_used: data.credits_used + 1 })
        .eq("phone_num", caller);

      if (updateError) {
        return NextResponse.json({ error: "Database update error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
