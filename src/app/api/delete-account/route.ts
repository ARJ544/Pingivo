import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { deleteAllCookie, getAllCookie } from "@/app/actions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function DELETE() {
  try {
    const { loggedin, id, phone_num, secure_validator } = await getAllCookie();

    if (!loggedin || !id) {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("phone_num, created_at")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up." },
        { status: 404 },
      );
    }

    if ((user.phone_num as string).slice(-4) != phone_num?.slice(-4) || (user.created_at as string) != secure_validator) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 404 },
      );
    }

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await deleteAllCookie();

    return NextResponse.json(
      { message: "Account Deleted successfully" },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
