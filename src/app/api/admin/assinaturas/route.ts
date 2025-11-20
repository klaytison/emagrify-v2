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
  const userId = searchParams.get('user_id');

  let query = supabase
    .from('assinaturas')
    .select(`
      *,
      profiles!assinaturas_user_id_fkey (
        email,
        nome
      ),
      plans (
        nome,
        preco
      )
    `);

  if (userId) {
    query = query.eq('user_id', userId);
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
  const { user_id, plan_id, meses, tipo } = body;

  const dataInicio = new Date();
  const dataFim = new Date();
  dataFim.setMonth(dataFim.getMonth() + meses);

  const { data: assinatura, error } = await supabase
    .from('assinaturas')
    .insert({
      user_id,
      plan_id,
      status: 'ativa',
      data_inicio: dataInicio.toISOString(),
      data_fim: dataFim.toISOString(),
      meses_pagos: meses,
      renovacao_automatica: false
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('transacoes_assinatura').insert({
    user_id,
    assinatura_id: assinatura.id,
    tipo: tipo || 'doacao_admin',
    descricao: `Assinatura criada pelo admin - ${meses} meses`,
    valor: 0,
    status: 'concluida'
  });

  await supabase.from('admin_logs').insert({
    admin_email: admin.email,
    acao: 'criar_assinatura',
    detalhes: { user_id, meses, assinatura_id: assinatura.id },
    target_user_id: user_id
  });

  return NextResponse.json(assinatura);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const admin = await checkAdmin(supabase);
  
  if (!admin) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  const body = await request.json();
  const { id, action, data: actionData } = body;

  let updateData: any = {};

  switch (action) {
    case 'cancelar':
      updateData = { status: 'cancelada', renovacao_automatica: false };
      break;
    case 'ativar':
      updateData = { status: 'ativa' };
      break;
    case 'estender':
      const { meses } = actionData;
      const { data: current } = await supabase
        .from('assinaturas')
        .select('data_fim, meses_pagos')
        .eq('id', id)
        .single();
      
      if (current) {
        const novaDataFim = new Date(current.data_fim);
        novaDataFim.setMonth(novaDataFim.getMonth() + meses);
        updateData = {
          data_fim: novaDataFim.toISOString(),
          meses_pagos: (current.meses_pagos || 0) + meses,
          status: 'ativa'
        };
      }
      break;
    case 'renovacao':
      updateData = { renovacao_automatica: actionData.renovacao };
      break;
  }

  const { data, error } = await supabase
    .from('assinaturas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('admin_logs').insert({
    admin_email: admin.email,
    acao: `assinatura_${action}`,
    detalhes: { assinatura_id: id, ...actionData },
    target_user_id: data.user_id
  });

  return NextResponse.json(data);
}
