import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Twilio from "twilio";
import { getAllCookie } from "@/app/actions";
import { decryptPhone } from "@/lib/crypto";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST() {
  const { phone_num, secure_validator } = await getAllCookie();
  const cookieStore = await cookies();
  const caller_cookie_id = cookieStore.get("id")?.value;
  const callee_cookie_id = cookieStore.get("receiver_id")?.value;
  let caller;

  const tempPhoneValue = cookieStore.get("temp_phone")?.value;

  if (!callee_cookie_id) {
    return NextResponse.json({ error: "Failed to call, Please refresh the page." }, { status: 500 });
  }

  if (tempPhoneValue) {
    caller = await decryptPhone(tempPhoneValue);
  } else {
    if (!caller_cookie_id) {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }

    const { data: callerData, error: callerFetchError } = await supabase
      .from("users")
      .select("phone_num, created_at")
      .eq("id", caller_cookie_id)
      .single();

    if (callerFetchError) {
      return NextResponse.json({ error: callerFetchError.message }, { status: 500 });
    }
    if (!callerData) {
      return NextResponse.json(
        { error: "User not found. Please sign up." },
        { status: 404 },
      );
    }

    if ((callerData.phone_num as string).slice(-4) != phone_num?.slice(-4) || (callerData.created_at as string) != secure_validator) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 404 },
      );
    }

    caller = callerData.phone_num;
  }

  const { data: calleeData, error: calleeFetchError } = await supabase
    .from("users")
    .select("phone_num")
    .eq("id", callee_cookie_id)
    .single();

  if (calleeFetchError) {
    return NextResponse.json({ error: `Error: ${calleeFetchError.message} || Refresh the Page` }, { status: 500 });
  }
  if (!calleeData) {
    return NextResponse.json(
      { error: "User not found. Please Refresh the page." },
      { status: 404 },
    );
  }
  const callee = calleeData.phone_num;


  if (!caller || !callee) {
    return NextResponse.json(
      { error: "Caller and Callee are required. Refresh or Re-Login" },
      { status: 400 },
    );
  }

  if (caller === callee) {
    return NextResponse.json(
      { error: "Caller and Callee cannot be the same number" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("calling_credits")
    .select("credits_used")
    .eq("phone_num", caller)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  let creditsUsed = data?.credits_used ?? 0;
  if (creditsUsed >= 3) {
    return NextResponse.json(
      {
        error: "You've used all your free credits (3/3) for today. Next reset at 12:30 PM UTC"
      },
      { status: 400 }
    );
  }

  const mixedNum = `${caller.slice(-5)}${callee.slice(-5)}`;
  const roomName = `conf_${mixedNum}_${Date.now()}`;

  try {
    await client.calls.create({
      to: caller,
      from: process.env.TWILIO_NUMBER!,
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/webhook?room=${encodeURIComponent(roomName)}&role=A`,
      statusCallback: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/voice/caller-status?room=${encodeURIComponent(roomName)}&callee=${encodeURIComponent(callee)}&caller=${encodeURIComponent(caller)}`,
      statusCallbackEvent: ["in-progress", "completed", "answered",],
      statusCallbackMethod: "POST",
      timeout: 20,
    });
  } catch (err: any) {
    console.error("Error while calling caller:", err);
    return NextResponse.json(
      { error: "Failed to call You", details: err.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Call started" });
}