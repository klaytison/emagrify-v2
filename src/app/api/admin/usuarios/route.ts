import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'klaytsa3@gmail.com';

async function checkAdmin(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user || user.email !== ADMIN_EMAIL) {
    return null;
  }
  
  return user;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  
  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  let query = supabase
    .from('profiles')
    .select(`
      *,
      assinaturas (
        id,
        status,
        data_inicio,
        data_fim,
        meses_pagos,
        renovacao_automatica
      )
    `);

  if (search) {
    query = query.or(`email.ilike.%${search}%,nome.ilike.%${search}%,id.eq.${search}`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  
  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const body = await request.json();
  const { user_id, action, data: actionData } = body;

  await supabase.from('admin_logs').insert({
    admin_email: admin.email,
    acao: action,
    detalhes: actionData,
    target_user_id: user_id
  });

  return NextResponse.json({ success: true });
}
