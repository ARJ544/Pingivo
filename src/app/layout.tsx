import { SerwistProvider } from "./serwist";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/my_ui/navigation";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Github, Mail, MapPin } from "lucide-react";
import OnlineOfflineComponent from "@/components/my_ui/OnlineOfflineComponent";
import Link from "next/link";

const poppins = Poppins({
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  applicationName: "ParkPing",
  title: {
    default: "ParkPing",
    template: "%s | ParkPing",
  },
  description:
    "Redefining vehicle safety through privacy-first communication. Secure, anonymous, and reliable.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const company_name: string = "ParkPing";
  const currentYear = new Date().getFullYear();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} selection:bg-teal-300 selection:text-teal-950`}
      >
        <SerwistProvider swUrl="/serwist/sw.js">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <OnlineOfflineComponent />
            {children}
            <footer className="bg-white dark:bg-black border-t border-white dark:border-slate-800 py-12">
              <div className="max-w-300 mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="flex flex-col gap-6 col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold tracking-tight">
                        {company_name}
                      </h2>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Redefining vehicle safety through privacy-first
                      communication. Secure, anonymous, and reliable.
                    </p>
                    <div className="flex items-center gap-4">
                      <Link
                        className="text-slate-400 hover:text-primary transition-colors"
                        href="https://github.com/ARJ544"
                      >
                        <Github className="h-4 w-4" />
                      </Link>
                      <Link
                        className="text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        <Mail className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">
                      Product
                    </h4>
                    <nav className="flex flex-col gap-3">
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        Features
                      </Link>
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        Safety Guide
                      </Link>
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        Pricing
                      </Link>
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        Sticker Shop
                      </Link>
                    </nav>
                  </div>
                  <div className="flex flex-col gap-6">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">
                      Company
                    </h4>
                    <nav className="flex flex-col gap-3">
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        About Us
                      </Link>
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        Blog
                      </Link>
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        Contact
                      </Link>
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        Partners
                      </Link>
                    </nav>
                  </div>
                  <div className="flex flex-col gap-6">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">
                      Legal
                    </h4>
                    <nav className="flex flex-col gap-3">
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="/privacy-policy"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                        href="/terms-and-conditions"
                      >
                        Terms of Service
                      </Link>
                    </nav>
                  </div>
                </div>
                <div className="pt-8 border-t border-[#cfdde7] dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
                  <p>
                    © {currentYear} {company_name}. All rights reserved.
                  </p>
                  <div className="flex items-center gap-6">
                    <span>Designed for Modern Trust</span>
                    <MapPin className="h-3 w-3" />
                    <span>Global Coverage</span>
                  </div>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
