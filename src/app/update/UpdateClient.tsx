"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateClient() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hiddenButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        setTimeout(() => router.refresh(), 1500);
        return;
      }

      try {
        const res = await fetch("/api/update/phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url: userObj.user_json_url }),
        });

        if (!res.ok) {
          const errorData = await res.json();

          setMessage(errorData.error || "Something went wrong.");

          setTimeout(() => {
            router.refresh();
          }, 1500);

          return;
        }

        setMessage("Phone verified successfully! Redirecting...");
        setTimeout(() => router.replace("/"), 1200);
      } catch {
        setMessage("Something went wrong. Please try again.");
        setTimeout(() => router.refresh(), 1500);
      } finally {
        setLoading(false);
      }
    };

    return () => {
      window.phoneEmailListener = undefined;
    };
  }, [router]);

  const handleCustomClick = () => {
    const realButton =
      hiddenButtonRef.current?.querySelector("button") ||
      hiddenButtonRef.current?.querySelector("a") ||
      hiddenButtonRef.current?.firstElementChild as HTMLElement | null;

    realButton?.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Update Phone
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Verify your New Phone Number to Update
          </p>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 px-4 py-3">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">⚠️ Important:</span> If you update your phone number, you must also{" "}
              <span className="font-semibold">disconnect and reconnect</span> your WhatsApp on Pingivo with the new number — otherwise messages will continue to be routed to your current connected WhatsApp number.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4 p-6">

            <button
              onClick={handleCustomClick}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-medium text-sm sm:text-[14.5px] py-3.5 rounded-full transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Verify Phone Number"}
            </button>

            <div className="hidden">
              <div
                ref={hiddenButtonRef}
                className="pe_signin_button"
                data-client-id="14661853409856503092"
              />
            </div>

            {message && (
              <p className="text-center mt-5 text-sm font-medium text-green-600 dark:text-green-400">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>

  );
}
