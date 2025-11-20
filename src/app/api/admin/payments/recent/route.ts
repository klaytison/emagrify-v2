import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Mock data - replace with real database queries
    const payments = [
      {
        id: '1',
        user: 'João Silva',
        amount: 97.00,
        method: 'Cartão de Crédito',
        status: 'paid',
        date: new Date().toISOString(),
      },
      {
        id: '2',
        user: 'Maria Santos',
        amount: 97.00,
        method: 'PIX',
        status: 'paid',
        date: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        user: 'Pedro Oliveira',
        amount: 97.00,
        method: 'Boleto',
        status: 'pending',
        date: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '4',
        user: 'Ana Costa',
        amount: 97.00,
        method: 'Cartão de Crédito',
        status: 'paid',
        date: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: '5',
        user: 'Carlos Ferreira',
        amount: 97.00,
        method: 'PIX',
        status: 'paid',
        date: new Date(Date.now() - 14400000).toISOString(),
      },
    ];

    return NextResponse.json({ payments }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    
    // Return empty array on error
    return NextResponse.json(
      { payments: [], error: 'Failed to fetch payments' },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
