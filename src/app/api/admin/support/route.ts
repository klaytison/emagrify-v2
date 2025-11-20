import { NextResponse } from 'next/server';

export async function GET() {
  const tickets = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    user: `Usuário ${i + 1}`,
    subject: `Problema ${i + 1}`,
    status: ['open', 'in-progress', 'resolved'][Math.floor(Math.random() * 3)] as 'open' | 'in-progress' | 'resolved',
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    messages: Math.floor(Math.random() * 10) + 1,
  }));

  return NextResponse.json({ tickets });
}
