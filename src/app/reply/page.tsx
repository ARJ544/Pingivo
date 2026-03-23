"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReplyPage() {
  const searchParams = useSearchParams();
  const [to, setTo] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [waLink, setWaLink] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const sanitizeForSend = (raw: string): string => {
    return raw
      .replace(/\n/g, " ")
      .replace(/\t/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500);
  };

  useEffect(() => {
    const toParam = searchParams.get("to");
    if (toParam) setTo(toParam);
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    if (to) {
      const sanitized = sanitizeForSend(message);
      const text = `To: ${to}\n\nMessage: ${sanitized || "Type your message here..."}`;
      setWaLink(`https://wa.me/916124530919?text=${encodeURIComponent(text)}`);
    }
  }, [to, message]);

  const handleReply = () => {
    if (waLink) window.open(waLink, "_blank");
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  const charCount = message.length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-300">Loading...</p>
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
          Reply on WhatsApp <span className="underline">Anonymously</span>
        </h2>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          You are about to send a reply to
        </p>

        {/* Recipient */}
        <p className="mt-2 text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
          {to}
        </p>

        {/* Message Box */}
        <div className="mt-4 text-left">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            maxLength={500}
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-800 dark:text-white text-xs sm:text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 placeholder-gray-400 dark:placeholder-gray-500 transition"
          />
          {/* char counter */}
          <p className={`text-right text-xs mt-1 ${charCount >= 500 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`}>
            {charCount}/500
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2 sm:gap-3">
          <button
            onClick={handleCancel}
            className="w-1/2 rounded-lg border border-gray-300 dark:border-neutral-600 py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            Not Reply
          </button>

          <button
            onClick={handleReply}
            className="w-1/2 rounded-lg bg-green-500 active:scale-95 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 text-xs sm:text-sm font-semibold transition"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}