"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, CheckCircle2, Target } from "lucide-react";
import { motion } from "framer-motion";

type Desafio = {
  id: string;
  semana: string;
  titulo: string;
  descricao: string;
  progresso: boolean[];
};

interface DesafioSemanaPageProps {
  params: {
    semana: string;
  };
}

export default function DesafioSemanaPage({ params }: DesafioSemanaPageProps) {
  const semana = params.semana;
  const { supabase } = useSupabase();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semana]);

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
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <motion.div
          className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold"
          initial={{ scale: 0.85, opacity: 0, y: -8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
        >
          <Target className="w-3 h-3" />
          Semana {desafio.semana}
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">{desafio.titulo}</h1>
          <p className="text-gray-400">{desafio.descricao}</p>
        </motion.div>

        {/* Barra */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-gray-400 text-sm">
            {completados} de 7 dias completos
          </p>
        </motion.div>

        {/* 7 dias */}
        <section className="grid grid-cols-7 gap-3">
          {desafio.progresso.map((ok, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`p-4 rounded-xl border text-center ${
                ok
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30"
                  : "bg-gray-900 border-gray-800 text-gray-500"
              }`}
            >
              {ok ? (
                <CheckCircle2 className="mx-auto" />
              ) : (
                ["S", "T", "Q", "Q", "S", "S", "D"][i]
              )}
            </motion.div>
          ))}
        </section>
      </main>
    </motion.div>
  );
}
