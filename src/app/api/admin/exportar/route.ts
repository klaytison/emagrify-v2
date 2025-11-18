import { NextRequest, NextResponse } from 'next/server';
import { exportarCSV } from '@/lib/actions/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo') as 'assinaturas' | 'transacoes' | 'usuarios';

    if (!tipo || !['assinaturas', 'transacoes', 'usuarios'].includes(tipo)) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    const csv = await exportarCSV(tipo);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${tipo}_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
