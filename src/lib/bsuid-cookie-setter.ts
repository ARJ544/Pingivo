"use server";

import { cookies } from "next/headers";

export async function setBsuidCookieAction() {
  const cookieStore = await cookies();
  cookieStore.set("has_bsuid", "true", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}