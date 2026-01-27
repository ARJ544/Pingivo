import { IsLoggedIn } from "@/app/actions";
import { redirect } from "next/navigation";
import UpdateClient from "@/app/update/UpdateClient";

export default async function Update() {
  const isLoggedIn = await IsLoggedIn();

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
    <UpdateClient />
  );
}