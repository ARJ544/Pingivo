import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getAllCookie, deleteAllCookie } from '@/app/actions'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function DELETE() {
  try {
    const { loggedin, id } = await getAllCookie();

    if (!loggedin || !id) {
      return NextResponse.json({ error: 'Login first' }, { status: 401 });
    }

    const {error: Error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (Error) {
      return NextResponse.json({ error: Error.message }, { status: 500 })
    }

    await deleteAllCookie();

    return NextResponse.json({ message: 'Vehicle Deleted successfully' }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}