'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function SubscriptionsPage() {
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("assinaturas")
        .select(`
          id,
          status,
          data_inicio,
          data_fim,
          user_id,
          profiles ( email )
        `);

      if (error) {
        console.error("Erro ao carregar assinaturas:", error);
        setSubs([]);
      } else {
        setSubs(data);
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-[#0F172A] text-white">
      <h1 className="text-3xl font-bold mb-6">Assinaturas</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : subs.length === 0 ? (
        <p>Nenhuma assinatura encontrada.</p>
      ) : (
        <div className="space-y-4">
          {subs.map((s) => (
            <div
              key={s.id}
              className="bg-slate-800 p-6 rounded-xl shadow"
            >
              <p><strong>Email:</strong> {s.profiles?.email}</p>
              <p><strong>Status:</strong> {s.status}</p>
              <p><strong>Início:</strong> {s.data_inicio ?? "—"}</p>
              <p><strong>Fim:</strong> {s.data_fim ?? "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
