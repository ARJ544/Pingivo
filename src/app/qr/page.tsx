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

  if (!isLoggedIn || !secure_validator || !id) {
    redirect("/signin");
  }

  const finder_id = (await getFinderIdById(id)).user;

  if (!finder_id) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#080c10] flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Failed to fetch details
          </p>
          <p className="text-sm text-slate-400">
            Please refresh the page or{" "}
            <a href="/signin" className="text-blue-500 hover:underline">
              sign in again
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return <GenerateQRClient finder_id={finder_id} />;
}
