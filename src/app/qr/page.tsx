import { IsLoggedIn, getAllCookie } from "../actions";
import { redirect } from "next/navigation";
import GenerateQRClient from "@/app/qr/QrClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "Generate QR",
};

export default async function GenerateQR() {
  const cookie = await cookies();
  const isLoggedIn = await IsLoggedIn();
  const vehi1_num = (await getAllCookie()).vehi1
  const vehi2_num = (await getAllCookie()).vehi2

  if (!isLoggedIn) {
    redirect("/login");
  }
  return (
    <GenerateQRClient vehi1_num={vehi1_num} vehi2_num={vehi2_num}/>
  );
}