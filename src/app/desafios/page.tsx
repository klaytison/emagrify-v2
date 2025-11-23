"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Target, CheckCircle2, History } from "lucide-react";
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

  // 🔊 Som para mensagens motivacionais
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      // Coloque um arquivo em /public/sounds/desafio-pop.mp3
      audioRef.current = new Audio("/sounds/desafio-pop.mp3");
      audioRef.current.volume = 0.4;
    }
  }, []);

  // ⭐ Mensagem motivacional (ETAPA C)
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const total = progresso.filter(Boolean).length;

    if (total === 0) {
      setMensagem("Toda jornada começa com o primeiro passo! Você consegue 💚");
    } else if (total <= 2) {
      setMensagem("Ótimo começo! Continue assim ✨");
    } else if (total < 4) {
      setMensagem("Metade da semana concluída! Você está indo muito bem 🔥");
    } else if (total < 6) {
      setMensagem("Você está muito perto de completar o desafio! 🏅");
    } else if (total < 7) {
      setMensagem("Desafio quase completo! Orgulho demais 🧡");
    } else {
      setMensagem("Desafio da semana completo! Perfeita demais! 🏆");
    }
  }, [progresso]);

  // Toca o som sempre que a mensagem mudar
  useEffect(() => {
    if (!mensagem) return;
    if (!audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // se o navegador bloquear autoplay, só ignora
      });
    } catch {
      // ignora erros de áudio
    }
  }, [mensagem]);

  // Carregar desafio da semana atual
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
  const semanaAtual = desafio?.semana;

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Cabeçalho */}
        <section className="space-y-3">
          <motion.div
            className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold"
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Target className="w-3 h-3" />
            Desafios Semanais
          </motion.div>

          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {desafio?.titulo}
          </motion.h1>

          <motion.p
            className="text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {desafio?.descricao}
          </motion.p>
        </section>

        {/* 💬 Mensagem motivacional com animação bonita */}
        <AnimatePresence>
          {mensagem && (
            <motion.div
              key={mensagem}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.35 }}
              className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent px-4 py-3"
            >
              {/* Glow animado de fundo */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                  <Target className="w-4 h-4 text-emerald-300" />
                </div>
                <p className="text-sm text-emerald-50 dark:text-emerald-100">
                  {mensagem}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card principal do desafio */}
        <motion.section
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/60 p-5 space-y-4 shadow-sm"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          {/* Barra de progresso com animação */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Seu progresso na semana</h2>
              {semanaAtual && (
                <span className="text-[11px] rounded-full border border-emerald-400/40 px-2 py-0.5 text-emerald-300 bg-emerald-500/10">
                  Semana {semanaAtual}
                </span>
              )}
            </div>

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
          </div>

          {/* Dias da semana */}
          <section className="grid grid-cols-7 gap-3 pt-2">
            {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => {
              const marcado = progresso[index];

              return (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    const novo = [...progresso];
                    novo[index] = !novo[index];
                    setProgresso(novo);
                  }}
                  className={`p-4 rounded-xl border text-center transition ${
                    marcado
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30"
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
          <section className="pt-4 flex justify-end">
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
        </motion.section>

        {/* Cards extras: visão detalhada + histórico */}
        <section className="grid md:grid-cols-2 gap-4">
          {/* Card visão detalhada da semana */}
          <motion.div
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 18px 35px rgba(0,0,0,0.28)" }}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                Detalhes da semana
              </p>
              <h2 className="text-lg font-semibold">Ver progresso dia a dia</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Acesse a visão detalhada desta semana e veja exatamente quais dias você marcou como concluídos.
              </p>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Progresso atual:{" "}
                <span className="font-semibold text-emerald-400">
                  {progressoCount}/7
                </span>
              </span>

              {semanaAtual ? (
                <Link href={`/desafios/${semanaAtual}`}>
                  <Button
                    variant="outline"
                    className="border-emerald-500/60 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs px-3 py-1"
                  >
                    Abrir visão detalhada
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="border-gray-500/40 text-gray-400 text-xs px-3 py-1"
                >
                  Semana não encontrada
                </Button>
              )}
            </div>
          </motion.div>

          {/* Card histórico */}
          <motion.div
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4 flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -4, boxShadow: "0 18px 35px rgba(0,0,0,0.28)" }}
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
                Histórico
              </p>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                Ver desafios anteriores
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compare semanas, veja quais você concluiu mais dias e acompanhe sua consistência ao longo do tempo.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Link href="/desafios/historico">
                <Button className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-4 py-1.5">
                  Abrir histórico
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
}
