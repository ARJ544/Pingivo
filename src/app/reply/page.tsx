"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReplyPage() {
  const searchParams = useSearchParams();
  const [to, setTo] = useState<string | null>(null);
  const [waLink, setWaLink] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toParam = searchParams.get("to");

    if (toParam) {
      setTo(toParam);

      const message = `To: ${toParam}\nMessage: Please type your message`;
      const encodedMessage = encodeURIComponent(message);

      const link = `https://wa.me/916124530919?text=${encodedMessage}`;
      setWaLink(link);
    }

    setLoading(false);
  }, [searchParams]);

  const handleReply = () => {
    if (waLink) {
      window.open(waLink, "_blank");
    }
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );
  }

  if (!to) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Invalid request. No Bsuid found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-neutral-900 px-4 transition-colors duration-300">

      <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-white dark:bg-neutral-800 shadow-xl p-5 sm:p-6 text-center border border-gray-200 dark:border-neutral-700">

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
          Reply on WhatsApp
        </h2>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          You are about to send a reply to
        </p>

        {/* Number with ellipsis */}
        <p className="mt-2 text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
          {to}
        </p>

        {/* Buttons */}
        <div className="mt-5 flex gap-2 sm:gap-3">
          <button
            onClick={handleCancel}
            className="w-1/2 rounded-lg border border-gray-300 dark:border-neutral-600 py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            Not Reply
          </button>

          <button
            onClick={handleReply}
            className="w-1/2 rounded-lg bg-green-500 active:scale-95 hover:bg-green-600 text-white py-2.5 text-xs sm:text-sm font-semibold transition"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}