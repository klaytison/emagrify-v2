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
  const mes = searchParams.get('mes');
  const tipo = searchParams.get('tipo');

  let query = supabase
    .from('transacoes_assinatura')
    .select(`
      *,
      profiles!transacoes_assinatura_user_id_fkey (
        email,
        nome
      )
    `);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (mes) {
    const [ano, mesNum] = mes.split('-');
    const dataInicio = new Date(parseInt(ano), parseInt(mesNum) - 1, 1);
    const dataFim = new Date(parseInt(ano), parseInt(mesNum), 0);
    query = query.gte('data', dataInicio.toISOString()).lte('data', dataFim.toISOString());
  }

  if (tipo) {
    query = query.eq('tipo', tipo);
  }

  const { data, error } = await query.order('data', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
