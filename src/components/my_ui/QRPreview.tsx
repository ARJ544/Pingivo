"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRPreviewProps {
  templateSrc: string;
  qrValue: string;
  qrSize: number;
  qrPosition: { x: number; y: number };
  canvasWidth: number;
  canvasHeight: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export default function QRPreview({
  templateSrc,
  qrValue,
  qrSize,
  qrPosition,
  canvasWidth,
  canvasHeight,
  svgRef,
}: QRPreviewProps) {
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-6">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Preview
      </p>

      <div
        className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg select-none w-full"
        style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}` }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <image href={templateSrc} width={canvasWidth} height={canvasHeight} preserveAspectRatio="xMidYMid slice" />
          <g transform={`translate(${qrPosition.x}, ${qrPosition.y})`}>
            <QRCodeSVG value={qrValue} size={qrSize} level="M" bgColor="#ffffff" fgColor="#000000" />
          </g>
        </svg>
      </div>

      <p className="text-xs text-slate-400">
        PDF output will be print quality.
      </p>
    </div>
  );
}
