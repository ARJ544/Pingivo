import { NextResponse } from "next/server";
import { authenticateUser, supabase } from "@/lib/api-helpers";
import { generateSecretCode } from "@/app/api/verify-phone/route";
import { cookies } from "next/headers";

export async function POST() {
  const auth = await authenticateUser(true);

  if (!auth.success) {
    return auth.response;
  }

  const { id } = auth.user;
  const newToken = generateSecretCode();

  const { error } = await supabase
    .from("simplified_users")
    .update({ bsuid: null, token: newToken })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to disconnect WhatsApp" },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete("has_bsuid");

  return NextResponse.json({ success: true });
}