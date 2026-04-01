import { SerwistProvider } from "./serwist";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/my_ui/navigation";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Mail, MapPin } from "lucide-react";
import OnlineOfflineComponent from "@/components/my_ui/OnlineOfflineComponent";
import Link from "next/link";
import { RouteChangeHandler } from "@/components/RouteChangeHandler";
import { Suspense } from "react";
import { COMPANY_NAME } from "@/config/company";

const poppins = Poppins({
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: COMPANY_NAME,
  title: {
    default: COMPANY_NAME,
    template: `%s | ${COMPANY_NAME}`,
  },
  description:
    "Generate multipurpose QR codes for anything, anywhere. Secure, anonymous linking for vehicles, belongings, and beyond.",
  keywords: [
    "QR code",
    "multipurpose QR",
    "anonymous linking",
    "secure QR code",
    "vehicle QR",
    "smart sticker",
    COMPANY_NAME,
  ],
  authors: [{ name: `${COMPANY_NAME}` }],
  creator: COMPANY_NAME,
  openGraph: {
    type: "website",
    title: `${COMPANY_NAME} — QR Codes for Everything`,
    description:
      "Generate multipurpose QR codes for anything, anywhere. Secure, anonymous linking for vehicles, belongings, and beyond.",
    siteName: COMPANY_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY_NAME} — QR Codes for Everything`,
    description:
      "Generate multipurpose QR codes for anything, anywhere. Secure, anonymous linking for vehicles, belongings, and beyond.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <Suspense fallback={null}>
              <RouteChangeHandler />
            </Suspense>
            <Navigation />
            <OnlineOfflineComponent />
            {children}
            <footer className="bg-white dark:bg-black border-t border-white dark:border-slate-800 py-12">
              <div className="max-w-300 mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="flex flex-col gap-6 col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold tracking-tight">
                        {COMPANY_NAME}
                      </h2>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Generate multipurpose QR codes for anything, anywhere.
                      Secure, anonymous linking for vehicles, belongings, and
                      beyond.
                    </p>
                    <div className="flex items-center gap-4">
                      <Link
                        className="text-slate-400 hover:text-primary transition-colors"
                        href="https://github.com/ARJ544"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          version="1.1"
                          className="h-5 w-5"
                          aria-hidden="true"
                          fill="currentColor"
                        >
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                      </Link>
                      <Link
                        className="text-slate-400 hover:text-primary transition-colors"
                        href="#"
                      >
                        <Mail className="h-5 w-5" />
                      </Link>
                    </div>

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
                        Contact
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
                    © {currentYear} {COMPANY_NAME}. All rights reserved.
                  </p>
                  <div className="flex items-center gap-6">
                    <span>QR Codes for Everything</span>
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