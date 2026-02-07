"use client";

import { useEffect, useState } from "react";

export default function OnlineOfflineComponent() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("navigator" in globalThis)) return;

    setIsOnline(globalThis.navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    globalThis.addEventListener("online", handleOnline);
    globalThis.addEventListener("offline", handleOffline);

    return () => {
      globalThis.removeEventListener("online", handleOnline);
      globalThis.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!visible || isOnline === null) return null;

  return (
    <div className="fixed bottom-6 sm:bottom-8 left-1/2 z-1000 -translate-x-1/2 pointer-events-none">
      <div
        className={`
          flex items-center gap-2.5 
          px-5 py-2.5 
          text-sm font-medium tracking-tight
          rounded-2xl 
          shadow-2xl shadow-black/20
          backdrop-blur-xl bg-white/10 border border-white/20
          transition-all duration-300 ease-in-out
          ${isOnline
            ? "bg-linear-to-r from-emerald-600/80 to-teal-600/80 text-white border-emerald-400/30"
            : "bg-linear-to-r from-rose-600/80 to-red-600/80 text-white border-rose-400/30"
          }
        `}
      >
        <div className="relative flex h-5 w-5 items-center justify-center">
          {isOnline ? (
            <span className="relative flex h-3 w-3">
              {/* Pulsing ring - super modern online vibe */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              {/* Solid center dot */}
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-50 ring-2 ring-emerald-400/60"></span>
            </span>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </div>

        <span className="select-none">
          {isOnline ? "Back online 🟢" : "You're offline 🔴"}
        </span>
      </div>
    </div>
  );
}