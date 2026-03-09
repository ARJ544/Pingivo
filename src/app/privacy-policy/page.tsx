import { Syne } from "next/font/google";

export const metadata = { title: "Privacy Policy" };

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080c10] text-slate-900 dark:text-slate-50">
      <div className="max-w-3xl mx-auto px-8 py-16 flex flex-col gap-10">

        <div className="flex flex-col gap-2">
          <h1 className={`${syne.className} text-4xl font-extrabold tracking-tight`}>
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">Last updated: March 9, 2026</p>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        <div className="flex flex-col gap-10 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">1. Introduction</h2>
            <p>
              Welcome to ParkPing. We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform to generate and manage QR codes for any item you own.
            </p>
            <p>
              By using ParkPing, you agree to the practices described here. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">2. What We Collect</h2>
            <p>We only collect what is necessary to provide the service:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li><strong className="text-slate-700 dark:text-slate-200">Phone number</strong> — used to route anonymous messages to you when someone scans your QR code.</li>
            </ul>
            <p>We do not collect your name, email, address, or any financial information for basic use.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">3. How We Use Your Information</h2>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li>To relay anonymous messages from scanners to you via your phone number</li>
              <li>To generate and manage your unique QR codes</li>
              <li>To detect and prevent fraud or abuse on the platform</li>
              <li>To improve our service over time</li>
            </ul>
            <p>We do not sell your data. We do not show your phone number to anyone who scans your QR code.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">4. Data Security</h2>
            <p>
              We use industry-standard security measures including encryption in transit (SSL/TLS) and at rest. Your phone number is never exposed to scanners — all communication is routed through ParkPing anonymously.
            </p>
            <p>
              No system is 100% secure. While we take every reasonable precaution, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">5. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. When you delete your account, your phone number and associated QR codes are permanently removed from our systems.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">6. Your Rights</h2>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li><strong className="text-slate-700 dark:text-slate-200">Access</strong> — you can view the data we hold about you at any time.</li>
              <li><strong className="text-slate-700 dark:text-slate-200">Correction</strong> — you can update your details from the Update page.</li>
              <li><strong className="text-slate-700 dark:text-slate-200">Deletion</strong> — you can permanently delete your account and all associated data from the Delete Account page.</li>
              <li><strong className="text-slate-700 dark:text-slate-200">Portability</strong> — you can request a copy of your data by contacting us.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">7. Cookies</h2>
            <p>
              We use only essential cookies required to keep you logged in and the service functional. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">8. Third-Party Links</h2>
            <p>
              Our platform may contain links to external sites. This policy applies only to ParkPing. We are not responsible for the privacy practices of third-party websites.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">9. Children's Privacy</h2>
            <p>
              ParkPing is not intended for anyone under the age of 13. We do not knowingly collect information from children. If you believe a child has created an account, please contact us immediately.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">10. Changes to This Policy</h2>
            <p>
              We may update this policy occasionally. Material changes will be reflected by updating the "Last updated" date at the top. Continued use of ParkPing after changes means you accept the updated policy.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          <p className="text-xs text-slate-400">
            This Privacy Policy is effective as of the date stated above and supersedes any previous versions.
          </p>

        </div>
      </div>
    </div>
  );
}