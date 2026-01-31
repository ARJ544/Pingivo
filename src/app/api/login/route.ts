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
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, name, phone_num, password, vehi1, vehi1_name, vehi2, vehi2_name, verified')
      .eq('email', email)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: 'No user found. Please sign up.' }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email or Password Wrong' }, { status: 401 })
    }

    return NextResponse.json({
      message: 'Logged in successfully',
      user: {
        loggedin: true,
        id: user.id,
        name: user.name,
        // email: user.email,
        // password: user.password,
        phone_num: user.phone_num,
        vehi1: user.vehi1,
        vehi1_name: user.vehi1_name,
        vehi2: user.vehi2,
        vehi2_name: user.vehi2_name,
        verified: user.verified
      }
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
