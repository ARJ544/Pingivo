import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Twilio from "twilio";
import { getCaller, getCallCredits, getUserByFinderId } from "@/lib/api-helpers";
import { createClient } from "@supabase/supabase-js";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const callee_cookie_id = cookieStore.get("receiver_finder_id")?.value;

    if (!callee_cookie_id) {
      return NextResponse.json(
        { error: "Failed to call, Please refresh the page." },
        { status: 500 }
      );
    }

    const callerResult = await getCaller();
    if (!callerResult.success) {
      return callerResult.response;
    }
    const caller = callerResult.caller;

    const calleeResult = await getUserByFinderId(callee_cookie_id);
    if (!calleeResult.success) {
      return NextResponse.json(
        { error: "User not found. Please Refresh the page." },
        { status: 404 }
      );
    }
    const callee = calleeResult.user.phone_num;

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

    const creditsResult = await getCallCredits(caller);
    if (!creditsResult.success) {
      return creditsResult.response;
    }

    if (creditsResult.credits.creditsUsed >= 3) {
      return NextResponse.json(
        {
          error: "You've used all your free credits (3/3) for today. Next reset at 00:00 UTC"
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("calling_credits")
      .select("is_calling")
      .eq("phone_num", caller)
      .single();

    if ((data?.is_calling as string).toLowerCase() === "true") {
      return NextResponse.json(
        { error: "You already have a call in progress." },
        { status: 400 }
      );
    }

    await supabase
      .from("calling_credits")
      .upsert({ phone_num: caller, is_calling: true })
      .eq("phone_num", caller);

    const mixedNum = `${caller.slice(-5)}${callee.slice(-5)}`;
    const roomName = `conf_${mixedNum}_${Date.now()}`;

    try {
      await client.calls.create({
        to: caller,
        from: process.env.TWILIO_NUMBER!,
        url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/webhook?room=${encodeURIComponent(roomName)}&role=A`,
        statusCallback: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/caller-status?room=${encodeURIComponent(roomName)}&callee=${encodeURIComponent(callee)}&caller=${encodeURIComponent(caller)}`,
        statusCallbackEvent: ["in-progress", "completed", "answered"],
        statusCallbackMethod: "POST",
        timeout: 25,
      });
    } catch (err: any) {
      console.error("Error while calling caller:", err);
      return NextResponse.json(
        { error: "Failed to call You", details: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Call started" });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
