"use client";

import { Html5Qrcode, Html5QrcodeResult } from "html5-qrcode";
import { useEffect, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Props {
  fps?: number;
  qrbox?: number;
  disableFlip?: boolean;
  qrCodeSuccessCallback: (text: string, result: Html5QrcodeResult) => void;
  qrCodeErrorCallback?: (error: any) => void;
}

export default function Html5QrcodePlugin({
  fps = 10,
  qrbox = 250,
  disableFlip = false,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());

        const scanner = new Html5Qrcode(qrcodeRegionId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps,
            qrbox: { width: qrbox, height: qrbox },
            disableFlip,
          },
          (text: string, result: Html5QrcodeResult) => {
            qrCodeSuccessCallback(text, result);
          },
          (err) => {
            if (qrCodeErrorCallback) qrCodeErrorCallback(err);
          }
        );
      } catch (err: any) {
        console.error("Camera error:", err);
        if (qrCodeErrorCallback) qrCodeErrorCallback(err);
      }
    };

    startScanner();

    return () => {
      const scanner = scannerRef.current;

      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => { });
      }
      scannerRef.current = null;
    };
  }, []);

  return <div id={qrcodeRegionId} className="w-full" />;
}