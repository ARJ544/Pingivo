import { setAllCookie } from "@/app/actions";
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
    const { phone_num, password } = await request.json();

    if (!phone_num || !password) {
      return NextResponse.json(
        { error: "Phone number and password are required" },
        { status: 400 },
      );
    }

    const { data: user, error: fetchError } = await supabase
      .from("simplified_users")
      .select("id, phone_num, password, created_at, finder_id, secret_code")
      .eq("phone_num", phone_num)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Phone number not found. Please sign up." },
        { status: 404 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid phone number or password" },
        { status: 401 },
      );
    }

    await setAllCookie({
      loggedin: true,
      id: user.id,
      secure_validator: user.created_at,
      phone_num: user.phone_num,
      finder_id: user.finder_id,
      verified: true,
    });

    return NextResponse.json(
      {
        message: "Logged in successfully",
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
