"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import jsPDF from "jspdf";
import "svg2pdf.js";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import { Syne } from "next/font/google";
import { Input } from "@/components/ui/input";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

type Props = { finder_id: string };

const CW = 360;
const CH = 500;
const MIN_QR = 60;
const MAX_QR = 280;

const TEMPLATES = [
  { id: "0", label: "0", src: "/template.jpg", defaultSize: 175, qrPos: { x: CW / 2 - 87, y: CH / 2 - 65 } },
  { id: "1", label: "1", src: "/template2.jpg", defaultSize: 158, qrPos: { x: CW / 2 - 79, y: CH / 2 - 65 } },
  { id: "2", label: "2", src: "/template3.jpg", defaultSize: 180, qrPos: { x: CW / 2 - 90, y: CH / 2 - 50 } },
];


export default function GenerateQRClient({ finder_id }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState(TEMPLATES[2]);
  const [qrSize, setQrSize] = useState(175);
  const [qrPos, setQrPos] = useState({ x: CW / 2 - 87, y: CH / 2 - 65 });
  const [scale, setScale] = useState(1);

  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const qrValue = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/search?finder_id=${finder_id}`;

  useEffect(() => {
    const measure = () => {
      if (canvasRef.current) {
        setScale(canvasRef.current.clientWidth / CW);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const onDragMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const dx = (e.clientX - dragStart.current.mx) / scale;
    const dy = (e.clientY - dragStart.current.my) / scale;
    setQrPos({
      x: Math.min(Math.max(dragStart.current.ox + dx, 0), CW - qrSize),
      y: Math.min(Math.max(dragStart.current.oy + dy, 0), CH - qrSize),
    });
  }, [scale, qrSize]);

  const onDragEnd = useCallback(() => {
    dragging.current = false;
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragEnd);
  }, [onDragMove]);

  const onDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: qrPos.x, oy: qrPos.y };
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
  }, [qrPos, onDragMove, onDragEnd]);

  const downloadPDF = async () => {
    if (!svgRef.current) return;
    setDownloading(true);
    const pdf = new jsPDF({ orientation: "portrait", unit: "cm", format: [9, 12], compress: true });
    await pdf.svg(svgRef.current, { x: 0, y: 0, width: 9, height: 12 });
    pdf.save(`parkping-template[${template.label}]-ID-${finder_id}.pdf`);
    setDownloading(false);
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
          <h1 className={`${syne.className} text-3xl font-extrabold tracking-tight`}>Your QR Code</h1>
          <p className="text-sm text-slate-400">Choose a template, position your QR, then download.</p>
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

            {/* Tips */}
            <div className="flex flex-col gap-2 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tips</p>
              <ul className="flex flex-col gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <li>• Drag the QR on the preview to reposition it.</li>
                <li>• Use the slider below the preview to resize.</li>
              </ul>
            </div>

            {/* Download */}
            <Button
              onClick={downloadPDF}
              disabled={downloading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Generating PDF…" : "Download Sticker (PDF)"}
            </Button>
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
                <text x={CW / 2} y={CH - 479} fontSize="11" fontWeight="700" textAnchor="middle" fill="#000" fontFamily="monospace">
                  Finder ID: {finder_id}
                </text>
              </svg>

              <div
                onPointerDown={onDragStart}
                style={{
                  position: "absolute",
                  left: qrPos.x * scale,
                  top: qrPos.y * scale,
                  width: qrSize * scale,
                  height: qrSize * scale,
                  cursor: "grab",
                  border: "2px dashed rgba(59,130,246,0.8)",
                  borderRadius: 6,
                  boxSizing: "border-box",
                  touchAction: "none",
                }}
              />
            </div>

            {/* Slider below preview */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  QR Size — <span className="text-blue-500">{Math.round(qrSize)}px</span>
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Enter a value:
                </p>
                <input
                  type="number"
                  minLength={MIN_QR}
                  maxLength={MAX_QR}
                  value={Math.round(qrSize)}
                  onChange={(e) => {
                    setQrSize(Number(e.target.value));
                  }}
                  className="text-xs w-16 px-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-400 dark:border-slate-700 text-center font-mono text-slate-700 dark:text-slate-200"
                />
              </div>
              <input
                type="range"
                min={MIN_QR}
                max={MAX_QR}
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />

            </div>

            <p className="text-xs text-slate-400">PDF output will be print quality.</p>
          </div>
        </div>
      </div>
    </div>
  );
}