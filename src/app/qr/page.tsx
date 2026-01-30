import { IsLoggedIn } from "../actions";
import { redirect } from "next/navigation";
import GenerateQRClient from "@/app/qr/QrClient";

export const metadata = {
  title: "Generate QR",
};

export default async function GenerateQR() {
  const isLoggedIn = await IsLoggedIn();

  if (!isLoggedIn) {
    redirect("/login");
  }
  return (
    <GenerateQRClient/>
  );
}