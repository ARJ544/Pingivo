import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { setAllCookie } from "@/app/actions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST() {
  const cookie = await cookies();
  const id = cookie.get("id")?.value;
  const secure_validator = cookie.get("secure_validator")?.value;
  if (!id) {
    return NextResponse.json({ error: "Login first" }, { status: 401 });
  }

  const isPhoneVerified = cookie.get("phone_verified");
  const { data: user } = await supabase
    .from("simplified_users")
    .select("update_profile_phone_temp, created_at, finder_id")
    .eq("id", id)
    .maybeSingle();

  const updateTempPhoneCookie = user?.update_profile_phone_temp;

  if (!updateTempPhoneCookie || isPhoneVerified?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  if ((user.created_at as string) != secure_validator) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 404 },
    );
  }

  const { data: updateData, error: updateError } = await supabase
    .from("simplified_users")
    .update({ phone_num: updateTempPhoneCookie, update_profile_phone_temp: null })
    .eq("id", id)
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

  cookie.delete("update_profile_phone_temp");
  cookie.delete("phone_verified");

  return NextResponse.json(
    { success: true, message: "Profile Updated Successfully" },
    { status: 201 },
  );
}
