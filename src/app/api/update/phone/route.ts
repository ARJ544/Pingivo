import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAllCookie, setAllCookie } from "@/app/actions";
import { authenticateUser, getUserByPhone } from "@/lib/api-helpers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  const { user_json_url } = await req.json();

  const response = await fetch(user_json_url);
  const data = await response.json();

  if (!data.user_country_code || !data.user_phone_number) {
    return NextResponse.json(
      { error: "Phone verification failed" },
      { status: 400 },
    );
  }

  const verifiedPhone = `${data.user_country_code}${data.user_phone_number}`;
  const authResult = await authenticateUser(true);
  if (!authResult.success) {
    return authResult.response;
  }
  const phoneCheck = await getUserByPhone(verifiedPhone);

  if (!phoneCheck.success) {
    return NextResponse.json(
      { error: "Failed to check phone number" },
      { status: 500 }
    );
  }

  const userAlreadyExists = phoneCheck.user !== null;
  if (userAlreadyExists) {
    return NextResponse.json(
      { error: "Phone Number already exists" },
      { status: 409 }
    );
  }
  const { data: updateData, error: updateError } = await supabase
    .from("simplified_users")
    .update({ phone_num: verifiedPhone })
    .eq("id", authResult.user.id)
    .select(
      "id, phone_num, finder_id, created_at",
    )
    .single();

  if (updateError) {
    if (updateError.code === "23505") {
      return NextResponse.json(
        { error: "Phone Number already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }
  if (!updateData) {
    return NextResponse.json(
      { error: "May be Updated but not Guaranteed, Logout then Login Back" },
      { status: 400 },
    );
  }

  await setAllCookie({
    loggedin: true,
    id: updateData.id,
    secure_validator: updateData.created_at,
    phone_num: updateData.phone_num,
    finder_id: updateData.finder_id,
    verified: true,
  });

  return NextResponse.json({ success: true });
}
