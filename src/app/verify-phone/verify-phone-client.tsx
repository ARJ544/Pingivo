'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyPhone({ signup_temp }: { signup_temp: string | undefined }) {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const hasSignUpCookie = Boolean(signup_temp)

  useEffect(() => {

    if (!hasSignUpCookie) {
      setMessage('Unauthorized access')
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.phone.email/sign_in_button_v1.js'
    script.async = true
    document.querySelector('.pe_signin_button')?.appendChild(script)

    let called = false

    window.phoneEmailListener = async (userObj: any) => {
      if (called) return
      called = true

      setLoading(true)
      setMessage('Verifying your phone number...')

      if (!userObj?.user_json_url) {
        setMessage('Phone verification failed. Please try again.')
        setTimeout(() => router.replace('/signup'), 2000)
        return
      }

      try {
        const res = await fetch('/api/verify-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_json_url: userObj.user_json_url }),
        })

        if (!res.ok) throw new Error()

        const complete = await fetch('/api/signup/complete', { method: 'POST' })
        if (!complete.ok) throw new Error()

        setMessage('Phone verified successfully! Redirecting...')
        setTimeout(() => router.replace('/login'), 1500)

      } catch {
        setMessage('Something went wrong. Please try again.')
        setTimeout(() => router.replace('/signup'), 2000)
      } finally {
        setLoading(false)
      }
    }

    return () => {
      window.phoneEmailListener = undefined
    }
  }, [router])


  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {hasSignUpCookie && (
        <div
          className={`pe_signin_button ${loading ? 'pointer-events-none opacity-50' : ''}`}
          data-client-id="14661853409856503092"
        />
      )}


      {message && (
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
          {message}
        </p>
      )}
    </div>
  )
}
