import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllCookie } from "@/app/actions";
import { decryptPhone } from "@/lib/crypto";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function GET() {
  const { id, phone_num, secure_validator } = await getAllCookie();
  const cookieStore = await cookies();
  const caller_cookie_id = id;
  let caller;

  const tempPhoneValue = cookieStore.get("temp_phone")?.value;

  if (tempPhoneValue) {
    caller = await decryptPhone(tempPhoneValue);
  } else {
    if (!caller_cookie_id) {
      return NextResponse.json(
        { error: "Not logged in", callCredits: 3 },
        { status: 200 }
      );
    }

    const { data: callerData, error: callerFetchError } = await supabase
      .from("users")
      .select("phone_num, created_at")
      .eq("id", caller_cookie_id)
      .single();

    if (callerFetchError) {
      return NextResponse.json(
        { error: callerFetchError.message, callCredits: 3 },
        { status: 200 }
      );
    }

    if (!callerData) {
      return NextResponse.json(
        { error: "User not found", callCredits: 3 },
        { status: 200 }
      );
    }

    if (
      (callerData.phone_num as string).slice(-4) !== phone_num?.slice(-4) ||
      (callerData.created_at as string) !== secure_validator
    ) {
      return NextResponse.json(
        { error: "Unauthorized", callCredits: 0 },
        { status: 200 }
      );
    }

    caller = callerData.phone_num;
  }

  const { data, error } = await supabase
    .from("calling_credits")
    .select("credits_used")
    .eq("phone_num", caller)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Database error", callCredits: 3 },
      { status: 200 }
    );
  }

  const creditsUsed = data?.credits_used ?? 0;
  const callCredits = 3 - (creditsUsed ?? 0);

  return NextResponse.json({ 
    success: true,
    callCredits,
    creditsUsed,
    totalCredits: 3 
  });
}
