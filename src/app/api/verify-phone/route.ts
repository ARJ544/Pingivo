import { setAllCookie } from "@/app/actions";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

function generateSecretCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  const chars = [...bytes].map(b => (b % 36).toString(36)).join("");
  return chars.slice(0, 7) + "-" + chars.slice(7);
}

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

  if (!verifiedPhone) {
    return NextResponse.json(
      { error: "Phone number not found!" },
      { status: 403 },
    );
  }
  const secret_code = generateSecretCode();
  const finder_id = generateSecretCode();

  const { data: getExistingUserData, error: getExistingUserError } = await supabase
    .from("simplified_users")
    .select("id, phone_num, created_at, finder_id, secret_code")
    .eq("phone_num", verifiedPhone)
    .maybeSingle();

  if (getExistingUserError || !getExistingUserData) {
    const { data: insertData, error: insertError } = await supabase
      .from("simplified_users")
      .insert({
        phone_num: verifiedPhone,
        secret_code: secret_code,
        finder_id: finder_id,
      })
      .select("id, phone_num, created_at, finder_id, secret_code")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    await setAllCookie({
      loggedin: true,
      id: insertData.id,
      secure_validator: insertData.created_at,
      phone_num: insertData.phone_num,
      finder_id: insertData.finder_id,
      verified: true,
    });
  } else {
    await setAllCookie({
      loggedin: true,
      id: getExistingUserData.id,
      secure_validator: getExistingUserData.created_at,
      phone_num: getExistingUserData.phone_num,
      finder_id: getExistingUserData.finder_id,
      verified: true,
    });
  }




  const cookie = await cookies();
  cookie.set("phone_verified", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });

  return NextResponse.json({ success: true });
}
