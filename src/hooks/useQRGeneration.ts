"use client";

import { useRef, useState } from "react";
import { COMPANY_NAME } from "@/config/company";

export function useQRGeneration(finder_id: string) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const qrValue = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/search?finder_id=${finder_id}`;

  const downloadPDF = async () => {
    if (!svgRef.current) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      await import("svg2pdf.js");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "cm",
        format: [9, 12],
        compress: true,
      });

      await pdf.svg(svgRef.current, { x: 0, y: 0, width: 9, height: 12 });

      pdf.save(`${COMPANY_NAME}-ID-${finder_id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const shareQR = async () => {
    if (!svgRef.current) return;

    setSharing(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      await import("svg2pdf.js");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "cm",
        format: [9, 12],
        compress: true,
      });

      await pdf.svg(svgRef.current, { x: 0, y: 0, width: 9, height: 12 });

      const blob = pdf.output("blob");

      const file = new File(
        [blob],
        `${COMPANY_NAME}-qr-${finder_id}.pdf`,
        { type: "application/pdf" }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `My ${COMPANY_NAME} QR Code`,
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: `My ${COMPANY_NAME} QR Code`,
          text: "Scan My QR sticker",
          url: window.location.href,
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${COMPANY_NAME}-qr-${finder_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharing(false);
    }
  };

  return {
    downloading,
    sharing,
    qrValue,
    svgRef,
    downloadPDF,
    shareQR,
  };
}
