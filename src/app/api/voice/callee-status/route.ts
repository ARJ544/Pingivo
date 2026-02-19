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
  const status = formData.get("CallStatus");
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const caller = searchParams.get("caller");

  if (!room) {
    return NextResponse.json({ error: "No room found for conference" });
  }

  if (status === "no-answer" || status === "failed" || status === "busy" || status === "canceled") {
    const conferences = await client.conferences.list({
      friendlyName: room,
      status: "in-progress",
    });

    for (const conf of conferences) {
      await client.conferences(conf.sid).update({ status: "completed" });
    }
  } else if (status === "completed") {
    if (!caller) {
      return NextResponse.json({ error: "Caller number missing" }, { status: 400 });
    }

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

  return NextResponse.json({ success: true });
}
