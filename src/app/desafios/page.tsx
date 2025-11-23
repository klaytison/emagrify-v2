"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Desafio = {
  id: string;
  user_id: string;
  semana: string;
  titulo: string;
  descricao: string;
  progresso: boolean[];
};

export default function DesafiosSemanaisPage() {
  const { supabase, session } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [progresso, setProgresso] = useState<boolean[]>(new Array(7).fill(false));

  // Carregar desafio
  async function carregarDesafio() {
    if (!session?.user?.id) return;

    setLoading(true);

    try {
      const res = await fetch("/api/desafios/semana", {
        headers: {
          "x-user-id": session.user.id,
        },
      });

      const data = await res.json();

      if (data?.desafio) {
        setDesafio(data.desafio);
        setProgresso(data.desafio.progresso || new Array(7).fill(false));
      }
    } catch (e) {
      console.error("Erro ao carregar desafio:", e);
    }

    setLoading(false);
  }

  // Salvar progresso
  async function salvarProgresso() {
    if (!session?.user?.id) return;

    setSalvando(true);

    try {
      const res = await fetch("/api/desafios/semana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          progresso,
        }),
      });

      const data = await res.json();
      if (data?.desafio) setDesafio(data.desafio);
    } catch (e) {
      console.error("Erro ao salvar progresso:", e);
    }

    setSalvando(false);
  }

  useEffect(() => {
    carregarDesafio();
  }, [session]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Você precisa estar logada para acessar seus desafios semanais 😊
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

  const progressoCount = progresso.filter(Boolean).length;
  const progressoPercent = (progressoCount / 7) * 100;

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Cabeçalho */}
        <section className="space-y-2">
          <motion.div
            className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Target className="w-3 h-3" />
            Desafios Semanais
          </motion.div>

          <h1 className="text-3xl font-bold">{desafio?.titulo}</h1>
          <p className="text-gray-600 dark:text-gray-400">{desafio?.descricao}</p>
        </section>

        {/* Barra de progresso com animação */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Seu progresso</h2>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressoPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* número animado */}
          <motion.p
            key={progressoCount}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-500"
          >
            {progressoCount} de 7 dias completos
          </motion.p>
        </section>

        {/* Dias da semana */}
        <section className="grid grid-cols-7 gap-3">
          {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => {
            const marcado = progresso[index];

            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const novo = [...progresso];
                  novo[index] = !novo[index];
                  setProgresso(novo);
                }}
                className={`p-4 rounded-xl border text-center transition ${
                  marcado
                    ? "bg-emerald-500 text-white border-emerald-600"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500"
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {marcado ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <CheckCircle2 className="w-5 h-5 mx-auto" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="letter"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {dia}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </section>

        {/* Botão salvar */}
        <section className="pt-6 flex justify-end">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={salvarProgresso}
              disabled={salvando}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
            >
              {salvando ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Salvar progresso semanal"
              )}
            </Button>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
}
