"use client";

import { useEffect, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Props {
  fps?: number;
  qrbox?: number;
  disableFlip?: boolean;
  qrCodeSuccessCallback: (text: string, result: any) => void;
  qrCodeErrorCallback?: (error: any) => void;
}

export default function Html5QrcodePlugin({
  fps = 10,
  qrbox = 250,
  disableFlip = false,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: Props) {
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let scanner: any;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());

        scanner = new Html5Qrcode(qrcodeRegionId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps,
            qrbox: { width: qrbox, height: qrbox },
            disableFlip,
          },
          (text: string, result: any) => {
            qrCodeSuccessCallback(text, result);
          },
          (err: any) => {
            qrCodeErrorCallback?.(err);
          }
        );
      } catch (err: any) {
        console.error("Camera error:", err);
        qrCodeErrorCallback?.(err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch(() => { });
      }
      scannerRef.current = null;
    };
  }, []);

  return <div id={qrcodeRegionId} className="w-full" />;
}