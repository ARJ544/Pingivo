"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import { Html5QrcodeResult } from "html5-qrcode";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";

export default function ScanPage() {
  const router = useRouter();
  const [result, setResult] = useState<string | null>(null);
  const [isUrl, setIsUrl] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const showModalRef = useRef(false);

  const isValidUrl = (text: string) => {
    try {
      const url = new URL(text);
      return ["https:", "http:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const onNewScanResult = useCallback(
    (decodedText: string, _decodedResult: Html5QrcodeResult) => {
      if (showModalRef.current) return;
      showModalRef.current = true;

      const url = isValidUrl(decodedText);

      if (url && FRONTEND_URL && decodedText.startsWith(FRONTEND_URL)) {
        router.push(decodedText);
        return;
      }

      setResult(decodedText);
      setIsUrl(url);
      setShowModal(true);
    },
    []
  );

  const closeModal = () => {
    showModalRef.current = false;
    setShowModal(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-md text-center rounded-2xl p-8 bg-white border border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          QR Code Scanner
        </h1>
        <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">
          Scan PingPing QR code using your camera
        </p>
        <div className="relative rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          />
          <div className="absolute w-full h-0.5 bg-blue-500 animate-scan" />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
            <h2 className="text-lg font-semibold mb-3 dark:text-white">
              Scan Result
            </h2>
            <p className="text-sm break-all text-gray-700 dark:text-gray-300 mb-4">
              {result}
            </p>
            {isUrl && result && (
              
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer block text-center mb-3 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Open Link
              </a>
            )}
            <button
              onClick={closeModal}
              className="cursor-pointer w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
