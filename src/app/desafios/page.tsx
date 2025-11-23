"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  // progresso real
  const [progresso, setProgresso] = useState<boolean[]>(new Array(7).fill(false));

  // porcentagem animada
  const [pctAnimado, setPctAnimado] = useState(0);

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

  // Atualizar porcentagem com animação suave
  useEffect(() => {
    const total = progresso.filter(Boolean).length;
    const pct = Math.round((total / 7) * 100);

    let atual = 0;
    const anim = setInterval(() => {
      atual++;
      if (atual >= pct) {
        atual = pct;
        clearInterval(anim);
      }
      setPctAnimado(atual);
    }, 10);

    return () => clearInterval(anim);
  }, [progresso]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Você precisa estar logada 😊
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
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Cabeçalho */}
        <motion.section
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
            <Target className="w-3 h-3" />
            Desafios Semanais
          </div>

          <h1 className="text-3xl font-bold mt-3">{desafio?.titulo}</h1>
          <p className="text-gray-600 dark:text-gray-400">{desafio?.descricao}</p>

          {/* botão histórico */}
          <Link href="/desafios/historico">
            <Button variant="outline" className="mt-4 border-gray-400">
              Ver histórico de desafios
            </Button>
          </Link>
        </motion.section>

        {/* Barra de progresso animada */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Seu progresso</h2>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${pctAnimado}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <motion.p
            className="text-sm text-gray-500 font-semibold"
            key={pctAnimado}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {pctAnimado}% completo
          </motion.p>
        </section>

        {/* Dias da semana */}
        <section className="grid grid-cols-7 gap-3">
          {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              key={index}
              onClick={() => {
                const novo = [...progresso];
                novo[index] = !novo[index];
                setProgresso(novo);
              }}
              className={`p-4 rounded-xl border text-center transition ${
                progresso[index]
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500"
              }`}
            >
              <AnimatePresence mode="wait">
                {progresso[index] ? (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle2 className="w-5 h-5 mx-auto" />
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-semibold"
                  >
                    {dia}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </section>

        {/* Botão salvar */}
        <section className="pt-6 flex justify-end">
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }}>
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
