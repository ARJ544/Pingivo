'use client'

import { Mail, Lock, Eye } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { setAllCookie } from '@/app/actions'

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmailValid = email === '' || emailRegex.test(email)
  const isPasswordValid = password === '' || password.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }
      
      setAllCookie(result.user);

      setMessage('✅ User Loggedin successfully!');
      router.push("/home");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-125 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">

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

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          {/* Login Button */}
          <Button
            type="submit"
            disabled={!emailRegex.test(email) || password.length < 8}
            className="mt-4 w-full bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-500/20 transition-all"
          >
            {loading ? 'Logging IN...' : 'Login'}
          </Button>
          {message && <p className='text-xl text-red-500'>{message}</p>}

          {/* Signup */}
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
  )
}
