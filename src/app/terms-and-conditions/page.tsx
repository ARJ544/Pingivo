import { COMPANY_NAME } from "@/config/company";
import { Syne } from "next/font/google";

export const metadata = { title: "Terms & Conditions" };

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080c10] text-slate-900 dark:text-slate-50">
      <div className="max-w-3xl mx-auto px-8 py-16 flex flex-col gap-10">

        <div className="flex flex-col gap-2">
          <h1 className={`${syne.className} text-4xl font-extrabold tracking-tight`}>
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-400">Last updated: March 9, 2026</p>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        <div className="flex flex-col gap-10 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">1. Agreement</h2>
            <p>
              By using {COMPANY_NAME}, you agree to these Terms. If you do not agree, do not use our services. We may update these Terms at any time — continued use after changes means you accept them.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">2. What {COMPANY_NAME} Is</h2>
            <p>
              {COMPANY_NAME} is a multipurpose QR code platform. You can generate a QR code, attach it to any item you own, and allow others to contact you anonymously through our platform when they scan it. {COMPANY_NAME} is a communication relay — we are not responsible for what happens between users outside of our platform.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">3. Eligibility</h2>
            <p>
              You must be at least 13 years old to use {COMPANY_NAME}. By registering, you confirm you meet this requirement and are legally capable of entering into a binding agreement.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">4. Your Account</h2>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li>You are responsible for all activity under your account.</li>
              <li>Provide accurate information — false details may result in account removal.</li>
              <li>Keep your credentials confidential. Notify us of any unauthorized access.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">5. Acceptable Use</h2>
            <p>You agree not to use {COMPANY_NAME} to:</p>
            <ul className="flex flex-col gap-2 pl-4 list-disc">
              <li>Harass, threaten, or stalk other users</li>
              <li>Send spam, fraudulent, or misleading messages</li>
              <li>Register items you do not own or are not authorized to register</li>
              <li>Attempt to bypass our anonymous routing to expose another user's identity</li>
              <li>Scrape, reverse-engineer, or interfere with the platform</li>
              <li>Use the service for any illegal purpose</li>
            </ul>
            <p>Violations may result in immediate account termination and, where applicable, reporting to authorities.</p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">6. QR Codes & Item Registration</h2>
            <p>
              When you register an item and generate a QR code, you confirm that you own or are authorized to register that item. QR codes are personal and should not be shared or transferred to others without updating the registration.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">7. Messaging</h2>
            <p>
              {COMPANY_NAME} relays messages anonymously between scanners and owners. We are not responsible for the content of messages sent between users. We reserve the right to monitor for abuse and remove content or accounts that violate these Terms.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">8. Fees</h2>
            <p>
              Basic use of {COMPANY_NAME} is free. If we introduce paid features, fees will be clearly displayed before any charge. Accounts deleted or terminated for policy violations forfeit any remaining credits.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">9. Intellectual Property</h2>
            <p>
              All content, design, and code on {COMPANY_NAME} is owned by us or our licensors. You may not copy, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">10. Disclaimers</h2>
            <p>
              {COMPANY_NAME} is provided "as is" without warranties of any kind. We do not guarantee the accuracy of user-provided item information. We are not a party to any interaction between users and accept no responsibility for outcomes of those interactions.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, {COMPANY_NAME} is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you have paid us in the past 12 months.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">12. Indemnification</h2>
            <p>
              You agree to indemnify {COMPANY_NAME} and its team from any claims, damages, or expenses arising from your use of our services, your violation of these Terms, or your content or conduct on the platform.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">13. Service Changes</h2>
            <p>
              We may modify, suspend, or discontinue any part of {COMPANY_NAME} at any time. We will communicate material changes when possible.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">14. Governing Law</h2>
            <p>
              These Terms are governed by applicable law. Any disputes will be resolved in the jurisdiction where {COMPANY_NAME} operates.
            </p>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          <p className="text-xs text-slate-400">
            These Terms are effective as of the date stated above and supersede any previous versions.
          </p>

        </div>
      </div>
    </div>
  );
}