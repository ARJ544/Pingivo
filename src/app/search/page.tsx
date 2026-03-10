import {
  getAllCookie,
  getTempPhoneId,
  IsVerified,
} from "@/app/actions";
import SearchCar from "@/app/search/searchCarClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "Contact The Owner",
};

export default async function SearchPage() {
  const cookie = await getAllCookie();
  const isVerified = await IsVerified();
  
  const temp_phone_id = await getTempPhoneId();
  const temp_phone_number = (await cookies()).get("temp_phone_num")?.value;
  return (
    <SearchCar
      is_verified={isVerified}
      phone_num={cookie.phone_num}
      temp_phone_number={temp_phone_number}
      temp_phone_id={temp_phone_id}
    />
  );
}
