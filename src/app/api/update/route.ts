import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { getAllCookie, deleteAllCookie } from '@/app/actions'

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

    const { name, email, phone, password } = await request.json();
    let newName = name
    let newEmail = email
    let newPhone = phone
    let newPassword = await bcrypt.hash(password, 10)

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('name, email, phone_num, password')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    if (!user) {
      return NextResponse.json({ error: 'User not found. Please sign up.' }, { status: 404 });
    }

    if (!newName) {
      newName = user.name
    }
    if (!newEmail) {
      newEmail = user.email
    }
    if (!newPhone) {
      newPhone = user.phone_num
    }
    if (!newPassword) {
      newPassword = user.password
    }

    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ name: newName, email: newEmail, phone_num: newPhone, password: newPassword })
      .eq('id', id)
      .select("id, name, phone_num, vehi1, vehi2, vehi1_name, vehi2_name, verified")
      .maybeSingle();

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json({ error: 'Email or phone already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    if (!updateData) {
      return NextResponse.json({ error: 'No user found. Please sign up.' }, { status: 404 })
    }

    await deleteAllCookie();

    return NextResponse.json({
      message: 'Updated successfully',
      user: {
        loggedin: true,
        id: updateData.id,
        name: updateData.name,
        phone_num: updateData.phone_num,
        vehi1: updateData.vehi1,
        vehi1_name: updateData.vehi1_name,
        vehi2: updateData.vehi2,
        vehi2_name: updateData.vehi2_name,
        verified: updateData.verified
      }
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
