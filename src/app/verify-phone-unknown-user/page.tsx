import { getTempPhoneId } from "@/app/actions";
import VerifyPhoneUnknownUser from "@/app/verify-phone-unknown-user/verify-phone-unknown-user-client";

export const metadata = {
  title: "Temporary Phone Verification",
};

export default async function VerifyPhoneUnknownUserPage() {
  const tempPhone = await getTempPhoneId();

  return <VerifyPhoneUnknownUser temp_phone={tempPhone} />;
}
