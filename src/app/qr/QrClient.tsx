"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import "svg2pdf.js";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check, Share2 } from "lucide-react";
import { Sora } from "next/font/google";
import { Input } from "@/components/ui/input";
import { COMPANY_NAME } from "@/config/company";

const sora = Sora({ subsets: ["latin"], weight: ["700", "800"] });

type Props = { finder_id: string };

const CW = 360;
const CH = 500;

const TEMPLATES = [
  { id: "0", label: "1", src: "/template0.jpg", defaultSize: 160, qrPos: { x: CW / 2 - 79, y: CH / 2 - 113 } },
  { id: "1", label: "2", src: "/template1.jpg", defaultSize: 160, qrPos: { x: CW / 2 - 80, y: CH / 2 - 118 } },
];


export default function GenerateQRClient({ finder_id }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [qrSize, setQrSize] = useState(160);
  const [qrPos, setQrPos] = useState({ x: CW / 2 - 79, y: CH / 2 - 113 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const qrValue = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/search?finder_id=${finder_id}`;

  const downloadPDF = async () => {
    if (!svgRef.current) return;
    setDownloading(true);
    const pdf = new jsPDF({ orientation: "portrait", unit: "cm", format: [9, 12], compress: true });
    await pdf.svg(svgRef.current, { x: 0, y: 0, width: 9, height: 12 });
    pdf.save(`${COMPANY_NAME}-template[${template.label}]-ID-${finder_id}.pdf`);
    setDownloading(false);
  };

  const shareQR = async () => {
    if (!svgRef.current || !navigator.share) return;
    const pdf = new jsPDF({ orientation: "portrait", unit: "cm", format: [9, 12], compress: true });
    await pdf.svg(svgRef.current, { x: 0, y: 0, width: 9, height: 12 });
    const blob = pdf.output("blob");
    const file = new File([blob], `${COMPANY_NAME}-qr-${finder_id}.pdf`, { type: "application/pdf" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: `${COMPANY_NAME} QR Code` });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finder_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080c10] text-slate-900 dark:text-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-10">

        <div className="flex flex-col gap-1">
          <h1 className={`${sora.className} text-3xl font-extrabold tracking-tight`}>Your QR Code</h1>
          <p className="text-sm text-slate-400">Choose a template, then download your sticker.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── LEFT: controls ── */}
          <div className="flex flex-col gap-6">

            {/* Finder ID */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your Finder ID</p>
              <div className="flex items-center gap-1">
                <Input
                  readOnly
                  value={finder_id}
                  className="w-1 flex-1 px-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-mono text-sm text-slate-700 dark:text-slate-200"
                />
                <Button onClick={copyToClipboard} size="sm" variant="outline" className="h-10 w-10 p-0 rounded-xl">
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            {/* Template picker */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Choose Template</p>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTemplate(t); setQrSize(t.defaultSize); setQrPos(t.qrPos) }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-colors aspect-3/4 bg-slate-100 dark:bg-slate-800
                      ${template.id === t.id
                        ? "border-blue-500"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                  >
                    
                    <img src={t.src} alt={t.label} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 py-1">
                      <p className="text-white text-xs font-bold text-center">{t.label}</p>
                    </div>
                    {template.id === t.id && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={downloadPDF}
                disabled={downloading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Generating..." : "Download Sticker"}
              </Button>
              <Button
                onClick={shareQR}
                variant="outline"
                className="h-12 px-5 rounded-xl flex items-center gap-2 font-bold border-slate-200 dark:border-slate-700"
              >
                <Share2 className="w-4 h-4" />
                Share PDF
              </Button>
            </div>
          </div>

          {/* ── RIGHT: preview ── */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Preview</p>

            <div
              ref={canvasRef}
              className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md select-none w-full h-full"
              style={{ aspectRatio: `${CW} / ${CH}` }}
            >
              
              <svg
                ref={svgRef}
                viewBox={`0 0 ${CW} ${CH}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              >
                <image href={template.src} width={CW} height={CH} preserveAspectRatio="xMidYMid slice" />
                <g transform={`translate(${qrPos.x}, ${qrPos.y})`}>
                  <QRCodeSVG value={qrValue} size={qrSize} level="M" bgColor="#ffffff" fgColor="#000000" />
                </g>
              </svg>
            </div>

            <p className="text-xs text-slate-400">PDF output will be print quality.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
