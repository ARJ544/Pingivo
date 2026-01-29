import { getAllCookie, IsVerified } from "@/app/actions";
import SearchCar from "@/app/search/searchCarClient";

export default async function SearchPage() {
  const cookies = await getAllCookie();
  const isVerified = await IsVerified();
  return <SearchCar user_phone_number={cookies.phone_num} is_verified={isVerified} />;
}
