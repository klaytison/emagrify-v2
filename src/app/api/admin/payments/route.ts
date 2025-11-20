import { NextResponse } from 'next/server';

export async function GET() {
  const payments = Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
    user: `Usuário ${i + 1}`,
    amount: 97.00,
    method: ['card', 'pix', 'boleto'][Math.floor(Math.random() * 3)] as 'card' | 'pix' | 'boleto',
    status: ['paid', 'pending', 'failed', 'refunded'][Math.floor(Math.random() * 4)] as 'paid' | 'pending' | 'failed' | 'refunded',
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    transactionId: `TXN${String(i + 1).padStart(8, '0')}`,
  }));

  return NextResponse.json({ payments });
}
