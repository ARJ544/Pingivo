import { cookies } from "next/headers";
import VerifyPhone from "@/app/verify-phone/verify-phone-client";

export const metadata = {
  title: "Phone Verification",
};

export default async function VerifyPhonePage() {
  const cookie = await cookies();
  const signupTemp = cookie.get('signup_temp');

  return <VerifyPhone signup_temp={signupTemp?.name} />;
}
