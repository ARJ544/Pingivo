import { getAllCookie, IsVerified, IsLoggedIn, getTempPhone } from "@/app/actions";
import SearchCar from "@/app/search/searchCarClient";

export default async function SearchPage() {
  const cookies = await getAllCookie();
  const isVerified = await IsVerified();
  const isLoggedIn = await IsLoggedIn();
  const temp_phone = await getTempPhone();
  return <SearchCar user_phone_number={cookies.phone_num} is_loggedin={isLoggedIn} is_verified={isVerified} temp_phone_number={temp_phone} />;
}
