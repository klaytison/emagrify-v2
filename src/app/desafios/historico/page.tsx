"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HistoricoDesafiosPage() {
  const { session } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [historico, setHistorico] = useState<any[]>([]);

  async function carregarHistorico() {
    setLoading(true);

    const res = await fetch("/api/desafios/historico");
    const data = await res.json();

    if (data?.historico) setHistorico(data.historico);

    setLoading(false);
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Você precisa estar logada para ver o histórico 🩵
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-orange-400" />
          Histórico de Desafios Semanais
        </h1>

        <div className="space-y-4">
          {historico.length === 0 && (
            <p className="text-gray-500">
              Nenhum desafio anterior encontrado.
            </p>
          )}

          {historico.map((d) => {
            const completados = d.progresso?.filter(Boolean).length ?? 0;
            const porcentagem = Math.round((completados / 7) * 100);
            const completo = completados === 7;

            return (
              <div
                key={d.id}
                className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900/40"
              >
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">{d.semana}</p>
                  <h2 className="font-semibold">{d.titulo}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {completados}/7 dias — {porcentagem}% concluído
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {completo ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <span className="text-gray-500 text-xs">Em andamento</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
