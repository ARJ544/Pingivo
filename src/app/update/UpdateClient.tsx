"use client";

import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { setAllCookie } from "@/app/actions";

export default function UpdateClient() {
  const router = useRouter();

  // Main form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const isEmailValid = email === "" || emailRegex.test(email);
  const isPasswordValid = password === "" || strongPasswordRegex.test(password);

  const canSubmit =
    isEmailValid && isPasswordValid && (name || email || password) && !loading;

  const isPhoneValid = phoneRegex.test(phone);
  const canSubmitPhone = isPhoneValid && !phoneLoading;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Update failed");
      }

      setAllCookie(result.user);

      router.refresh();
      router.replace("/home");
      setMessage("Profile updated successfully ✅");
      setPassword("");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneLoading(true);
    setPhoneMessage("");

    try {
      const res = await fetch("/api/update/phone/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Phone update failed");
      }

      router.replace("/verify-update-profile-phone");
      setPhone("");
    } catch (err: any) {
      setPhoneMessage(err.message);
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Update Details
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Update only the fields you want to change.
          </p>
        </div>

        {/* Main Update Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <form
            onSubmit={handleUpdate}
            className="divide-y divide-slate-200 dark:divide-slate-800"
          >
            <Field
              label="Update Full Name"
              icon={<User size={18} />}
              value={name}
              onChange={(v) => setName(v.replace(/\s{2,}/g, " "))}
              type="text"
              placeholder="New full name"
            />

            <Field
              label="Update Email"
              icon={<Mail size={18} />}
              value={email}
              onChange={(e) => setEmail(e.trim())}
              placeholder="name@example.com"
              type="email"
              error={!isEmailValid && "Invalid email format"}
            />

            {/* Password */}
            <div className="p-6">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                New Password
              </label>

              <div className="relative mt-2">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white
                    ${
                      isPasswordValid
                        ? "border-slate-200 dark:border-slate-700"
                        : "border-red-500"
                    }
                  `}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Eye size={18} />
                </Button>
              </div>

              {!isPasswordValid && (
                <p className="mt-2 text-xs text-red-500">
                  Password must be strong (8+ chars, uppercase, lowercase,
                  number, special char)
                </p>
              )}
            </div>

            {message && <p className="px-6 text-sm text-red-500">{message}</p>}

            {/* Actions */}
            <div className="p-6 flex justify-end gap-4">
              <Button
                disabled={!canSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  "Updating..."
                ) : (
                  <>
                    <Save size={18} />
                    Update
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Phone Update Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <form
            onSubmit={handlePhoneUpdate}
            className="divide-y divide-slate-200 dark:divide-slate-800"
          >
            <Field
              label="Update Phone (E.164)"
              icon={<Phone size={18} />}
              value={phone}
              onChange={setPhone}
              type="phone"
              placeholder="+919876543210"
              error={phone && !isPhoneValid && "Invalid phone number"}
            />

            {phoneMessage && (
              <p className="px-6 text-sm text-red-500">{phoneMessage}</p>
            )}

            {/* Actions */}
            <div className="p-6 flex justify-end gap-4">
              <Button
                disabled={!canSubmitPhone}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {phoneLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <Save size={18} />
                    Update Phone
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type,
  error,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type: string;
  error?: string | false;
}) {
  return (
    <div className="p-6">
      <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </label>
      <div className="relative mt-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.trimStart())}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white
            ${error ? "border-red-500" : "border-slate-200 dark:border-slate-700"}
          `}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
