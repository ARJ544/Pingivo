import { IsLoggedIn } from "@/app/actions";
import { redirect } from "next/navigation";
import SignupClient from "@/app/signin/SignupClient";

export const metadata = {
  title: "SignUp",
};

export default async function LoginPage() {
  const isLoggedIn = await IsLoggedIn();

  if (isLoggedIn) {
    redirect("/");
  }

  return <SignupClient />;
}
