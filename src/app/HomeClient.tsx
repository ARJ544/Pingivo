'use client'

import { Car, Bike, Briefcase, Tag, Laptop, Package, ArrowRight, Trash2, Edit3, ScanQrCodeIcon, ChevronUp, ChevronDown } from "lucide-react";
import { Sora } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { COMPANY_NAME } from "@/config/company";
import { useEffect, useState } from "react";
import { setBsuidCookieAction } from "@/lib/bsuid-cookie-setter";

const sora = Sora({ subsets: ["latin"], weight: ["700", "800"] });

const useCases = [
  { icon: Car, label: "Vehicle", desc: "Let someone reach you about your parked car — anonymously." },
  { icon: Bike, label: "Bicycle", desc: "Help a stranger return your bike if it's found." },
  { icon: Briefcase, label: "Bag / Luggage", desc: "Lost luggage that finds its way back." },
  { icon: Laptop, label: "Laptop", desc: "Let an honest finder contact you if it goes missing." },
  { icon: Package, label: "Parcels", desc: "Delivery and return routing made instant." },
  { icon: Tag, label: "Anything Else", desc: `If it's yours and you want it back — stick a ${COMPANY_NAME} on it.` },
];

const steps = [
  { n: "1", title: "Enter your phone number", body: "That's it. No email, no name." },
  { n: "2", title: "Download your QR sticker", body: "Print-ready in seconds." },
  { n: "3", title: "Stick it on anything", body: "Car, bag, keys, laptop — your call." },
  { n: "4", title: "Someone scans → you get pinged", body: "They message you or call. Your number stays private." },
];

export default function HomeClient({ loggedin, bsuid, token, shouldSetBsuidCookie }: { loggedin: boolean; bsuid: string | undefined; token: string | undefined; shouldSetBsuidCookie: boolean }) {

  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    if (shouldSetBsuidCookie) {
      setBsuidCookieAction();
    }
  }, [shouldSetBsuidCookie]);

  useEffect(() => {
    if (loggedin && token && !bsuid) {
      setShowConnectModal(true);
    }
  }, [loggedin, token, bsuid]);

  const handleConnectWhatsApp = () => {
    if (!token) return;

    const message = `CONNECT_${token}`;
    const encodedMessage = encodeURIComponent(message);

    const url = `https://wa.me/916124530919?text=${encodedMessage}`;

    window.open(url, "_blank");
  };

  return (
    <div className="bg-white dark:bg-[#080c10] text-slate-900 dark:text-slate-50">
      <main className="max-w-5xl mx-auto px-6">

        <section className="py-8 grid gap-4 items-center max-w-6xl mx-auto md:grid-cols-2">

          <div className="hidden md:flex flex-col gap-6 px-4 max-w-xl">
            <h1 className={`${sora.className} text-5xl md:text-5xl font-extrabold leading-tight tracking-tight`}>
              Stay Reachable.<br />
              Without -<br />
              <span className="text-blue-500">Showing your number.</span>
            </h1>

            <p className="text-base italic text-slate-500 dark:text-slate-400 max-w-sm">
              Multipurpose QR codes for anything you own. Stay reachable — Get Contacted anonymously.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <img
              src="/bg.jpeg"
              alt="QR preview"
              className="w-full h-auto object-contain rounded-2xl"
            />

            <p className="md:hidden text-base italic text-slate-500 dark:text-slate-400 max-w-sm">
              Multipurpose QR codes for anything you own. Stay reachable — Get Contacted anonymously.
            </p>
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-start">
            <Link href="/qr">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 px-7 rounded-xl flex items-center gap-2">
                Generate your QR Code
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Additional Options + Panel */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex justify-start">
              <Button
                onClick={() => setAdditionalOpen(!additionalOpen)}
                variant="ghost"
                className="w-40 h-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-transparent hover:bg-transparent border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center gap-1 text-xs font-medium"
              >
                Additional Options {additionalOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
            </div>

            {additionalOpen && (
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

                </div>

              </div>
            )}
          </div>

        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* USE CASES */}
        <section className="py-8">
          <h2 className={`${sora.className} text-2xl font-extrabold tracking-tight mb-2`}>Typical Use Cases.</h2>
          <p className="text-sm text-slate-400 mb-8">Not just vehicles — use it on anything.</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col gap-2 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-slate-50 dark:bg-slate-800/40">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* HOW IT WORKS */}
        <section className="py-10">
          <h2 className={`${sora.className} text-2xl font-extrabold tracking-tight mb-2`}>How it works.</h2>
          <p className="text-sm text-slate-400 mb-8">Up and running in under 30 seconds.</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map(({ n, title, body }) => (
              <div key={n} className="flex flex-col gap-2 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                  {n}
                </div>
                <p className="font-bold text-sm">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* CTA */}
        <section className="py-10 flex flex-col gap-4">
          <h2 className={`${sora.className} text-3xl md:text-4xl font-extrabold tracking-tight`}>
            Ready? It takes 30 seconds.
          </h2>
          <p className="text-sm text-slate-400">Free. No credit card. No personal data shared.</p>
          <div>
            <Link href="/signin">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 px-7 rounded-xl flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl p-5 shadow-xl border border-slate-200 dark:border-slate-800">

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Activate WhatsApp Messaging 💬
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              You'll be redirected to WhatsApp to send a message.
            </p>

            <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
              Don't edit the message — just tap send.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  handleConnectWhatsApp();
                  setShowConnectModal(false);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm"
              >
                Continue
              </Button>

              <Button
                onClick={() => setShowConnectModal(false)}
                variant="outline"
                className="flex-1 text-sm"
              >
                Skip
              </Button>
            </div>

            <p className="text-[11px] text-center text-red-600 dark:text-red-400 mt-4">
              Note: If you skip this, finders can only reach you via call. You won't be able to receive chat messages.
            </p>

          </div>
        </div>
      )}
    </div>
  );
}
