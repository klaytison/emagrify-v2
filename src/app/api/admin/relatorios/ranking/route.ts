import { NextRequest, NextResponse } from 'next/server';
import { getRankingUsuarios } from '@/lib/actions/admin';

export async function GET() {
  try {
    const ranking = await getRankingUsuarios();
    return NextResponse.json(ranking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
