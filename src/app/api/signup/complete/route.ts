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

export async function POST() {
  const cookie = await cookies();
  const signupCookie = cookie.get("signup_temp");
  const verified = cookie.get("phone_verified");

  if (!signupCookie || verified?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone, password, unHashedPassword } = JSON.parse(signupCookie.value);

  const { error: insertError } = await supabase.from("users").insert({
    name,
    email,
    phone_num: phone,
    password,
    verified: true,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Email or phone already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 400 });
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
      WHAT_DID: "Registred",
      NAME: escapeHtml(name),
      EMAIL: safeReceiver || "Your Email",
      PASSWORD: unHashedPassword || "Failed to fetch",
      WEBSITE_LINK: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`,
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
