"use client";

import { Mail, Lock, Eye, Key, Phone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResetPasswordClient() {
  const router = useRouter();
  const [phone_num, setPhoneNum] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  const isEmailValid = phone_num === "" || phoneRegex.test(phone_num);
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const isPasswordValid = newPassword === "" || strongPasswordRegex.test(newPassword);
  const isSecretCodeValid = secretCode.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_num,
          secretcode: secretCode,
          newPassword,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setMessage("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Reset Password
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Enter your phone number and secret code to reset your password
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                value={phone_num}
                onChange={(e) => {
                  setPhoneNum(e.target.value.trim());
                }}
                type="tel"
                placeholder="+18123474536"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${
                    isEmailValid
                      ? "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-red-500 focus:ring-1 focus:ring-red-500"
                  }`}
              />
            </div>
            {!isEmailValid && (
              <p className="text-xs text-red-500">
                Please enter a valid phone number
              </p>
            )}
          </div>

          {/* Secret Code */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Secret Code
            </label>
            <div className="relative">
              <Key
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={secretCode}
                onChange={(e) => {
                  setSecretCode(e.target.value.trim());
                }}
                type="text"
                placeholder="Enter your secret code"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${
                    isSecretCodeValid
                      ? "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-red-500 focus:ring-1 focus:ring-red-500"
                  }`}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your secret code was shown to you when you first registered.
            </p>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value.replace(/^\s+|\s+$/g, "").trim())}
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${
                    isPasswordValid
                      ? "border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-red-500 focus:ring-1 focus:ring-red-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Eye size={18} />
              </button>
            </div>
            {!isPasswordValid && (
              <p className="text-xs text-red-500">
                Password must be strong (8+ chars, uppercase, lowercase,
                number, special char)
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              !phone_num ||
              !secretCode ||
              !newPassword ||
              !isPasswordValid ||
              !isSecretCodeValid ||
              loading
            }
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 justify-center mt-6">
          <Link
            href="/login"
            className="hover:text-blue-600 dark:hover:text-blue-400 underline"
          >
            Back to Login
          </Link>
          <span>•</span>
          <Link
            href="/signup"
            className="hover:text-blue-600 dark:hover:text-blue-400 underline"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
