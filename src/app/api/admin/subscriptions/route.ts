import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data
  const subscriptions = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    userId: String(i + 1),
    userName: `Usuário ${i + 1}`,
    plan: ['Mensal', 'Trimestral', 'Anual'][Math.floor(Math.random() * 3)],
    status: ['active', 'canceled', 'expired'][Math.floor(Math.random() * 3)] as 'active' | 'canceled' | 'expired',
    startDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    autoRenew: Math.random() > 0.3,
    monthsPaid: Math.floor(Math.random() * 12) + 1,
    daysRemaining: Math.floor(Math.random() * 90),
  }));

  return NextResponse.json({ subscriptions });
}
