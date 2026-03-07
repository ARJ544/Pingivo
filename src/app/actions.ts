"use server";

import { cookies } from "next/headers";

type UserCookie = {
  loggedin: boolean;
  secure_validator: string;
  id?: string;
  phone_num?: string;
  finder_id?: string;
  total_vehi?: string;
  verified: boolean;
};

export async function IsLoggedIn() {
  const cookieStore = await cookies();
  const id = cookieStore.get("id");
  const secure_validator = cookieStore.get("secure_validator");
  return Boolean(id && secure_validator);
}

export async function IsVerified() {
  const cookieStore = await cookies();
  const verified = cookieStore.get("verified");
  return verified?.value === "true";
}

export async function getTempPhone() {
  const cookieStore = await cookies();
  const temp_phone = cookieStore.get("temp_phone");
  return temp_phone?.value;
}

export async function deleteShowActionPopupCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("show_action_popup");
}

export async function setAllCookie(user: Partial<UserCookie>) {
  const cookieStore = await cookies();

  const SEVEN_DAYS = 60 * 60 * 24 * 7;

  if (user.secure_validator)
    cookieStore.set("secure_validator", String(user.secure_validator), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    });
  
  if (user.id)
    cookieStore.set("id", user.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    });

  if (user.phone_num)
    cookieStore.set("phone_num", user.phone_num.slice(-4), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    });

  if (user.finder_id)
    cookieStore.set("finder_id", user.finder_id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    });

  cookieStore.set("loggedin", String(user.loggedin ?? (Boolean(user.id && user.secure_validator))), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  cookieStore.set("verified", String(user.verified ?? false), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export async function deleteAllCookie() {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });
}

export async function getAllCookie(): Promise<UserCookie> {
  const cookieStore = await cookies();
  const get = (name: string) => cookieStore.get(name)?.value;

  const loggedin = Boolean(get("id") && get("secure_validator"));
  const verified = get("verified") === "true";

  return {
    loggedin,
    verified,
    secure_validator: get("secure_validator") || "",
    id: get("id"),
    phone_num: get("phone_num"),
    finder_id: get("finder_id"),
    total_vehi: get("total_vehi"),
  };
}
