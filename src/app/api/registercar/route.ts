import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getAllCookie, deleteAllCookie } from '@/app/actions'
import bcrypt from 'bcrypt'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { loggedin, id } = await getAllCookie();

    if (!loggedin || !id) {
      return NextResponse.json({ error: 'Login first' }, { status: 401 });
    }

    let { password, vehiNum, vehiName } = await request.json();

    if (!password || !vehiNum || !vehiName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    vehiNum = vehiNum.toUpperCase().trim();
    vehiName = vehiName.toUpperCase().trim();

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password, vehi1, vehi1_name, vehi2, vehi2_name')
      .eq('id', id)
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

    let validVehiNumberColumn = "vehi1";
    if (user?.vehi1) {
      validVehiNumberColumn = "vehi2";
    }
    let validVehiNameColumn = "vehi1_name";
    if (user?.vehi1_name) {
      validVehiNameColumn = "vehi2_name";
    }

    if (user?.vehi1 && user?.vehi2) {
      return NextResponse.json({ error: 'Your slot is full 2/2' }, { status: 500 })
    }
    if (user?.vehi1_name && user?.vehi2_name) {
      return NextResponse.json({ error: 'Your Name field is showing 2/2 (completely filled), but perhaps one slot is still available for adding a Vehicle Number.' }, { status: 500 })
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
      .update({ [validVehiNumberColumn]: vehiNum, [validVehiNameColumn]: vehiName })
      .eq('id', id);

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json({ error: 'This car number already exists. If it was not added by you, Please contact me.' }, { status: 409 })
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    const { data: latestDetails, error: Error } = await supabase
      .from('users')
      .select('id, name, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, verified')
      .eq('id', id)
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
        id: latestDetails.id,
        name: latestDetails.name,
        // password: latestDetails.password,
        phone_num: latestDetails.phone_num,
        vehi1: latestDetails.vehi1,
        vehi1_name: latestDetails.vehi1_name,
        vehi2: latestDetails.vehi2,
        vehi2_name: latestDetails.vehi2_name,
        verified: latestDetails.verified
      }
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
