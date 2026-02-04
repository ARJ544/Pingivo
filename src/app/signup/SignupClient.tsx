'use client'

import { useEffect, useRef, useState } from 'react'
import { User, Mail, Lock, Phone, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupClient() {
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [user_name, setName] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

  const isPasswordValid = password === '' || strongPasswordRegex.test(password)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\+[1-9]\d{1,14}$/

  const isEmailValid = email === '' || emailRegex.test(email)
  const isPhoneValid = phone === '' || phoneRegex.test(phone)

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const refreshedOnce = useRef(false);

  useEffect(() => {
    if (!refreshedOnce.current) {
      refreshedOnce.current = true;
      router.refresh();
    }
  }, [router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch('/api/signup/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user_name,
          email,
          phone,
          password,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      router.replace('/verify-phone');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-140 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl">

        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Create your account and secure your vehicle
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name='user_name'
                value={user_name}
                onChange={(e) => setName(e.target.value.replace(/\s{2,}/g, ' '))}
                required
                type="text"
                placeholder="e.g., John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={email}
                name='email'
                onChange={(e) => { setEmail(e.target.value) }}
                type="email"
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${isEmailValid
                    ? 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : 'border-red-500 focus:ring-1 focus:ring-red-500'
                  }`}
              />
            </div>
            {!isEmailValid && (
              <p className="text-xs text-red-500">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Phone Number (E.164)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/^\s+|\s+$/g, ''))}
                type="tel"
                placeholder="+919876543210"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                  ${isPhoneValid
                    ? 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : 'border-red-500 focus:ring-1 focus:ring-red-500'
                  }`}
              />
            </div>
            {!isPhoneValid && (
              <p className="text-xs text-red-500">
                Phone number must be in E.164 format (e.g. +919876543210, +14155555551, +442071234567)
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

              <input
                name='password'
                required
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Eye size={18} />
              </Button>
            </div>

            {!isPasswordValid && (
              <div className="text-xs text-red-500 leading-relaxed">
                Password must contain:
                <ul className="list-disc ml-4 mt-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character</li>
                </ul>
              </div>
            )}
          </div>

          {message && <p className='text-xl text-red-500'>{message}</p>}

          {/* Submit */}
          <Button
            disabled={!emailRegex.test(email) || !phoneRegex.test(phone) || user_name === " " || user_name === "" || loading}
            className="mt-4 w-full bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg transition"
          >
            {loading ? 'Signing UP...' : 'SignUp'}
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm mt-2">
            <span className="text-slate-500 dark:text-slate-400">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
