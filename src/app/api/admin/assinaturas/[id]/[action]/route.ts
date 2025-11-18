import { NextRequest, NextResponse } from 'next/server';
import { cancelarAssinatura, estenderAssinatura } from '@/lib/actions/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const { id, action } = params;

    if (action === 'cancelar') {
      const result = await cancelarAssinatura(id);
      return NextResponse.json(result);
    } else if (action === 'estender') {
      const body = await request.json();
      const result = await estenderAssinatura(id, body.meses);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
