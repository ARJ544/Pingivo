'use server'

import { cookies } from 'next/headers'

type UserCookie = {
  loggedin: boolean,
  id?: string,
  name?: string,
  // email?: string,
  // password?: string,
  phone_num?: string,
  total_vehi?: string,
  vehi1?: string,
  vehi1_name?: string,
  vehi2?: string
  vehi2_name?: string
  verified: boolean
}

export async function IsLoggedIn() {
  const cookieStore = await cookies()
  const loggedin = cookieStore.get('loggedin')
  return loggedin?.value === 'true'
}
export async function IsVerified() {
  const cookieStore = await cookies()
  const verified = cookieStore.get('verified')
  return verified?.value === 'true'
}
export async function getTempPhone() {
  const cookieStore = await cookies()
  const temp_phone = cookieStore.get('temp_phone')
  return temp_phone?.value
}

export async function setAllCookie(user: Partial<UserCookie>) {
  const cookieStore = await cookies();

  const SEVEN_DAYS = 60 * 60 * 24 * 7;

  cookieStore.set("loggedin", String(user.loggedin ?? false), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS
  });
  cookieStore.set("verified", String(user.verified ?? false), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  if (user.id) cookieStore.set("id", user.id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  if (user.name) cookieStore.set("name", user.name, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  if (user.phone_num) cookieStore.set("phone_num", user.phone_num, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  if (user.vehi1) cookieStore.set("vehi1", user.vehi1, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  if (user.vehi1_name) cookieStore.set("vehi1_name", user.vehi1_name, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  if (user.vehi2) cookieStore.set("vehi2", user.vehi2, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  if (user.vehi2_name) cookieStore.set("vehi2_name", user.vehi2_name, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });

  const totalVehicles = [user.vehi1, user.vehi2].filter(Boolean).length;
  cookieStore.set("total_vehi", totalVehicles.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
  // if (user.email) cookieStore.set("email", user.email, { path: "/", maxAge: SEVEN_DAYS });
  // if (user.password) cookieStore.set("password", user.password, { path: "/", maxAge: SEVEN_DAYS });
}

export async function deleteAllCookie() {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach(cookie => {
    cookieStore.delete(cookie.name);
  });
}

export async function getAllCookie(): Promise<UserCookie> {
  const cookieStore = await cookies();
  const get = (name: string) => cookieStore.get(name)?.value

  const loggedin = get("loggedin") === 'true'
  const verified = get("verified") === 'true'

  return {
    loggedin,
    verified,
    id: get('id'),
    name: get('name'),
    // email: get('email'),
    // password: get('password'),
    phone_num: get('phone_num'),
    total_vehi: get('total_vehi'),
    vehi1: get('vehi1'),
    vehi1_name: get('vehi1_name'),
    vehi2: get('vehi2'),
    vehi2_name: get('vehi2_name'),
  }

}
