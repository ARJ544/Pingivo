"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import "svg2pdf.js";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  vehi1_num?: string;
  vehi2_num?: string;
};

export default function GenerateQRClient({
  vehi1_num,
  vehi2_num,
}: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [downloading, setDownloading] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);

  const downloadPDF = async () => {
    if (!svgRef.current) return;

    setDownloading(true);

    const svg = svgRef.current;
    const width = svg.viewBox.baseVal.width;
    const height = svg.viewBox.baseVal.height;

    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "pt",
      format: [width, height],
    });

    await pdf.svg(svg, {
      x: 0,
      y: 0,
      width,
      height,
    });

    pdf.save(`${selectedVehicle}-qr-template.pdf`);
    setDownloading(false);
  };

  const qrValue = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/search?crnm=${selectedVehicle}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-3">

        <p className="text-xs text-gray-500 dark:text-gray-400">
          ⚡ QR code is generated automatically after selection
        </p>

        {/* SELECT */}
        <Select onValueChange={setSelectedVehicle}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Select Vehicle" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Vehicle List</SelectLabel>

              {vehi1_num && (
                <SelectItem value={vehi1_num}>
                  Vehicle 1 - {vehi1_num}
                </SelectItem>
              )}

              {vehi2_num && (
                <SelectItem value={vehi2_num}>
                  Vehicle 2 - {vehi2_num}
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* DOWNLOAD */}
        <Button
          onClick={downloadPDF}
          disabled={!selectedVehicle || downloading}
          className="w-full bg-green-600 text-white rounded-xl"
        >
          Download PDF
        </Button>

        {/* SVG TEMPLATE */}
        <svg
          ref={svgRef}
          width="300"
          height="400"
          viewBox="0 0 600 900"
        >
          {/* Background */}
          <image href="/template.png" width="600" height="900" />

          {/* QR */}
          {selectedVehicle && (
            <g transform={`translate(155 340) scale(1)`}>
              <QRCodeSVG
                value={qrValue}
                size={290}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
