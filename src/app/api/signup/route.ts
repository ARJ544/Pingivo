import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('email, phone_num')
      .or(`email.eq.${email},phone_num.eq.${phone}`)
      .maybeSingle()

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
      } else {
        return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { error: insertError } = await supabase.from('users').insert({
      name,
      email,
      phone_num: phone,
      password: hashedPassword,
    })

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'Email or phone already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
