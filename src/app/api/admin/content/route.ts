import { NextResponse } from 'next/server';

export async function GET() {
  const contents = Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    title: `Conteúdo ${i + 1}`,
    type: ['post', 'page', 'video'][Math.floor(Math.random() * 3)] as 'post' | 'page' | 'video',
    visibility: ['public', 'subscribers', 'plan-specific'][Math.floor(Math.random() * 3)] as 'public' | 'subscribers' | 'plan-specific',
    status: ['published', 'draft', 'scheduled'][Math.floor(Math.random() * 3)] as 'published' | 'draft' | 'scheduled',
    author: 'Admin',
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledFor: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  }));

  return NextResponse.json({ contents });
}
