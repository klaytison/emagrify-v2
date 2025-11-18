import { NextRequest, NextResponse } from 'next/server';
import { getAssinaturas, criarAssinatura, doarAssinatura } from '@/lib/actions/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filtro = {
      status: searchParams.get('status') || undefined,
      plano: searchParams.get('plano') || undefined,
      busca: searchParams.get('busca') || undefined,
    };

    const assinaturas = await getAssinaturas(filtro);
    return NextResponse.json(assinaturas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.tipo === 'doar') {
      const result = await doarAssinatura({
        userEmail: body.userEmail,
        plano: body.plano,
        meses: body.meses,
      });
      return NextResponse.json(result);
    } else {
      const result = await criarAssinatura({
        userEmail: body.userEmail,
        plano: body.plano,
        valorMensal: body.valorMensal,
        meses: body.meses,
        renovaAutomaticamente: body.renovaAutomaticamente,
      });
      return NextResponse.json(result);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
