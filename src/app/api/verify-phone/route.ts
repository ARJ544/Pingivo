import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

  const cookie = await cookies();
  const signupCookie = cookie.get("signup_temp");

  if (!signupCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone } = JSON.parse(signupCookie.value);
  const verifiedPhone = `${data.user_country_code}${data.user_phone_number}`;

  if (verifiedPhone !== phone) {
    return NextResponse.json(
      { error: "Phone number mismatch" },
      { status: 403 },
    );
  }

  cookie.set("phone_verified", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return NextResponse.json({ success: true });
}
