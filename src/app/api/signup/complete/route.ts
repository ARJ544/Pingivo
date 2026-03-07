import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST() {
  const cookie = await cookies();
  const signupCookie = cookie.get("signup_temp");
  const verified = cookie.get("phone_verified");

  if (!signupCookie || verified?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone, password, secret_code, finder_id } = JSON.parse(signupCookie.value);

  const { data: insertData, error: insertError } = await supabase
    .from("simplified_users")
    .insert({
      phone_num: phone,
      password,
      secret_code,
      finder_id,
    })
    .select("id, secret_code");

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  cookie.delete("signup_temp");
  cookie.delete("phone_verified");
  cookie.set("show_secret_code", insertData[0].secret_code, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return NextResponse.json({ success: true, id: insertData[0].id, message: "User registered successfully" });

}
