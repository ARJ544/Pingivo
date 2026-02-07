import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { setAllCookie } from "@/app/actions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST() {
  const cookie = await cookies();
  const id = cookie.get("id")?.value;
  if (!id) {
    return NextResponse.json({ error: "Login first" }, { status: 401 });
  }

  const isPhoneVerified = cookie.get("phone_verified");
  const updateTempPhoneCookie = cookie.get("update_profile_phone_temp");

  if (!updateTempPhoneCookie || isPhoneVerified?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: updateData, error: updateError } = await supabase
    .from("users")
    .update({ phone_num: updateTempPhoneCookie.value })
    .eq("id", id)
    .select(
      "id, name, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, verified",
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

  const latestDetails = {
    loggedin: true,
    id: updateData.id,
    name: updateData.name,
    phone_num: updateData.phone_num,
    vehi1: updateData.vehi1,
    vehi1_name: updateData.vehi1_name,
    vehi2: updateData.vehi2,
    vehi2_name: updateData.vehi2_name,
    verified: updateData.verified,
  };

  setAllCookie(latestDetails);

  cookie.delete("update_profile_phone_temp");
  cookie.delete("phone_verified");
  return NextResponse.json(
    { success: true, message: "Profile Updated Successfully" },
    { status: 201 },
  );
}
