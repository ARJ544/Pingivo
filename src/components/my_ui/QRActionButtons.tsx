"use client";

import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRActionButtonsProps {
  downloading: boolean;
  sharing: boolean;
  onDownload: () => void;
  onShare: () => void;
}

export default function QRActionButtons({
  downloading,
  sharing,
  onDownload,
  onShare,
}: QRActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onDownload}
        disabled={downloading}
        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        {downloading ? "Generating..." : "Download Sticker"}
      </Button>

      <Button
        onClick={onShare}
        disabled={sharing}
        variant="outline"
        className="h-11 px-5 rounded-xl flex items-center gap-2 font-bold border-slate-200 dark:border-slate-700"
      >
        <Share2 className="w-4 h-4" />
        {sharing ? "Preparing..." : "Share PDF"}
      </Button>
    </div>
  );
}
