'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function SubscriptionsPage() {
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // EXEMPLO — aqui futuramente você vai buscar assinaturas reais
      setSubscriptions([
        { id: 1, email: 'usuario@example.com', status: 'Ativa', plano: 'Mensal' }
      ]);

      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-[#F4F4F4] dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Assinaturas</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : subscriptions.length === 0 ? (
          <p>Nenhuma assinatura encontrada.</p>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow"
              >
                <p><strong>Email:</strong> {sub.email}</p>
                <p><strong>Plano:</strong> {sub.plano}</p>
                <p><strong>Status:</strong> {sub.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
