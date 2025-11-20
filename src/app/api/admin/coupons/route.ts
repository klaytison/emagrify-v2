import { NextResponse } from 'next/server';

export async function GET() {
  const coupons = [
    {
      id: '1',
      code: 'BEMVINDO50',
      type: 'percentage' as const,
      value: 50,
      usageLimit: 100,
      usageCount: 45,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicablePlans: ['Mensal', 'Trimestral'],
      active: true,
    },
    {
      id: '2',
      code: 'TRIAL30',
      type: 'trial' as const,
      value: 30,
      usageLimit: 50,
      usageCount: 12,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      applicablePlans: ['Todos'],
      active: true,
    },
    {
      id: '3',
      code: 'DESCONTO20',
      type: 'fixed' as const,
      value: 20,
      usageLimit: 200,
      usageCount: 178,
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      applicablePlans: ['Mensal'],
      active: true,
    },
  ];

  return NextResponse.json({ coupons });
}
