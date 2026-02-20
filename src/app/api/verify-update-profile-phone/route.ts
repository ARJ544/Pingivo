import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAllCookie } from "@/app/actions";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  const cookie = await cookies();
  const { user_json_url } = await req.json();
  const { id, secure_validator } = await getAllCookie();

  const response = await fetch(user_json_url);
  const data = await response.json();

  if (!data.user_country_code || !data.user_phone_number) {
    return NextResponse.json(
      { error: "Phone verification failed" },
      { status: 400 },
    );
  }

  const { data: user } = await supabase
    .from("users")
    .select("update_profile_phone_temp, created_at")
    .eq("id", id)
    .maybeSingle();
  
  const updateTempPhoneCookie = user?.update_profile_phone_temp;

  if (!updateTempPhoneCookie) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }
  if ((user.created_at as string) != secure_validator) {
    return NextResponse.json(
      { error: "Unauthorized access" },
      { status: 404 },
    );
  }

  const phone = updateTempPhoneCookie;
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
