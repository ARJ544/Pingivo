import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  const { name, email, phone, password } = await req.json();

  if (!name || !email || !phone || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .or(`email.eq.${email},phone_num.eq.${phone}`)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const cookie = await cookies();
  const hashedPassword = await bcrypt.hash(password, 10);

  cookie.set(
    "signup_temp",
    JSON.stringify({ name, email, phone, password: hashedPassword }),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60, // 10 minutes
    },
  );

  return NextResponse.json({ success: true });
}
