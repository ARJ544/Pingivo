import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

function generateSecretCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  const chars = [...bytes].map(b => (b % 36).toString(36)).join("");
  return chars.slice(0, 7) + "-" + chars.slice(7);
}

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  if (!phone || !password) {
    return NextResponse.json({ error: "Phone and password required" }, { status: 400 });
  }

  const { data: existingUser } = await supabase
    .from("simplified_users")
    .select("id")
    .eq("phone_num", phone)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ error: "Phone number already registered" }, { status: 409 });
  }

  const cookie = await cookies();
  const hashedPassword = await bcrypt.hash(password, 10);
  const secretCode = generateSecretCode();
  const finderId = generateSecretCode();

  cookie.set(
    "signup_temp",
    JSON.stringify({ 
      phone, 
      password: hashedPassword,
      secret_code: secretCode,
      finder_id: finderId 
    }),
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
