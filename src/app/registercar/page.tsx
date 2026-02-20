import { IsLoggedIn, getAllCookie } from "../actions";
import { redirect } from "next/navigation";
import RegisterClient from "@/app/registercar/RegisterClient";

export const metadata = {
  title: "Register a Car",
};

export default async function RegisterPage() {
  const isLoggedIn = await IsLoggedIn();
  const totaleVehicle = (await getAllCookie()).total_vehi;
  const secure_validator = (await getAllCookie()).secure_validator;

  if (!isLoggedIn || !secure_validator) {
    redirect("/login");
  }
  if (totaleVehicle === "2") {
    redirect("/home");
  }

  return <RegisterClient />;
}
