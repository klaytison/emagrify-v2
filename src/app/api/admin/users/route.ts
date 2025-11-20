import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - replace with real database queries
  const users = Array.from({ length: 50 }, (_, i) => ({
    id: String(i + 1),
    name: `Usuário ${i + 1}`,
    email: `usuario${i + 1}@example.com`,
    plan: ['Mensal', 'Trimestral', 'Anual'][Math.floor(Math.random() * 3)],
    status: ['active', 'canceled', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'canceled' | 'pending',
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    nextRenewal: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  return NextResponse.json({ users });
}
