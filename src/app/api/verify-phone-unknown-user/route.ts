import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { IsVerified } from '@/app/actions'

export async function POST(req: Request) {
  const { user_json_url } = await req.json()

  const response = await fetch(user_json_url)
  const data = await response.json()

  if (!data.user_country_code || !data.user_phone_number) {
    return NextResponse.json(
      { error: 'Phone verification failed' },
      { status: 400 }
    )
  }

  const cookie = await cookies()
  const isVerified = await IsVerified();

  const verifiedPhone =
    `${data.user_country_code}${data.user_phone_number}`

  cookie.set('temp_phone', verifiedPhone, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 1000,
  })
  if (!isVerified) {
    cookie.set('verified', 'true', {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    })
  }

  return NextResponse.json({ success: true })
}
