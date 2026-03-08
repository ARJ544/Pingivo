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

  let temp_phone_id: string;
  const { data: getTempPhoneData, error: getTempPhoneError } = await supabase
    .from("temporary_phone")
    .select("id")
    .eq("temp_phone", verifiedPhone)
    .maybeSingle()

  if (getTempPhoneError || !getTempPhoneData) {
    const { data: insertData, error: insertError } = await supabase
      .from("temporary_phone")
      .insert({ temp_phone: verifiedPhone })
      .select("id")
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    temp_phone_id = insertData.id;
  } else {
    temp_phone_id = getTempPhoneData.id;
  }

  const ONE_HOUR = 60 * 60;

  cookie.set("temp_phone_id", temp_phone_id, {
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
