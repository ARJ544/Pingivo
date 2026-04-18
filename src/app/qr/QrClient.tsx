"use client";

import { useState } from "react";
import { Sora } from "next/font/google";
import { useQRGeneration } from "@/hooks/useQRGeneration";
import QRPreview from "@/components/my_ui/QRPreview";
import TemplateSelector from "@/components/my_ui/TemplateSelector";
import QRActionButtons from "@/components/my_ui/QRActionButtons";

const sora = Sora({ subsets: ["latin"], weight: ["700", "800"] });

type Props = { finder_id: string };

const CW = 360;
const CH = 500;

const TEMPLATES = [
  { id: "0", label: "1", src: "/template0.jpg", defaultSize: 160, qrPos: { x: CW / 2 - 79, y: CH / 2 - 113 } },
  { id: "1", label: "2", src: "/template1.jpg", defaultSize: 160, qrPos: { x: CW / 2 - 80, y: CH / 2 - 118 } },
];

export default function GenerateQRClient({ finder_id }: Props) {
  const { downloading, sharing, qrValue, svgRef, downloadPDF, shareQR } = useQRGeneration(finder_id);

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#080c10] text-slate-900 dark:text-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-10">

        <div className="flex flex-col gap-1">
          <h1 className={`${sora.className} text-3xl font-extrabold tracking-tight`}>Your QR Code</h1>
          <p className="text-sm text-slate-400">Choose a template, then download your sticker.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* LEFT — Preview */}
          <QRPreview
            templateSrc={selectedTemplate.src}
            qrValue={qrValue}
            qrSize={selectedTemplate.defaultSize}
            qrPosition={selectedTemplate.qrPos}
            canvasWidth={CW}
            canvasHeight={CH}
            svgRef={svgRef}
          />

          {/* RIGHT — Controls */}
          <div className="flex flex-col gap-8">

            {/* Action Buttons */}
            <QRActionButtons
              downloading={downloading}
              sharing={sharing}
              onDownload={downloadPDF}
              onShare={shareQR}
            />

            {/* Template Selector */}
            <TemplateSelector
              templates={TEMPLATES}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />

          </div>

        </div>
      </div>
    </div>
  );
}
