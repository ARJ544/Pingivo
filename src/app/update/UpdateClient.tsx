"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateClient() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

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
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex h-30 flex-col items-center justify-center gap-4">

            <div
              className={`pe_signin_button ${loading ? "pointer-events-none opacity-50" : ""}`}
              data-client-id="14661853409856503092"
            />

            {message && (
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>

  );
}
