import DeleteCarClient from "@/app/deletecar/DeleteClient";
import { IsLoggedIn } from "@/app/actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Delete a Car",
};

export default async function DeleteCar() {
  const isLoggedIn = await IsLoggedIn();

  if (!isLoggedIn) {
    redirect("/login");
  }
  return (
    <DeleteCarClient />
  );
}