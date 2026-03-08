"use client";

import { Lock, Eye, Phone, Check, Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { deleteShowSecretCode } from "@/app/actions";

export default function LoginClient({ showSecretCode }: { showSecretCode: string | undefined }) {
  const router = useRouter();
  const [phone_num, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);



  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  const isPhoneValid = phone_num === "" || phoneRegex.test(phone_num);
  const isPasswordValid = password === "" || password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_num,
          password,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setMessage("✅ Logged in successfully!");
      router.replace("/home");
      router.refresh();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  const refreshPage = () => {
    router.refresh();
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(showSecretCode ?? "---Error Occured Do not Copy---");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">

      {showSecretCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3">
              Your Secret Recovery Code
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Please copy and store this code in a <strong>safe and private place</strong>.
              <br /><br />
              This code can be used to reset your password by visiting
              <Link href={'/reset-password'} className="font-semibold text-blue-500"> /reset-password</Link>.
              <br /><br />
              If you lose this code, you may not be able to recover your account.
            </p>

            <div className="flex items-center justify-between mb-5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
              <span className="font-mono text-lg tracking-wider text-slate-900 dark:text-white">
                {showSecretCode}
              </span>

              <Button
                onClick={handleCopy}
                className="ml-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-md"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>

            <div className="mb-5 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-xs text-yellow-900 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-200">
              <strong>Important:</strong> This code will only be shown once.
              Please store it securely. Anyone with this code can reset your password.
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
              onClick={() => {
                deleteShowSecretCode();
                refreshPage();
              }}
            >
              I Have Saved My Code
            </Button>

          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Login to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Phone Number (E.164)
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name="phone_num"
                value={phone_num}
                onChange={(e) => setPhoneNum(e.target.value.replace(/^\s+|\s+$/g, "").trim())}
                type="tel"
                placeholder="+919876543210"
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${isPhoneValid
                    ? "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "border-red-500 focus:ring-1 focus:ring-red-500"
                  }`}
              />
            </div>
            {!isPhoneValid && (
              <p className="text-xs text-red-500">
                Phone number must be in E.164 format (e.g. +919876543210)
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value.replace(/^\s+|\s+$/g, ""))
                }
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${isPasswordValid
                    ? "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    : "border-red-500 focus:ring-1 focus:ring-red-500"
                  }`}
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Eye size={18} />
              </Button>
            </div>
            {!isPasswordValid && (
              <p className="text-xs text-red-500">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          {message && <p className={`text-sm ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

          <Button
            type="submit"
            disabled={!phoneRegex.test(phone_num) || password.length < 8 || loading}
            className="mt-4 w-full bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm mt-2">
            <span className="text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?
            </span>
            <Link
              href="/signup"
              className="text-blue-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}