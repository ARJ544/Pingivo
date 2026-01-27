import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getAllCookie } from '@/app/actions'
import bcrypt from 'bcrypt'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const isLoggedin = (await getAllCookie()).loggedin;
    const email = (await getAllCookie()).email;
    if (!isLoggedin) {
      return NextResponse.json({ error: 'Login then comeback' }, { status: 400 });
    }
    const { password, vehiNum } = await request.json()

    if (!vehiNum || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('name, email, phone_num, password, vehi1, vehi2')
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
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }

    let validVehiColumn = "vehi1";
    if (user?.vehi1) {
      validVehiColumn = "vehi2";
    }

    if (validVehiColumn === "vehi1") {
      const { data: user1, error: ftchError } = await supabase
        .from('users')
        .select('name, email, phone_num, password, vehi1, vehi2')
        .eq('email', email)
        .maybeSingle()

      if (ftchError) {
        return NextResponse.json({ error: ftchError.message }, { status: 500 })
      }
      if (user1?.vehi1 === vehiNum) {
        return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 401 })
      }
      if (user1?.vehi2 === vehiNum) {
        return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 401 })
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ [validVehiColumn]: vehiNum })
        .eq('email', email)

      if (updateError) {
        if (updateError.code === '23505') {
          return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 409 })
        }
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }

    }
    if (validVehiColumn === "vehi2") {
      const { data: user2, error: ftchError } = await supabase
        .from('users')
        .select('name, email, phone_num, password, vehi1, vehi2')
        .eq('email', email)
        .maybeSingle()

      if (ftchError) {
        return NextResponse.json({ error: ftchError.message }, { status: 500 })
      }
      if (user2?.vehi2 === vehiNum) {
        return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 401 })
      }
      if (user2?.vehi1 === vehiNum) {
        return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 401 })
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ [validVehiColumn]: vehiNum })
        .eq('email', email)

      if (updateError) {
        if (updateError.code === '23505') {
          return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 409 })
        }
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }

    }

    const { data: finalCheck, error: Error } = await supabase
      .from('users')
      .select('name, email, phone_num, password, vehi1, vehi2')
      .eq('email', email)
      .maybeSingle()

    if (Error) {
      return NextResponse.json({ error: Error.message }, { status: 500 })
    }
    if (!finalCheck) {
      return NextResponse.json({ error: 'No user found. Please sign up.' }, { status: 404 })
    }


    return NextResponse.json({
      message: 'Vehicle Registered successfully',
      user: {
        loggedin: true,
        name: finalCheck.name,
        email: finalCheck.email,
        password: finalCheck.password,
        phone_num: finalCheck.phone_num,
        vehi1: finalCheck.vehi1,
        vehi2: finalCheck.vehi2
      }
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
