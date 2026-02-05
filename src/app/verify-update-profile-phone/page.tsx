import VerifyUpdateProfilePhoneClient from "@/app/verify-update-profile-phone/verify-update-profile-phone-client";
import { cookies } from "next/headers";

export const metadata = {
  title: "Verify Phone - Update Profile",
};

export default async function VerifyPhoneUnknownUserPage() {
  const cookie = await cookies()
  const updating = cookie.get('update_profile_phone_temp')

  return <VerifyUpdateProfilePhoneClient update_temp={updating?.value}/>;
}
