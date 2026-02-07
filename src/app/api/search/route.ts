import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carNumber = searchParams.get("crnm")?.toUpperCase();

    if (!carNumber) {
      return NextResponse.json(
        { error: "Car number is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("name, email, phone_num, vehi1, vehi1_name, vehi2, vehi2_name")
      .or(`vehi1.eq.${carNumber},vehi2.eq.${carNumber}`)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const cookie = await cookies();
    cookie.set("owner_phone_num", data.phone_num, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });
    cookie.set("owner_email", data.email, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });
    cookie.set("owner_name", data.name, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });
    const clientData = {
      name: data.name,
      vehi1: data.vehi1,
      vehi1_name: data.vehi1_name,
      vehi2: data.vehi2,
      vehi2_name: data.vehi2_name,
    };

    return NextResponse.json(clientData);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
