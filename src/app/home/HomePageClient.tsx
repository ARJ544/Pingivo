'use client'

import Link from "next/link";
import { QrCode, Edit3, Trash2, ScanQrCodeIcon, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import RefreshPage from "@/components/refreshPage";
import { COMPANY_NAME } from "@/config/company";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function HomePageClient() {
  const [advanceOpen, setAdditionalOpen] = useState(false);
  return (
    <>
      <RefreshPage />
      <main className="bg-white dark:bg-[#080c10] text-slate-900 dark:text-slate-50">
        <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-7">

          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold tracking-tight">QR Sticker</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a QR sticker for your items
            </p>
          </div>
          {/* Primary Action */}
          <Link
            href="/qr"
            className="flex items-center justify-between p-5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Generate QR Code</p>
                <p className="text-xs text-blue-100">Create your personal sticker</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 opacity-80" />
          </Link>

          <div className="flex justify-end">
            <Button
              onClick={() => setAdditionalOpen(!advanceOpen)}
              variant="ghost"
              className="h-auto p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent hover:bg-transparent flex items-center gap-1 text-xs font-medium"
            >
              Additional Options {advanceOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>


          {advanceOpen && (
            <div className="flex flex-col gap-7">
              {/* Secondary Actions */}
              <div className="flex flex-col gap-3">
                <Link href="/scan" className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                      <ScanQrCodeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Scan {COMPANY_NAME} QR code</p>
                      <p className="text-xs text-slate-400">Look up an item by scanning its {COMPANY_NAME} QR code</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                </Link>

                <Link href="/update" className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Update Phone Number</p>
                      <p className="text-xs text-slate-400">Edit your phone number</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                </Link>
              </div>

              {/* Danger zone */}
              <Link href="/delete-account" className="flex items-center justify-between p-5 rounded-2xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 hover:border-red-300 dark:hover:border-red-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-red-500">Delete Account</p>
                    <p className="text-xs text-slate-400">Permanently remove your data</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-red-300" />
              </Link>
            </div>
          )}

        </div>

      </main>
    </>
  );
}
