import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { authenticateUser, supabase } from "@/lib/api-helpers";
import { setAllCookie } from "@/app/actions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authResult = await authenticateUser(true);
    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.user.id;
    const { password } = await request.json();


    if (!password) {
      return NextResponse.json(
        { error: "Please a password to update" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const { data: updated, error: updateError } = await supabase
      .from("simplified_users")
      .update(updateData)
      .eq("id", userId)
      .select("id, phone_num, created_at, finder_id")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    if (!updated) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await setAllCookie({
      loggedin: true,
      id: updated.id,
      secure_validator: updated.created_at,
      phone_num: updated.phone_num,
      finder_id: updated.finder_id,
      verified: true,
    });

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
