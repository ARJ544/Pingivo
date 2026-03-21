import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Twilio from "twilio";
import { getCaller, getUserByFinderId } from "@/lib/api-helpers";
import { createClient } from "@supabase/supabase-js";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

const supabase = createClient(
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

    const [callerResult, calleeResult] = await Promise.all([
      getCaller(),
      getUserByFinderId(callee_cookie_id),
    ]);

    if (!callerResult.success) return callerResult.response;
    if (!calleeResult.success) {
      return NextResponse.json(
        { error: "User not found. Please Refresh the page." },
        { status: 404 }
      );
    }

    const caller = callerResult.caller;
    const callee = calleeResult.user?.phone_num;

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

    const { data: callingRecord } = await supabase
      .from("calling_credits")
      .select("is_calling, credits_used")
      .eq("phone_num", caller)
      .maybeSingle();

    if (callingRecord?.is_calling) {
      return NextResponse.json(
        { error: "You are already in a call. Please wait for it to finish." },
        { status: 400 }
      );
    }

    const creditsUsed = callingRecord?.credits_used ?? 0;
    if (creditsUsed >= 3) {
      return NextResponse.json(
        { error: "You've used all your free credits (3/3) for today. Next reset at 00:00 UTC" },
        { status: 400 }
      );
    }

    const mixedNum = `${caller.slice(-5)}${callee.slice(-5)}`;
    const roomName = `conf_${mixedNum}_${Date.now()}`;

    await supabase
      .from("calling_credits")
      .upsert({ phone_num: caller, is_calling: true }, { onConflict: "phone_num" });

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
    } catch (twilioErr: any) {
      await supabase
        .from("calling_credits")
        .update({ is_calling: false })
        .eq("phone_num", caller);

      console.error("Twilio call failed:", twilioErr);
      return NextResponse.json(
        { error: "Failed to initiate call. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Call started" });

  } catch (err) {
    console.error("Error in call initiation:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}