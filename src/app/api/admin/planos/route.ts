import { NextRequest, NextResponse } from 'next/server';
import { getPlanos, criarPlano, atualizarPlano } from '@/lib/actions/admin';

export async function GET() {
  try {
    const planos = await getPlanos();
    return NextResponse.json(planos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await criarPlano({
      nome: body.nome,
      descricao: body.descricao,
      valorMensal: body.valorMensal,
      duracaoMeses: body.duracaoMeses,
      beneficios: body.beneficios,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
