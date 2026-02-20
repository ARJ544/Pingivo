import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAllCookie } from "@/app/actions";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
  try {
    const { loggedin, id, secure_validator } = await getAllCookie();

    if (!loggedin || !id) {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }

    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json(
        { error: "Please enter Phone Number" },
        { status: 401 },
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", id)
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: "Please Login again." },
        { status: 409 },
      );
    }
    if ((user.created_at as string) != secure_validator) {
      return NextResponse.json(
        { error: "Unauthorized Access" },
        { status: 409 },
      );
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("phone_num", phone)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ update_profile_phone_temp: phone })
      .eq("id", id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    const cookie = await cookies();
    cookie.set("update_profile_phone_temp", phone, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 60,
    });

    return NextResponse.json(
      {
        message: "Verify yourself",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
