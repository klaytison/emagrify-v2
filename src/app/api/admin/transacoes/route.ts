import { NextRequest, NextResponse } from 'next/server';
import { getTransacoes } from '@/lib/actions/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filtro = {
      tipo: searchParams.get('tipo') || undefined,
      mesAno: searchParams.get('mesAno') || undefined,
      userId: searchParams.get('userId') || undefined,
    };

    // Filtro por data
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    let transacoes = await getTransacoes(filtro);

    // Filtrar por período se fornecido
    if (dataInicio || dataFim) {
      transacoes = transacoes.filter(t => {
        const dataTransacao = new Date(t.data);
        if (dataInicio && dataTransacao < new Date(dataInicio)) return false;
        if (dataFim && dataTransacao > new Date(dataFim)) return false;
        return true;
      });
    }

    return NextResponse.json(transacoes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
