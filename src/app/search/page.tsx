import {
  getAllCookie,
  IsVerified,
  IsLoggedIn,
  getTempPhone,
} from "@/app/actions";
import SearchCar from "@/app/search/searchCarClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "Search a Car",
};

export default async function SearchPage() {
  const cookieStore = await cookies();
  const cookie = await getAllCookie();
  const isVerified = await IsVerified();
  const isLoggedIn = await IsLoggedIn();
  const temp_phone = await getTempPhone();
  return (
    <SearchCar
      user_phone_number={cookie.phone_num}
      owner_phone_number={cookieStore.get("owner_phone_num")?.value}
      is_loggedin={isLoggedIn}
      is_verified={isVerified}
      temp_phone_number={temp_phone}
    />
  );
}
