import { getAllCookie, IsLoggedIn } from "@/app/actions";
import { redirect } from "next/navigation";
import UpdateClient from "@/app/update/UpdateClient";

export const metadata = {
  title: "Update Phone Number",
};

export default async function Update() {
  const isLoggedIn = await IsLoggedIn();
  const secure_validator = (await getAllCookie()).secure_validator;

  if (!isLoggedIn || !secure_validator) {
    redirect("/signup");
  }

  return <UpdateClient />;
}
