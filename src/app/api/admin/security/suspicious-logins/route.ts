import { NextResponse } from 'next/server';

export async function GET() {
  const logins = [
    {
      id: '1',
      user: 'usuario@example.com',
      ip: '192.168.1.100',
      location: 'São Paulo, BR',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      blocked: false,
    },
    {
      id: '2',
      user: 'teste@example.com',
      ip: '10.0.0.50',
      location: 'Rio de Janeiro, BR',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      blocked: false,
    },
  ];

  return NextResponse.json({ logins });
}
