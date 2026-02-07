import {
  BadgeCheck,
  ArrowRight,
  ShieldCheck,
  BellRing,
  QrCode,
  Car,
} from "lucide-react";

import { Button } from "@/components/ui/button"
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="dark:bg-background-dark font-display text-[#0d161b] dark:text-slate-50 transition-colors duration-300">
      <main className="max-w-300 mx-auto px-6">
        {/* Hero Section */}
        <section className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="dark:bg-blue-800 inline-flex items-center gap-2 px-3 bg-blue-200 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Privacy-First Vehicle Protection
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                Ping the Owner.
                <br />
                Save the <span className="text-blue-600 font-extrabold">Tow.</span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-125 leading-relaxed">
                Register your vehicle and stay reachable during parking issues — without ever sharing your phone number. Communicate safely using secure QR codes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={"/home"}>
                  <Button className="bg-blue-500 hover:bg-blue-500/90 text-white font-bold h-14 px-10 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                    <span>Register your Vehicle</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href={"/search"}>
                  <Button variant={"outline"} className="font-bold h-14 px-10 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center">
                    <span>Search a Vehicle</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <div className="relative rounded-2xl overflow-hidden border border-[#cfdde7] dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl">

                <div className="relative aspect-4/3 w-full">
                  <Image
                    src="/pingownerpic3.jpg"
                    alt="ParkPing Logo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">
                        Secure Scan Integration
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-[#cfdde7] dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-1 p-6 rounded-xl bg-white dark:bg-slate-800/50 shadow-sm border border-[#cfdde7] dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Reliability</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold tracking-tight">Secure</p>
                <span className="bg-indigo-100 dark:bg-indigo-300 text-indigo-600 px-2 py-0.5 rounded text-xs font-bold">24/7 Reachable</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-6 rounded-xl bg-white dark:bg-slate-800/50 shadow-sm border border-[#cfdde7] dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Privacy Shield</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold tracking-tight">100% Private</p>
                <span className="bg-[#078838]/10 text-[#078838] px-2 py-0.5 rounded text-xs font-bold">Anonymous</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-6 rounded-xl bg-white dark:bg-slate-800/50 shadow-sm border border-[#cfdde7] dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Response Time</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold tracking-tight">Instant</p>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">Notifications</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="flex flex-col gap-4 mb-16 max-w-180">
            <h2 className="text-4xl font-black tracking-tight">Modern Vehicle Safety, Built for Privacy</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Stay connected while keeping your personal data private. Our platform ensures you&apos;re always reachable for emergencies without sacrificing privacy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4 p-8 rounded-2xl border border-[#cfdde7] dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />

              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Privacy First</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Communicate anonymously without sharing your phone number. Get notified instantly via Email when something happens to your car.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-8 rounded-2xl border border-[#cfdde7] dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[#078838]/10 text-[#078838] flex items-center justify-center">
                <BellRing className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Instant Alerts</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Get notified immediately Email if something happens to your car, from parking issues to emergencies.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-8 rounded-2xl border border-[#cfdde7] dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <QrCode className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Easy Setup</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Generate your unique QR code in seconds, print it and stick it on your car.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline / Process Section */}
        <section className="py-24 bg-white dark:bg-slate-800/30 rounded-3xl border border-[#cfdde7] dark:border-slate-800 px-8 md:px-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl font-black tracking-tight">How it Works</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Setting up your secure profile takes less than 2 minutes. No technical skills required.
              </p>
              <div className="grid grid-cols-[48px_1fr] gap-x-4 mt-4">
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                  <div className="w-0.5 bg-[#cfdde7] dark:bg-slate-700 h-16 my-2"></div>
                </div>
                <div className="flex flex-col py-2">
                  <h4 className="text-lg font-bold">Register vehicle details</h4>
                  <p className="text-slate-500 text-sm">Add your plate number and fill required details.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold">2</div>
                  <div className="w-0.5 bg-[#cfdde7] dark:bg-slate-700 h-16 my-2"></div>
                </div>
                <div className="flex flex-col py-2">
                  <h4 className="text-lg font-bold">Get your unique QR code</h4>
                  <p className="text-slate-500 text-sm">Download your QR code.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="size-12 rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold">3</div>
                </div>
                <div className="flex flex-col py-2">
                  <h4 className="text-lg font-bold">Stay connected securely</h4>
                  <p className="text-slate-500 text-sm">Anyone can scan the code to send you a message through our portal.</p>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-square bg-slate-100 dark:bg-slate-700 rounded-3xl flex items-center justify-center border-2 border-dashed border-[#cfdde7] dark:border-slate-600 overflow-hidden">
                <QrCode height={300} width={300} className="mb-18" />
                <div className="absolute bottom-6 left-6 right-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-[#cfdde7] dark:border-slate-700 flex items-center gap-4">
                  <div className="size-10 rounded bg-primary/20 text-primary flex items-center justify-center">
                    <Car color="#8bb5f8" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Registration Plate</p>
                    <p className="text-sm font-bold">ABC-1234-XYZ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="max-w-200 mx-auto flex flex-col items-center gap-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to protect your vehicle?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join thousands of drivers who prioritize their privacy and safety.
            </p>
            <div className="flex items-center gap-4">
              <Link href={"/home"}>
                <Button className="bg-blue-500 hover:bg-blue-500/90 text-white font-bold h-14 px-12 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-lg">
                  Get Started for Free
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-400">No credit card required for basic registration.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* <footer className=" bg-white dark:bg-black border-t border-[#cfdde7] dark:border-slate-800 py-16">
        <div className="max-w-300 mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col gap-6 col-span-1 md:col-span-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{company_name}</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Redefining vehicle safety through privacy-first communication. Secure, anonymous, and reliable.
              </p>
              <div className="flex items-center gap-4">
                <Link className="text-slate-400 hover:text-primary transition-colors" href="https://github.com/ARJ544">
                  <Github className="h-4 w-4" />
                </Link>
                <Link className="text-slate-400 hover:text-primary transition-colors" href="#">
                  <Mail className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Product</h4>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Features</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Safety Guide</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Pricing</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Sticker Shop</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Company</h4>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">About Us</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Blog</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Contact</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Partners</Link>
              </nav>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Privacy Policy</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Terms of Service</Link>
                <Link className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">Cookie Settings</Link>
              </nav>
            </div>
          </div>
          <div className="pt-8 border-t border-[#cfdde7] dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
            <p>© 2025 {company_name}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Designed for Modern Trust</span>
              <MapPin className="h-3 w-3" />
              <span>Global Coverage</span>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
