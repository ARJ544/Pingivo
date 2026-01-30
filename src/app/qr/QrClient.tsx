"use client";

import { useEffect, useRef, useState } from "react";
import QRDrobe from "@teonord/qrdrobe";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

export default function GenerateQRClient() {
  const [url, setUrl] = useState("");
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRDrobe | null>(null);

  // Generate / Update QR
  const generateQR = async () => {
    if (!qrContainerRef.current || !url) return;

    // Clear old QR
    qrContainerRef.current.innerHTML = "";

    const qr = new QRDrobe({
      data: url,
      width: 200,
      height: 200,
      errorCorrectionLevel: "M",
      foreground: "#000000",
      background: "#ffffff",
      dotsStyle: "rounded",
      image: "/logo.png",
    });

    qrInstanceRef.current = qr;
    await qr.append(qrContainerRef.current);
  };

  // Download PNG
  const downloadPNG = async () => {
    if (!templateRef.current) return;

    const canvas = await html2canvas(templateRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-template.png";
    link.click();
  };

  // Download PDF
  const downloadPDF = async () => {
    if (!templateRef.current) return;

    const canvas = await html2canvas(templateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("qr-template.pdf");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">QR Generator</h2>

        {/* URL INPUT */}
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full border rounded px-3 py-2"
        />

        <Button onClick={generateQR} className="w-full">
          Generate QR
        </Button>

        {/* TEMPLATE (Responsive) */}
        <div
          ref={templateRef}
          className="relative w-full aspect-4/6 overflow-hidden rounded"
          style={{
            backgroundImage: "url('/template.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* QR PLACEMENT */}
          <div
            ref={qrContainerRef}
            className="absolute left-1/2 top-[54%] -translate-x-25 -translate-y-1/2"
          />
        </div>

        {/* DOWNLOAD */}
        <div className="flex w-full gap-2">
          <Button onClick={downloadPNG} className="flex-1">
            PNG
          </Button>
          <Button onClick={downloadPDF} className="flex-1">
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
