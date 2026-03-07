import Link from "next/link";
import {
  ShieldCheck,
  PlusSquare,
  Search,
  QrCode,
  Edit3,
  Trash2,
  ArrowRight,
  EyeOff,
  ScanQrCode,
  BadgeCheck,
} from "lucide-react";
import { IsLoggedIn, getAllCookie } from "@/app/actions";

export const metadata = {
  title: "Home",
};

export default async function HomePage() {
  const company_name = "ParkPing";
  const isLoggedIn = await IsLoggedIn();

  return (
    <main className="min-h-screen bg-linear-to-br overflow-x-hidden  from-slate-50  via-blue-50/40  to-slate-100  dark:from-slate-950  dark:via-blue-950/30  dark:to-slate-900  text-slate-900  dark:text-slate-100 ">
      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Header */}
        <header className="flex flex-col gap-4 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-linear-to-br from-blue-500 to-indigo-500 p-3 rounded-xl text-white shadow-lg">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <h1 className="text-3xl font-black">ParkPing</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Vehicle Safety &amp; Contact Platform
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-4xl font-black tracking-tight mb-3">
              Safer Parking. Smarter Connections.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              {company_name} lets vehicle owners stay anonymous while remaining
              reachable during parking issues, safety alerts, and emergencies.
            </p>
          </div>
        </header>

        {/* Privacy Badge */}
        <div className="flex items-center gap-2 mb-10 w-fit px-4 py-2 rounded-full bg-green-100/70 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold">
          <BadgeCheck className="size-4" />
          Privacy Protected
        </div>

        {/* Action Cards */}
        <section className="min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ActionCard
            icon={<Search />}
            title="Search Owner"
            desc="Look up a vehicle and send an urgent safety message."
            customText="Search"
            href="/search"
          />

          <ActionCard
            icon={<QrCode />}
            title="Generate QR"
            desc="Create a QR for your windshield to receive instant alerts."
            customText="Generate QR"
            href="/qr"
          />

          <ActionCard
            icon={<Edit3 />}
            title="Update Details"
            desc="Edit profile info or contact preferences."
            customText="Update"
            href="/update"
          />

          <DangerCard
            icon={<Trash2 />}
            title="Delete Account"
            desc="Permanently delete your account."
            href="/delete-account"
          />
        </section>

        {/* Privacy Tips */}
        <section className="mt-20">
          <h3 className="text-xl font-bold mb-6">Quick Privacy Tips</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TipCard
              icon={<EyeOff />}
              title="Always Anonymous"
              desc="Your phone number and identity are never shared. Messages are securely relayed through ParkPing."
            />

            <TipCard
              icon={<ScanQrCode />}
              title="Check Your QR"
              desc="Scan your own QR occasionally to ensure alerts are active."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function ActionCard({
  icon,
  title,
  desc,
  href,
  customText,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  customText: string;
  disabled?: boolean;
}) {
  return (
    <Link
      href={disabled ? "#" : href}
      className="
        group
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur
        p-6
        rounded-2xl
        border border-slate-200/60 dark:border-slate-800/60
        hover:-translate-y-1
        hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.25)]
        transition
        flex flex-col
      "
    >
      <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 group-hover:bg-linear-to-br group-hover:from-blue-500 group-hover:to-indigo-500 group-hover:text-white transition">
        {icon}
      </div>

      <h4 className="font-bold text-lg mb-2 wrap-break-words">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{desc}</p>

      <span className="mt-auto flex items-center gap-1 text-blue-600 font-semibold text-sm">
        {customText}
        <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
      </span>
    </Link>
  );
}

function DangerCard({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        bg-white/80 dark:bg-slate-900/80
        backdrop-blur
        p-6
        rounded-2xl
        border border-slate-200/60 dark:border-slate-800/60
        hover:-translate-y-1
        hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.25)]
        transition
        flex flex-col
      "
    >
      <div className="mb-6 w-14 h-14 flex items-center justify-center rounded-xl bg-red-500/15 text-red-500 group-hover:bg-red-500 group-hover:text-white transition">
        {icon}
      </div>

      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{desc}</p>

      <span className="mt-auto flex items-center gap-1 text-red-500 font-semibold text-sm">
        Delete
        <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
      </span>
    </Link>
  );
}

function TipCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 p-6 rounded-2xl border border-dashed border-slate-300/70 dark:border-slate-700/70 bg-white/60 dark:bg-slate-800/50 backdrop-blur">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="font-bold mb-1">{title}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
