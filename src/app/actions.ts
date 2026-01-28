'use server'

import { cookies } from 'next/headers'

type UserCookie = {
  loggedin: boolean,
  name?: string,
  email?: string,
  password?: string,
  phone_num?: string,
  total_vehi?: string,
  vehi1?: string,
  vehi2?: string
}

export async function IsLoggedIn() {
  const cookieStore = await cookies()
  const loggedin = cookieStore.get('loggedin')
  return loggedin?.value === 'true'
}

export async function setAllCookie(user: Partial<UserCookie>) {
  const cookieStore = await cookies();

  cookieStore.set("loggedin", String(user.loggedin), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 15,
  });

  if (user.name) cookieStore.set("name", user.name);
  if (user.email) cookieStore.set("email", user.email);
  if (user.password) cookieStore.set("password", user.password);
  if (user.phone_num) cookieStore.set("phone_num", user.phone_num);
  if (user.vehi1) cookieStore.set("vehi1", user.vehi1);
  if (user.vehi2) cookieStore.set("vehi2", user.vehi2);
  const totalVehicles = [user.vehi1, user.vehi2].filter(Boolean).length;
  cookieStore.set("total_vehi", totalVehicles.toString());

}

export async function deleteAllCookie() {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach(cookie => {
    cookieStore.delete(cookie.name);
  });
}

export async function getAllCookie(): Promise<UserCookie> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const userCookie: UserCookie = {
    loggedin: false
  };

  allCookies.forEach(cookie => {
    switch (cookie.name) {
      case "loggedin":
        userCookie.loggedin = cookie.value === "true";
        break;
      case "name":
      case "email":
      case "password":
      case "phone_num":
      case "total_vehi":
      case "vehi1":
      case "vehi2":
        (userCookie as any)[cookie.name] = cookie.value;
        break;
    }
  });

  return userCookie;
}
