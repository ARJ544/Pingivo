import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
  try {
    const { email, secretcode, newPassword } = await request.json();

    if (!email || !secretcode || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, secret_code")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 },
      );
    }

    if (secretcode !== user.secret_code) {
      return NextResponse.json(
        { error: "Invalid secret code" },
        { status: 401 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
