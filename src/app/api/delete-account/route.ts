import { NextResponse } from "next/server";
import { deleteAllCookie } from "@/app/actions";
import { authenticateUser, supabase } from "@/lib/api-helpers";

export async function DELETE() {
  try {
    const authResult = await authenticateUser(true);
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user.id;

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await deleteAllCookie();

    return NextResponse.json(
      { message: "Account Deleted successfully" },
      { status: 200 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
