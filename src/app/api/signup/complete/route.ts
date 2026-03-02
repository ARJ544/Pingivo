import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

function generateSecretCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  const chars = [...bytes].map(b => (b % 36).toString(36)).join("");
  return chars.slice(0, 7) + "-" + chars.slice(7);
}

export async function POST() {
  const cookie = await cookies();
  const signupCookie = cookie.get("signup_temp");
  const verified = cookie.get("phone_verified");

  if (!signupCookie || verified?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone, password } = JSON.parse(signupCookie.value);

  const { data: insertData, error: insertError } = await supabase.from("users").insert({
    name,
    email,
    phone_num: phone,
    password,
    verified: true,
    secret_code: "",
  }).select(
    "id",
  );

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Email or phone already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  const secretcode = generateSecretCode();

  const { error: updateSecretError } = await supabase
    .from("users")
    .update({ secret_code: secretcode })
    .eq("id", insertData[0].id);

  if (updateSecretError) {
    return NextResponse.json(
      { error: updateSecretError.message },
      { status: 500 },
    );
  }

  const safeReceiver = escapeHtml(email);
  const emailData = {
    sender: {
      name: `ParkPing Safety Alerts`,
      email: process.env.DEVELOPER_EMAIL!,
    },
    to: [{ email: safeReceiver, name: escapeHtml(name) }],
    subject: "Account Registered Successfully on ParkPing",
    templateId: 4,
    params: {
      WHAT_DID: "Registered",
      NAME: escapeHtml(name),
      EMAIL: safeReceiver || "Your Email",
      SECRET_CODE: secretcode,
      WEBSITE_LINK: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password`,
    },
  };

  cookie.delete("signup_temp");
  cookie.delete("phone_verified");
  cookie.set("show_action_popup", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

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
      { error: "You were Signed Up but we failed to send you an email! You can Login", details: error },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: true, message: "User registered successfully" },
    { status: 201 },
  );
}
