import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getAllCookie, deleteAllCookie } from '@/app/actions'
import bcrypt from 'bcrypt'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { loggedin, email } = await getAllCookie();

    if (!loggedin || !email) {
      return NextResponse.json({ error: 'Login first' }, { status: 401 });
    }

    let { password, vehiNum } = await request.json();

    if (!password || !vehiNum) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    vehiNum = vehiNum.toUpperCase().trim();

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password, vehi1, vehi2')
      .eq('email', email)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    if (!user) {
      return NextResponse.json({ error: 'User not found. Please sign up.' }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
    }

    let validVehiColumn = "vehi1";
    if (user?.vehi1) {
      validVehiColumn = "vehi2";
    }
    if (user?.vehi1 && user?.vehi2) {
      return NextResponse.json({ error: 'Your slot is full 2/2' }, { status: 500 })
    }

    const { data: existingVehicle } = await supabase
      .from('users')
      .select('id')
      .or(`vehi1.eq.${vehiNum},vehi2.eq.${vehiNum}`)
      .maybeSingle();

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle number already registered' },
        { status: 409 }
      );
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ [validVehiColumn]: vehiNum })
      .eq('email', email);

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 409 })
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    const { data: latestDetails, error: Error } = await supabase
      .from('users')
      .select('name, email, phone_num, password, vehi1, vehi2')
      .eq('email', email)
      .maybeSingle()

    if (Error) {
      return NextResponse.json({ error: Error.message }, { status: 500 })
    }
    if (!latestDetails) {
      return NextResponse.json({ error: 'No user found. Please sign up.' }, { status: 404 })
    }

    await deleteAllCookie();

    return NextResponse.json({
      message: 'Vehicle Registered successfully',
      user: {
        loggedin: true,
        name: latestDetails.name,
        email: latestDetails.email,
        password: latestDetails.password,
        phone_num: latestDetails.phone_num,
        vehi1: latestDetails.vehi1,
        vehi2: latestDetails.vehi2
      }
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
