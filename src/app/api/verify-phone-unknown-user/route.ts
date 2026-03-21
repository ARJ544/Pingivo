import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { IsVerified } from "@/app/actions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  const { user_json_url } = await req.json();

  const response = await fetch(user_json_url);
  const data = await response.json();

  if (!data.user_country_code || !data.user_phone_number) {
    return NextResponse.json(
      { error: "Phone verification failed" },
      { status: 400 },
    );
  }

  const cookie = await cookies();
  const isVerified = await IsVerified();

  const verifiedPhone = `${data.user_country_code}${data.user_phone_number}`;

  const { data: tempPhoneData, error: tempPhoneError } = await supabase
    .from("temporary_phone")
    .upsert({ temp_phone: verifiedPhone }, { onConflict: "temp_phone" })
    .select("id, temp_phone")
    .single();

  if (tempPhoneError || !tempPhoneData) {
    console.error("Temporary phone upsert failed:", tempPhoneError);
    return NextResponse.json({ error: tempPhoneError?.message ?? "Failed" }, { status: 500 });
  }

  const temp_phone_id = tempPhoneData.id;
  const temp_phone_num = tempPhoneData.temp_phone;

  const ONE_HOUR = 60 * 60;

  cookie.set("temp_phone_id", temp_phone_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_HOUR,
  });
  cookie.set("temp_phone_num", temp_phone_num.slice(-4), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_HOUR,
  });
  if (!isVerified) {
    cookie.set("verified", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_HOUR,
    });
  }

  return NextResponse.json({ success: true });
}
