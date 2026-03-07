import {
  getAllCookie,
  IsLoggedIn,
  getTempPhone,
} from "@/app/actions";
import SearchCar from "@/app/search/searchCarClient";
import { decryptPhone } from "@/lib/crypto";

export const metadata = {
  title: "Search a Car",
};

export default async function SearchPage() {
  const cookie = await getAllCookie();
  const isLoggedIn = await IsLoggedIn();
  let temp_phone = await getTempPhone();
  if (temp_phone) temp_phone = await decryptPhone(temp_phone)
  return (
    <SearchCar
      is_loggedin={isLoggedIn}
      phone_num={cookie.phone_num}
      temp_phone_number={temp_phone ?? ""}
    />
  );
}
