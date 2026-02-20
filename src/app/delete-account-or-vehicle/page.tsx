import DeleteCarClient from "@/app/delete-account-or-vehicle/DeleteClient";
import { IsLoggedIn, getAllCookie } from "@/app/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Delete a Car",
};

export default async function DeleteCar() {
  const isLoggedIn = await IsLoggedIn();
  const vehi1_num = (await getAllCookie()).vehi1;
  const vehi2_num = (await getAllCookie()).vehi2;
  const secure_validator = (await getAllCookie()).secure_validator;

  if (!isLoggedIn || !secure_validator) {
    redirect("/login");
  }
  return <DeleteCarClient vehi1_num={vehi1_num} vehi2_num={vehi2_num} />;
}
