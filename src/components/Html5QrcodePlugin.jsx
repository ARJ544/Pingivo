import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode";
import { useEffect, useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

interface Props {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  facingMode?: "environment" | "user";
  verbose?: boolean;
  qrCodeSuccessCallback: (text: string, result: Html5QrcodeResult) => void;
  qrCodeErrorCallback?: (error: string) => void;
}

const createConfig = (props: Props) => {
  const config: Record<string, any> = {};
  if (props.fps) config.fps = props.fps;
  if (props.qrbox) config.qrbox = props.qrbox;
  if (props.aspectRatio) config.aspectRatio = props.aspectRatio;
  if (props.disableFlip !== undefined) config.disableFlip = props.disableFlip;
  config.facingMode = props.facingMode ?? "environment";
  return config;
};

export default function Html5QrcodePlugin(props: Props) {
  const successCallbackRef = useRef(props.qrCodeSuccessCallback);
  const errorCallbackRef = useRef(props.qrCodeErrorCallback);

  useEffect(() => {
    successCallbackRef.current = props.qrCodeSuccessCallback;
    errorCallbackRef.current = props.qrCodeErrorCallback;
  });

  useEffect(() => {
    const config = createConfig(props);
    const verbose = props.verbose === true;

    if (!props.qrCodeSuccessCallback) {
      throw new Error("qrCodeSuccessCallback is required.");
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );

    html5QrcodeScanner.render(
      (text, result) => successCallbackRef.current(text, result),
      (error) => errorCallbackRef.current?.(error)
    );

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} />;
}
