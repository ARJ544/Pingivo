import { IsLoggedIn, getAllCookie } from "@/app/actions";
import { redirect } from "next/navigation";
import GenerateQRClient from "@/app/qr/QrClient";

export const metadata = {
  title: "Generate QR",
};

export default async function GenerateQR() {
  const isLoggedIn = await IsLoggedIn();
  const vehi1_num = (await getAllCookie()).vehi1;
  const vehi2_num = (await getAllCookie()).vehi2;
  const secure_validator = (await getAllCookie()).secure_validator;

  if (!isLoggedIn || !secure_validator) {
    redirect("/login");
  }
  return <GenerateQRClient vehi1_num={vehi1_num} vehi2_num={vehi2_num} />;
}
