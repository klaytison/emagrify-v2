'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function PaymentsPage() {
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Por enquanto, só lê tudo da tabela transacoes_assinaturas
      const { data, error } = await supabase
        .from('transacoes_assinaturas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar pagamentos:', error);
        setPayments([]);
      } else {
        setPayments(data || []);
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-[#0F172A] text-white">
      <h1 className="text-3xl font-bold mb-6">Pagamentos</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : payments.length === 0 ? (
        <p>Nenhum pagamento encontrado.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800 p-6 rounded-xl shadow"
            >
              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Usuário:</strong> {p.user_id}</p>
              <p><strong>Assinatura:</strong> {p.assinatura_id}</p>
              <p><strong>Método:</strong> {p.metodo || p.metodo_pagamento}</p>
              <p><strong>Status:</strong> {p.status}</p>
              <p><strong>Valor:</strong> {p.valor}</p>
              <p><strong>Criado em:</strong> {p.created_at}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
