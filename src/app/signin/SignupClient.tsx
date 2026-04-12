"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupClient() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        router.refresh();
        setTimeout(() => router.replace("/signin"), 2000);
        return;
      }

      try {
        const res = await fetch("/api/verify-phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_json_url: userObj.user_json_url })
        });

        if (!res.ok) throw new Error();

        setMessage("Phone verified successfully! Redirecting...");
        router.refresh();
        setTimeout(() => router.replace("/"), 800);
      } catch {
        setMessage("Something went wrong. Please try again.");
        router.refresh();
        setTimeout(() => router.replace("/signin"), 2000);
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">

        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Create Account or Login Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Signup or Login with your Phone Number
          </p>
        </div>

        <button
          onClick={handleCustomClick}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold py-3 rounded-lg transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify Phone Number"}
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
  );
}