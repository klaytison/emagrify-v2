'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Percent } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'trial';
  value: number;
  usageLimit: number;
  usageCount: number;
  validUntil: string;
  plans: string[];
  active: boolean;
}

const MOCK_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'BEMVINDO20',
    type: 'percentage',
    value: 20,
    usageLimit: 100,
    usageCount: 45,
    validUntil: '2024-12-31',
    plans: ['Premium', 'Basic'],
    active: true,
  },
  {
    id: '2',
    code: 'PRIMEIRACOMPRA',
    type: 'fixed',
    value: 30,
    usageLimit: 50,
    usageCount: 12,
    validUntil: '2024-06-30',
    plans: ['Premium'],
    active: true,
  },
  {
    id: '3',
    code: 'TRIAL7DIAS',
    type: 'trial',
    value: 7,
    usageLimit: 200,
    usageCount: 89,
    validUntil: '2024-12-31',
    plans: ['Premium', 'Basic'],
    active: true,
  },
];

export default function CouponsPage() {
  const [coupons] = useState<Coupon[]>(MOCK_COUPONS);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      percentage: 'Percentual',
      fixed: 'Fixo',
      trial: 'Trial',
    };
    return labels[type] || type;
  };

  const getValueDisplay = (coupon: Coupon) => {
    if (coupon.type === 'percentage') return `${coupon.value}%`;
    if (coupon.type === 'fixed') return `R$ ${coupon.value}`;
    return `${coupon.value} dias`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cupons</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie cupons e promoções
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          <span>Criar Cupom</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] rounded-xl">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{coupon.code}</h3>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {getTypeLabel(coupon.type)}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                coupon.active 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {coupon.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Desconto:</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {getValueDisplay(coupon)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Uso:</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {coupon.usageCount} / {coupon.usageLimit}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] h-2 rounded-full transition-all"
                  style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Válido até:</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">Planos:</span>
                <div className="flex flex-wrap gap-2">
                  {coupon.plans.map((plan, index) => (
                    <span key={index} className="px-2 py-1 rounded-lg text-xs font-medium bg-[#7BE4B7]/20 text-[#7BE4B7]">
                      {plan}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </button>
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
