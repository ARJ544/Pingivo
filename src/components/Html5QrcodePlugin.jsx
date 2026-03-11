import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = (props) => {
  const config = {};
  if (props.fps) config.fps = props.fps;
  if (props.qrbox) config.qrbox = props.qrbox;
  if (props.aspectRatio) config.aspectRatio = props.aspectRatio;
  if (props.disableFlip !== undefined) config.disableFlip = props.disableFlip;
  return config;
};

export default function Html5QrcodePlugin(props) {

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
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear scanner", error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} />;
}