import { Html5QrcodeScanner, Html5QrcodeScannerState, Html5QrcodeScanType } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode";
import { useEffect, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Props {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (text: string, result: Html5QrcodeResult) => void;
  qrCodeErrorCallback?: (error: string) => void;
}

export default function Html5QrcodePlugin(props: Props) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const successCallbackRef = useRef(props.qrCodeSuccessCallback);
  const errorCallbackRef = useRef(props.qrCodeErrorCallback);

  useEffect(() => {
    successCallbackRef.current = props.qrCodeSuccessCallback;
    errorCallbackRef.current = props.qrCodeErrorCallback;
  });

  useEffect(() => {
    const config: any = {
      fps: props.fps ?? 10,
      qrbox: props.qrbox ?? 250,
      disableFlip: props.disableFlip ?? false,
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };
    if (props.aspectRatio) config.aspectRatio = props.aspectRatio;

    const verbose = props.verbose === true;
    const scanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
    scannerRef.current = scanner;

    scanner.render(
      (text, result) => successCallbackRef.current(text, result),
      (error) => errorCallbackRef.current?.(error)
    );

    return () => {
      const s = scannerRef.current;
      if (!s) return;
      try {
        const state = s.getState();
        if (
          state === Html5QrcodeScannerState.SCANNING ||
          state === Html5QrcodeScannerState.PAUSED
        ) {
          s.pause();
        }
      } catch (_) {}
      setTimeout(() => {
        try {
          s.clear().catch(() => {});
        } catch (_) {}
        scannerRef.current = null;
      }, 100);
    };
  }, []);

  return <div id={qrcodeRegionId} />;
}
