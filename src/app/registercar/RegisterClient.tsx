'use client'

import { useState } from 'react'
import { Lock, Eye, Car, ArrowRight, QrCode, UserX, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { setAllCookie } from '@/app/actions'


export default function RegisterClient() {
  const router = useRouter();
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehiNum, setvehiNum] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordValid = password === '' || password.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/registercar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          vehiNum,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }
      setAllCookie(result.user);

      setMessage('✅ Vehicle Registered Successfully!');
      router.push("/home");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      {/* Card */}
      <div className="w-full max-w-150 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 mb-12">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Register Vehicle Owner
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Add a new vehicle.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/^\s+|\s+$/g, ''))}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${isPasswordValid
                    ? 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : 'border-red-500 focus:ring-1 focus:ring-red-500'
                  }`}
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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

          {/* Vehicle Number */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Car Number
            </label>
            <div className="relative">
              <Car
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name='vehicle'
                value={vehiNum}
                onChange={(e) => setvehiNum(e.target.value)}
                type="text"
                placeholder="ABC-1234"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition font-mono uppercase"
              />
            </div>
          </div>
          {message}

          {/* Submit */}
          <div className="mt-6 flex flex-col gap-4">
            <Button
              type="submit"
              disabled={password.length < 8 || vehiNum.length > 15}
              className="w-full bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? "Registering" : "Register"}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </form>
      </div>

      {/* Features */}
      <div className="max-w-125 text-center px-4">
        <div className="flex items-center justify-center gap-6 mb-4">
          <Feature icon={<QrCode />} label="QR Ready" />
          <Feature icon={<UserX />} label="Anonymous" />
          <Feature icon={<ShieldCheck />} label="Secure" />
        </div>

        <p className="text-slate-400 text-xs leading-relaxed">
          By registering, you agree to our Terms of Service and Privacy Policy.
          Your contact information is never shared directly with other users.
        </p>
      </div>
    </main>
  )
}

function Feature({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm mb-2 text-blue-500">
        {icon}
      </div>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
        {label}
      </span>
    </div>
  )
}
