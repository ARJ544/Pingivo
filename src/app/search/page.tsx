import {
  getAllCookie,
  IsLoggedIn,
  getTempPhoneId,
} from "@/app/actions";
import SearchCar from "@/app/search/searchCarClient";
import { decryptPhone } from "@/lib/crypto";

export const metadata = {
  title: "Search a Car",
};

export default async function SearchPage() {
  const cookie = await getAllCookie();
  const isLoggedIn = await IsLoggedIn();
  let temp_phone = await getTempPhoneId();
  return (
    <SearchCar
      is_loggedin={isLoggedIn}
      phone_num={cookie.phone_num}
      temp_phone_number={temp_phone ?? ""}
    />
  );
}
