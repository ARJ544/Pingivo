import { IsLoggedIn, getAllCookie } from "../actions";
import { redirect } from "next/navigation";
import RegisterClient from "@/app/registercar/RegisterClient";

export default async function RegisterPage() {
  const isLoggedIn = await IsLoggedIn();
  const totaleVehicle = (await getAllCookie()).total_vehi;

  if (!isLoggedIn) {
    redirect("/login");
  }
  if (totaleVehicle === "2") {
    redirect("/home");
  }

  return <RegisterClient />;
}
