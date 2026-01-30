import { IsLoggedIn } from "@/app/actions";
import { redirect } from "next/navigation";
import LoginClient from "@/app/login/LoginClient";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const isLoggedIn = await IsLoggedIn();

  if (isLoggedIn) {
    redirect("/home");
  }

  return <LoginClient />;
}
