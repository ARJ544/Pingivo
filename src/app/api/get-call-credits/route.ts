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
  try {
    const { id, phone_num, secure_validator } = await getAllCookie();
    const cookieStore = await cookies();

    let caller: string | null = null;
    const tempPhoneValue = cookieStore.get("temp_phone")?.value;

    if (tempPhoneValue) {
      caller = await decryptPhone(tempPhoneValue);
    } else {
      if (!id || !phone_num || !secure_validator) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }

      const { data: callerData, error: callerFetchError } = await supabase
        .from("users")
        .select("phone_num, created_at")
        .eq("id", id)
        .single();

      if (callerFetchError) {
        console.error("User fetch failed:", callerFetchError);
        return NextResponse.json(
          { success: false, error: "Internal server error" },
          { status: 500 }
        );
      }

      if (!callerData) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      if (
        callerData.phone_num.slice(-4) !== phone_num.slice(-4) ||
        callerData.created_at !== secure_validator
      ) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
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
      console.error("Credits fetch failed:", error);
      return NextResponse.json(
        { success: false, error: "Internal server error" },
        { status: 500 }
      );
    }

    const TOTAL_CREDITS = 3;
    const creditsUsed = data?.credits_used ?? 0;
    const callCredits = Math.max(0, TOTAL_CREDITS - creditsUsed);

    return NextResponse.json({
      success: true,
      callCredits,
      creditsUsed,
      totalCredits: TOTAL_CREDITS,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
