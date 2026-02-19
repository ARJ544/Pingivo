import { IsLoggedIn } from "@/app/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "@/app/login/LoginClient";

export const metadata = {
  title: "Login",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const isLoggedIn = await IsLoggedIn();
  const showActionPopup = cookieStore.get("show_action_popup");

  if (isLoggedIn) {
    redirect("/home");
  }

  return <LoginClient showActionPopup={showActionPopup?.name} />;
}
