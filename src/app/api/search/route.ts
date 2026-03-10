import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/api-helpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const finderId = searchParams.get("finder_id");

    if (!finderId) {
      return NextResponse.json(
        { error: "Finder ID is required" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("simplified_users")
      .select("finder_id")
      .eq("finder_id", finderId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cookie = await cookies();


    cookie.set("receiver_finder_id", user.finder_id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    return NextResponse.json({ 
      success: true,
      finder_id: user.finder_id
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
