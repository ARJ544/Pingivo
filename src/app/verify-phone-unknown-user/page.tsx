import { getTempPhone } from "@/app/actions";
import VerifyPhoneUnknownUser from "@/app/verify-phone-unknown-user/verify-page-unknown-user-client";
export default async function VerifyPhoneUnknownUserPage() {
  const tempPhone = await getTempPhone();
  
  return <VerifyPhoneUnknownUser temp_phone={tempPhone} />;
}
