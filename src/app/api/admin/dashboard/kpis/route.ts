import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - substituir por consultas reais ao banco
  const kpis = [
    {
      title: 'Total de Assinantes',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: 'Users',
      color: 'blue'
    },
    {
      title: 'MRR (Receita Mensal)',
      value: 'R$ 45.890',
      change: '+8.2%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'green'
    },
    {
      title: 'Novos Assinantes (30d)',
      value: '156',
      change: '+23.1%',
      trend: 'up',
      icon: 'UserPlus',
      color: 'purple'
    },
    {
      title: 'Taxa de Churn',
      value: '2.4%',
      change: '-0.8%',
      trend: 'down',
      icon: 'UserMinus',
      color: 'orange'
    }
  ];

  return NextResponse.json({ kpis });
}
