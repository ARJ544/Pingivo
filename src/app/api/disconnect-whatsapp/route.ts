import { NextResponse } from "next/server";
import { authenticateUser, supabase } from "@/lib/api-helpers";
import { generateSecretCode } from "@/app/api/verify-phone/route";

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

  return NextResponse.json({ success: true });
}