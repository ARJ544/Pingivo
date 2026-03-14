"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupClient() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const refreshedOnce = useRef(false);

  useEffect(() => {
    if (!refreshedOnce.current) {
      refreshedOnce.current = true;
      router.refresh();
    }
  }, [router]);

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
        setTimeout(() => router.replace("/signup"), 2000);
        return;
      }

      try {
        const res = await fetch("/api/verify-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url: userObj.user_json_url }),
        });

        if (!res.ok) throw new Error();

        setMessage("Phone verified successfully! Redirecting...");
        setTimeout(() => router.replace("/"), 1500);
      } catch {
        setMessage("Something went wrong. Please try again.");
        setTimeout(() => router.replace("/signup"), 2000);
      } finally {
        setLoading(false);
      }
    };

    return () => {
      window.phoneEmailListener = undefined;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">

        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Create Account or Login Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Signup or Login with your Phone Number
          </p>
        </div>

        {/* Phone */}
        <div className="flex justify-center">
          <div
            className={`pe_signin_button ${loading ? "pointer-events-none opacity-50" : ""}`}
            data-client-id="14661853409856503092"
          />
        </div>

        {message && (
          <p className="text-xl text-green-600 text-center mt-4">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}       
