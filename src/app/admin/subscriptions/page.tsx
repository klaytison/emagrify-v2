'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  active: boolean;
  subscribers: number;
}

const MOCK_PLANS: Plan[] = [
  {
    id: '1',
    name: 'Basic',
    price: 47,
    interval: 'monthly',
    features: ['Acesso a conteúdo básico', 'Suporte por email'],
    active: true,
    subscribers: 234,
  },
  {
    id: '2',
    name: 'Premium',
    price: 97,
    interval: 'monthly',
    features: ['Acesso total', 'Suporte prioritário', 'Conteúdo exclusivo'],
    active: true,
    subscribers: 567,
  },
  {
    id: '3',
    name: 'Anual',
    price: 970,
    interval: 'yearly',
    features: ['Acesso total', 'Suporte VIP', '2 meses grátis'],
    active: true,
    subscribers: 446,
  },
];

export default function SubscriptionsPage() {
  const [plans] = useState<Plan[]>(MOCK_PLANS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assinaturas</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie planos e assinaturas
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          <span>Criar Plano</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                plan.active 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {plan.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  R$ {plan.price}
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  /{plan.interval === 'monthly' ? 'mês' : 'ano'}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Recursos:
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="text-[#7BE4B7] mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm">
                <span className="text-slate-600 dark:text-slate-400">Assinantes: </span>
                <span className="font-bold text-slate-900 dark:text-white">{plan.subscribers}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Estatísticas de Receita
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gradient-to-br from-[#7BE4B7]/10 to-[#6ECBF5]/10 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#7BE4B7] rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                MRR Total
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              R$ 45.890
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#FF7A00]/10 to-[#7BE4B7]/10 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#FF7A00] rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                ARR Projetado
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              R$ 550.680
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-[#6ECBF5]/10 to-[#7BE4B7]/10 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#6ECBF5] rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Ticket Médio
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              R$ 73
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
