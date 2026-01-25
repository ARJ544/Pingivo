import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

const supabaseUrl: any = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey: any = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, password } = body;

  const { data, error } = await supabase
    .from('Users')
    .insert({ name: name, email: email, phone_num: phone, password: password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}