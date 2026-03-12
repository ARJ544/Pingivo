"use client";

import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode";
import { useEffect, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Props {
  fps?: number;
  qrbox?: number;
  disableFlip?: boolean;
  qrCodeSuccessCallback: (text: string, result: Html5QrcodeResult) => void;
}

export default function Html5QrcodePlugin(props: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const successCallbackRef = useRef(props.qrCodeSuccessCallback);

  useEffect(() => {
    successCallbackRef.current = props.qrCodeSuccessCallback;
  });

  useEffect(() => {
    const scanner = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      {
        fps: props.fps ?? 10,
        qrbox: { width: props.qrbox ?? 250, height: props.qrbox ?? 250 },
        disableFlip: props.disableFlip ?? false,
      },
      (text, result) => successCallbackRef.current(text, result),
      () => {}
    ).catch((err) => console.error("Failed to start scanner", err));

    return () => {
      const s = scannerRef.current;
      if (!s) return;
      if (s.isScanning) {
        s.stop()
          .then(() => s.clear())
          .catch(() => {});
      }
      scannerRef.current = null;
    };
  }, []);

  return <div id={qrcodeRegionId} />;
}
