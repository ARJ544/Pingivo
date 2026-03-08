"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import "svg2pdf.js";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";

type Props = {
  finder_id: string;
};

export default function GenerateQRClient({ finder_id }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadPDF = async () => {
    if (!svgRef.current) return;

    setDownloading(true);

    const svg = svgRef.current;
    const PDF_WIDTH_CM = 9;
    const PDF_HEIGHT_CM = 13;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "cm",
      format: [PDF_WIDTH_CM, PDF_HEIGHT_CM],
      compress: true,
    });

    await pdf.svg(svg, {
      x: 0,
      y: 0,
      width: PDF_WIDTH_CM,
      height: PDF_HEIGHT_CM,
    });

    pdf.save(`parkping-qr-${finder_id}.pdf`);
    setDownloading(false);
  };

  const qrValue = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/search?finder_id=${finder_id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finder_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Your QR Code
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Display this on your vehicle windshield or anywhere else
          </p>
        </div>

        {/* Finder ID Display */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Your Finder ID</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={finder_id}
              readOnly
              className="w-full flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
            />
            <Button
              onClick={copyToClipboard}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* QR Code Preview */}
        <svg ref={svgRef} width="300" height="400" viewBox="0 0 600 900">
          <image href="/template.jpg" width="600" height="900" />

          {/* QR Code */}
          {finder_id && (
            <g transform="translate(155 340) scale(1)">
              <QRCodeSVG
                value={qrValue}
                size={290}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </g>
          )}

          {/* Finder ID at bottom */}
          <text
            x="300"
            y="50"
            fontSize="24"
            fontWeight="700"
            textAnchor="middle"
            fill="#000"
          >
            Finder ID: {finder_id}
          </text>
        </svg>

        {/* Download Button */}
        <Button
          onClick={downloadPDF}
          disabled={downloading}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg flex gap-2 items-center justify-center"
        >
          <Download size={18} />
          {downloading ? "Generating..." : "Download Sticker (PDF)"}
        </Button>

        {/* Info */}
        <div className="w-full rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-4 text-sm">
          <p className="text-blue-900 dark:text-blue-300">
            <strong>💡 Tip:</strong> Print and place this QR code anywhere so others can quickly reach you in case of issues.
          </p>
        </div>
      </div>
    </div>
  );
}
