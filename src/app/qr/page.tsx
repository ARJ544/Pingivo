import { IsLoggedIn, getAllCookie } from "@/app/actions";
import { redirect } from "next/navigation";
import GenerateQRClient from "@/app/qr/QrClient";
import { getFinderIdById } from "@/lib/api-helpers";

export const metadata = {
  title: "Generate QR",
};

export default async function GenerateQR() {
  const isLoggedIn = await IsLoggedIn();
  let { id, secure_validator } = await getAllCookie();
  if(!id){
    id = "";
  }
  const finder_id = (await getFinderIdById(id)).user;

  if (!isLoggedIn || !secure_validator || !finder_id) {
    redirect("/login");
  }

  return <GenerateQRClient finder_id={finder_id} />;
}
