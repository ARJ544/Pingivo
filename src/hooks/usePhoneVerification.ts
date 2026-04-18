"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function usePhoneVerification() {
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

  return {
    loading,
    message,
    hiddenButtonRef,
    handleCustomClick,
  };
}
