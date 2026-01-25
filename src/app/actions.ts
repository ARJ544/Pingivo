'use server'

import { cookies } from 'next/headers'

export async function IsLoggedIn() {
  const cookieStore = await cookies()
  const loggedin = cookieStore.get('loggedin')
  return loggedin?.value === 'true'
}

export async function setLoginCookie() {
  const cookieStore = await cookies();

  cookieStore.set("loggedin", "true", {
    httpOnly: true,   // cannot be accessed by JS
    secure: true,     // true in production
    sameSite: "lax",  // CSRF protection
    path: "/",        // available everywhere
    maxAge: 60 * 60 * 24 * 15,
  });
  cookieStore.set("name", "Abhinav Ranjan Jha");
  // cookieStore.set("vehi1", "BR01P8888");
  // cookieStore.set("vehi2", "BR01P8620");
}

export async function deleteAllCookie() {
  const cookieStore = await cookies();

  cookieStore.getAll().forEach(cookie => {
    cookieStore.delete(cookie.name);
  });
}

export async function getName() {
  const cookieStore = await cookies();
  const name = cookieStore.get("name");
  return name?.value;
}

export async function getVehiclesFromCookies() {
  const cookieStore = await cookies();
  const vehicles: { name: string; number: string }[] = [];
  const vehi1 = cookieStore.get("vehi1")?.value;
  const vehi2 = cookieStore.get("vehi2")?.value;

  if (vehi1) vehicles.push({ name: "Vehicle 1", number: vehi1 });
  if (vehi2) vehicles.push({ name: "Vehicle 2", number: vehi2 });

  return vehicles;
}
