import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carNumber = searchParams.get("crnm")?.toUpperCase();

    if (!carNumber) {
      return NextResponse.json(
        { error: "Car number is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("users")
      .select("name, vehi1, vehi1_name, vehi2, vehi2_name")
      .or(`vehi1.eq.${carNumber},vehi2.eq.${carNumber}`)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
