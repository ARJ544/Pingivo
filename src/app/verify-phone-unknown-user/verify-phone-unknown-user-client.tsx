"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function VerifyPhoneUnknownUser({
  temp_phone,
  finder_id,
}: {
  temp_phone: string | undefined;
  finder_id?: string | undefined;
}) {
  const router = useRouter();
  const hiddenButtonRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const queryFinderId = searchParams.get("next");
  const finderId = queryFinderId ?? finder_id;
  const safeFinderId = finderId ?? "re-scan-the-qr-code";

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasTempPhoneCookie = Boolean(temp_phone);

  useEffect(() => {
    if (hasTempPhoneCookie) {
      setMessage("Phone number already verified");
      return;
    }

    const container = hiddenButtonRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    container.appendChild(script);

    let called = false;

    window.phoneEmailListener = async (userObj: any) => {
      if (called) return;
      called = true;

      setLoading(true);
      setMessage("Verifying your phone number...");

      if (!userObj?.user_json_url) {
        setMessage("Phone verification failed. Please try again.");
        setTimeout(() => {
          window.location.href = `/search?finder_id=${encodeURIComponent(
            safeFinderId
          )}`;
        }, 1500);
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
        setTimeout(() => {
          window.location.href = `/search?finder_id=${encodeURIComponent(
            safeFinderId
          )}`;
        }, 1500);
      } catch {
        setMessage("Something went wrong. Please try again.");
        setTimeout(() => {
          window.location.href = `/search?finder_id=${encodeURIComponent(
            safeFinderId
          )}`;
        }, 1500);
      } finally {
        setLoading(false);
      }
    };

    return () => {
      window.phoneEmailListener = undefined;
    };
  }, [router, hasTempPhoneCookie, safeFinderId]);

  const handleCustomClick = () => {
    const realButton =
      hiddenButtonRef.current?.querySelector("button") ||
      hiddenButtonRef.current?.querySelector("a") ||
      (hiddenButtonRef.current?.firstElementChild as HTMLElement | null);

    realButton?.click();
  };


  return (
    <div>
      {!hasTempPhoneCookie && !queryFinderId && (
        <div className="w-full">
          <button
            onClick={handleCustomClick}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white dark:bg-red-400 dark:text-black text-[14.5px] font-medium py-3.5 rounded-full transition-all active:scale-[0.98]"
          >
            {loading ? "Verifying..." : "Verify Phone to Call"}
          </button>
        </div>
      )}

      {!hasTempPhoneCookie && queryFinderId && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
          <div className="w-full max-w-sm">
            <button
              onClick={handleCustomClick}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold py-3 rounded-lg transition active:scale-[0.97] disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Phone"}
            </button>
          </div>
          {message && (
            <p className="text-lg font-medium text-center text-slate-700 dark:text-slate-300 max-w-md">
              {message}
            </p>
          )}
        </div>
      )}

      <div className="hidden">
        <div
          ref={hiddenButtonRef}
          className="pe_signin_button"
          data-client-id="14661853409856503092"
        />
      </div>

      {message && !queryFinderId && (
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-3">
          {message}
        </p>
      )}
    </div>
  );
}