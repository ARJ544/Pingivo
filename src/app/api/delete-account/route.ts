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

    const { error } = await supabase.from("simplified_users").delete().eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    try {
      await deleteAllCookie();
    } catch (cookieError) {
      // console.error("Error deleting cookies:", cookieError);
    }

    return NextResponse.json(
      { message: "Account Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
