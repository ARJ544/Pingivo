import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { setAllCookie } from "@/app/actions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

function escapeHtml(str: string) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m]!,
  );
}

export async function POST() {
  const cookie = await cookies();
  const id = cookie.get("id")?.value;
  const secure_validator = cookie.get("secure_validator")?.value;
  if (!id) {
    return NextResponse.json({ error: "Login first" }, { status: 401 });
  }

  const isPhoneVerified = cookie.get("phone_verified");
  const { data: user } = await supabase
    .from("users")
    .select("update_profile_phone_temp, created_at")
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
    .from("users")
    .update({ phone_num: updateTempPhoneCookie, update_profile_phone_temp: null })
    .eq("id", id)
    .select(
      "id, name, email, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, secret_code, created_at, verified",
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
    secure_validator: updateData.created_at,
    name: updateData.name,
    phone_num: updateData.phone_num,
    vehi1: updateData.vehi1,
    vehi1_name: updateData.vehi1_name,
    vehi2: updateData.vehi2,
    vehi2_name: updateData.vehi2_name,
    verified: updateData.verified,
  };

  await setAllCookie(latestDetails);

  cookie.delete("update_profile_phone_temp");
  cookie.delete("phone_verified");

  const safeReceiver = escapeHtml(updateData.email);
  const secretcode = updateData.secret_code;

  const emailData = {
    sender: {
      name: `ParkPing Safety Alerts`,
      email: process.env.DEVELOPER_EMAIL!,
    },
    to: [{ email: safeReceiver, name: escapeHtml(updateData.name) }],
    subject: "Phone Number Updated on ParkPing",
    templateId: 5,
    params: {
      WHAT_DID: "Updated (Phone Number)",
      NAME: escapeHtml(updateData.name),
      EMAIL: safeReceiver || "Your Email",
      SECRET_CODE: secretcode || "Failed to fetch",
      WEBSITE_LINK: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password`,
    },
  };

  const BREVO_API_KEY = process.env.BREVO_API_KEY!;
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Your Phone Number was updated but we failed to send you an email!", details: error },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, message: "Profile Updated Successfully" },
    { status: 201 },
  );
}
