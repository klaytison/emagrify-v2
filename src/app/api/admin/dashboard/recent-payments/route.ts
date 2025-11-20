import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - substituir por consultas reais ao banco
  const payments = [
    {
      id: '1',
      user: 'João Silva',
      amount: 97.00,
      method: 'Cartão de Crédito',
      status: 'approved',
      date: '15/01/2024'
    },
    {
      id: '2',
      user: 'Maria Santos',
      amount: 97.00,
      method: 'PIX',
      status: 'approved',
      date: '15/01/2024'
    },
    {
      id: '3',
      user: 'Pedro Oliveira',
      amount: 97.00,
      method: 'Boleto',
      status: 'pending',
      date: '14/01/2024'
    },
    {
      id: '4',
      user: 'Ana Costa',
      amount: 97.00,
      method: 'Cartão de Crédito',
      status: 'approved',
      date: '14/01/2024'
    },
    {
      id: '5',
      user: 'Carlos Ferreira',
      amount: 97.00,
      method: 'PIX',
      status: 'failed',
      date: '13/01/2024'
    }
  ];

  return NextResponse.json({ payments });
}
