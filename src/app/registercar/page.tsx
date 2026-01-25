import { IsLoggedIn } from "../actions";
import { redirect } from "next/navigation";
import RegisterClient from "@/app/registercar/RegisterClient";

export default async function RegisterPage() {
  const isLoggedIn = await IsLoggedIn();

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <RegisterClient />;
}
