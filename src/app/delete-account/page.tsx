import DeleteAccountClient from "@/app/delete-account/DeleteClient";
import { IsLoggedIn, getAllCookie } from "@/app/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Delete Account",
};

export default async function DeleteAccount() {
  const isLoggedIn = await IsLoggedIn();
  const secure_validator = (await getAllCookie()).secure_validator;

  if (!isLoggedIn || !secure_validator) {
    redirect("/signup");
  }

  return <DeleteAccountClient />;
}
