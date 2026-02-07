import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  const { name, email, phone, password } = JSON.parse(signupCookie.value);

  const { error: insertError } = await supabase.from("users").insert({
    name,
    email,
    phone_num: phone,
    password,
    verified: true,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Email or phone already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  cookie.delete("signup_temp");
  cookie.delete("phone_verified");
  return NextResponse.json(
    { success: true, message: "User registered successfully" },
    { status: 201 },
  );
}
