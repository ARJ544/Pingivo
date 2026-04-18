"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type VerificationCallback = (userObj: any, setMessage: (msg: string) => void) => Promise<void>;

export function usePhoneEmailVerification(onVerification: VerificationCallback) {
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
        setLoading(false);
        return;
      }

      try {
        await onVerification(userObj, setMessage);
      } catch (err: any) {
        if (!message) {
          setMessage(err.message || "Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    return () => {
      window.phoneEmailListener = undefined;
    };
  }, [onVerification, message]);

  const handleCustomClick = useCallback(() => {
    const realButton =
      hiddenButtonRef.current?.querySelector("button") ||
      hiddenButtonRef.current?.querySelector("a") ||
      hiddenButtonRef.current?.firstElementChild as HTMLElement | null;

    realButton?.click();
  }, []);

  return {
    loading,
    message,
    hiddenButtonRef,
    handleCustomClick,
  };
}
