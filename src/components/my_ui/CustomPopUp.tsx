import { useEffect } from "react";

interface PopupProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Popup({ message, show, onClose }: PopupProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="
        fixed bottom-10 left-1/2 -translate-x-1/2
        bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
        border border-gray-300 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        px-5 py-3 rounded-xl shadow-lg
        max-w-md w-[90%] text-center font-semibold
        transition-all duration-300
      "
      style={{ backdropFilter: "blur(12px)" }}
    >
      {message}
    </div>
  );
}
