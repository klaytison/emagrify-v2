"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, CheckCircle2, Target } from "lucide-react";

type Desafio = {
  id: string;
  semana: string;
  titulo: string;
  descricao: string;
  progresso: boolean[];
};

export default function DesafioSemanaPage({ params }: any) {
  const semana = params.semana;
  const { supabase, session } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [desafio, setDesafio] = useState<Desafio | null>(null);

  async function carregar() {
    const { data, error } = await supabase
      .from("desafios_semanais")
      .select("*")
      .eq("semana", semana)
      .maybeSingle();

    if (!error && data) setDesafio(data as any);

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!desafio) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Desafio não encontrado.
      </div>
    );
  }

  const completados = desafio.progresso.filter(Boolean).length;
  const pct = (completados / 7) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
          <Target className="w-3 h-3" />
          Semana {desafio.semana}
        </div>

        <h1 className="text-3xl font-bold">{desafio.titulo}</h1>
        <p className="text-gray-400">{desafio.descricao}</p>

        {/* Barra */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${pct}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm">
            {completados} de 7 dias completos
          </p>
        </div>

        {/* 7 dias */}
        <section className="grid grid-cols-7 gap-3">
          {desafio.progresso.map((ok, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border text-center ${
                ok
                  ? "bg-emerald-500 text-white border-emerald-600"
                  : "bg-gray-900 border-gray-800 text-gray-500"
              }`}
            >
              {ok ? <CheckCircle2 className="mx-auto" /> : ["S","T","Q","Q","S","S","D"][i]}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
