"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function VerifyPhoneUnknownUser({
  temp_phone,
  finder_id,
}: {
  temp_phone: string | undefined;
  finder_id?: string | undefined;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const queryFinderId = searchParams.get("next");
  const finderId = queryFinderId ?? finder_id;
  const safeFinderId = finderId ?? "re-scan-the-qr-code"

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasTempPhoneCookie = Boolean(temp_phone);

  useEffect(() => {
    if (hasTempPhoneCookie) {
      setMessage("Phone number already verified");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    document.querySelector(".pe_signin_button")?.appendChild(script);

    let called = false;

    window.phoneEmailListener = async (userObj: any) => {
      if (called) return;
      called = true;

      setLoading(true);
      setMessage("Verifying your phone number...");

      if (!userObj?.user_json_url) {
        setMessage("Phone verification failed. Please try again.");
        setTimeout(
          () => router.replace(`/search?finder_id=${encodeURIComponent(safeFinderId)}`),
          2000,
        );
        return;
      }

      try {
        const res = await fetch("/api/verify-phone-unknown-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url: userObj.user_json_url }),
        });

        if (!res.ok) throw new Error();

        setMessage("Phone verified successfully! Redirecting...");
        setTimeout(
          () => router.replace(`/search?finder_id=${encodeURIComponent(safeFinderId)}`),
          1500,
        );
      } catch {
        setMessage("Something went wrong. Please try again.");
        setTimeout(
          () => router.replace(`/search?finder_id=${encodeURIComponent(safeFinderId)}`),
          2000,
        );
      } finally {
        setLoading(false);
      }
    };

    return () => {
      window.phoneEmailListener = undefined;
    };
  }, [router]);

  return (
    <div>
      {(!hasTempPhoneCookie && !queryFinderId) && (
        <div className="h-12 w-40">
          <Button data-client-id="14661853409856503092" className={`pe_signin_button ${loading ? "pointer-events-none opacity-50" : ""} h-12 w-20 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-lg transition active:scale-[0.97]`}>

          </Button>
        </div>
      )}
      {(!hasTempPhoneCookie && queryFinderId) && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
          <div
            className={`pe_signin_button ${loading ? "pointer-events-none opacity-50" : ""}`}
            data-client-id="14661853409856503092"
          />
          {message && (
            <p className="text-lg font-medium text-center text-slate-700 dark:text-slate-300 px-4 max-w-md">
              {message}
            </p>
          )}
        </div>
      )}

      {message && (
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {message}
        </p>
      )}
    </div>
  );
}
