"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Target } from "lucide-react";
import Link from "next/link";

type Desafio = {
  id: string;
  semana: string;
  titulo: string;
  descricao: string;
  progresso: boolean[];
};

export default function HistoricoDesafiosPage() {
  const { supabase, session } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [desafios, setDesafios] = useState<Desafio[]>([]);

  async function carregar() {
    if (!session?.user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("desafios_semanais")
      .select("*")
      .eq("user_id", session.user.id)
      .order("semana", { ascending: false });

    if (!error && data) {
      setDesafios(data as any);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Você precisa estar logada.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        <div className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
          <Target className="w-3 h-3" />
          Histórico de Desafios
        </div>

        <h1 className="text-3xl font-bold">Seu histórico</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Veja todos os desafios semanais que você já completou ou participou.
        </p>

        <div className="space-y-4 pt-4">

          {desafios.map((d) => {
            const completados = d.progresso.filter(Boolean).length;
            const pct = (completados / 7) * 100;

            return (
              <Link
                key={d.id}
                href={`/desafios/${d.semana}`}
                className="block rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:bg-gray-50/50 dark:hover:bg-gray-900/60 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{d.titulo}</h2>
                    <p className="text-sm text-gray-500">{d.descricao}</p>
                    <p className="text-xs mt-2 text-gray-400">
                      Semana {d.semana}
                    </p>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {completados} de 7 dias concluídos
                </p>
              </Link>
            );
          })}

        </div>
      </main>
    </div>
  );
}
