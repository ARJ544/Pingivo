import { Car, Bike, Briefcase, Tag, Laptop, Package, ArrowRight } from "lucide-react";
import { Syne } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

const useCases = [
  { icon: Car, label: "Vehicle", desc: "Let someone reach you about your parked car — anonymously." },
  { icon: Bike, label: "Bicycle", desc: "Help a stranger return your bike if it's found." },
  { icon: Briefcase, label: "Bag / Luggage", desc: "Lost luggage that finds its way back." },
  { icon: Laptop, label: "Laptop", desc: "Let an honest finder contact you if it goes missing." },
  { icon: Package, label: "Parcels", desc: "Delivery and return routing made instant." },
  { icon: Tag, label: "Anything Else", desc: "If it's yours and you want it back — stick a ParkPing on it." },
];

const steps = [
  { n: "1", title: "Enter your phone number", body: "That's it. No email, no name." },
  { n: "2", title: "Download your QR sticker", body: "Print-ready in seconds." },
  { n: "3", title: "Stick it on anything", body: "Car, bag, keys, laptop — your call." },
  { n: "4", title: "Someone scans → you get pinged", body: "They message you. Your number stays private." },
];

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#080c10] text-slate-900 dark:text-slate-50">
      <main className="max-w-5xl mx-auto px-6">

        {/* HERO */}
        <section className="py-4 flex flex-col gap-6 max-w-xl">
          <h1 className={`${syne.className} text-5xl md:text-6xl font-extrabold leading-tight tracking-tight`}>
            Stick it.<br />
            Scan it.<br />
            <span className="text-blue-500">Stay private.</span>
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-sm">
            Multipurpose QR codes for anything you own. Stay reachable — without sharing your number.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/home">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 px-7 rounded-xl flex items-center gap-2">
                Generate your QR Code <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="font-bold h-11 px-7 rounded-xl border-slate-200 dark:border-slate-700">
                Search a QR code
              </Button>
            </Link>
          </div>
        </section>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* USE CASES */}
        <section className="py-16">
          <h2 className={`${syne.className} text-2xl font-extrabold tracking-tight mb-2`}>Stick it anywhere.</h2>
          <p className="text-sm text-slate-400 mb-8">Not just vehicles — use it on anything.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <section className="py-16">
          <h2 className={`${syne.className} text-2xl font-extrabold tracking-tight mb-2`}>How it works.</h2>
          <p className="text-sm text-slate-400 mb-8">Up and running in under 30 seconds.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <section className="py-16 flex flex-col gap-4">
          <h2 className={`${syne.className} text-3xl md:text-4xl font-extrabold tracking-tight`}>
            Ready? It takes 30 seconds.
          </h2>
          <p className="text-sm text-slate-400">Free. No credit card. No personal data shared.</p>
          <div>
            <Link href="/home">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 px-7 rounded-xl flex items-center gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}