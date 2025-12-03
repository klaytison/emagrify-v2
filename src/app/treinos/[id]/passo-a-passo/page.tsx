"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/providers/SupabaseProvider";

interface TreinoExercicio {
  nome: string;
  series: string | null;
  repeticoes: string | null;
  descansoSegundos: number | null;
}

interface Treino {
  id: string;
  titulo: string;
  descricao: string | null;
  nivel: string;
  categoria: string | null;
  duracao: number | null;
  calorias: number | null;
  video_url: string | null;
  imagem_url: string | null;
  exercicios: TreinoExercicio[];
}

type Fase = "execucao" | "descanso";

export default function ModoPassoAPassoPage() {
  const params = useParams();
  const router = useRouter();
  const { session } = useSupabase();

  const id = params?.id as string;

  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [fase, setFase] = useState<Fase>("execucao");
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [terminou, setTerminou] = useState(false);
  const [concluindo, setConcluindo] = useState(false);

  // Configs simples
  const TEMPO_PADRAO_EXERCICIO = 40; // segundos se não tiver nada definido
  const TEMPO_PADRAO_DESCANSO = 40;

  const totalExercicios = treino?.exercicios?.length || 0;

  const exercicioAtual: TreinoExercicio | null = useMemo(() => {
    if (!treino || totalExercicios === 0) return null;
    return treino.exercicios[indiceAtual] ?? null;
  }, [treino, indiceAtual, totalExercicios]);

  const progressoTreino = useMemo(() => {
    if (!totalExercicios) return 0;
    return ((indiceAtual) / totalExercicios) * 100;
  }, [indiceAtual, totalExercicios]);

  // Carregar treino
  useEffect(() => {
    async function loadTreino() {
      try {
        setLoading(true);
        const res = await fetch(`/api/treinos/${id}`);
        const data = await res.json();
        if (!res.ok) return;

        setTreino(data.treino);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadTreino();
  }, [id]);

  // Inicializar tempo quando treino/exercício/fase mudam
  useEffect(() => {
    if (!exercicioAtual) return;

    if (fase === "execucao") {
      setSegundosRestantes(TEMPO_PADRAO_EXERCICIO);
    } else {
      const descanso =
        exercicioAtual.descansoSegundos ?? TEMPO_PADRAO_DESCANSO;
      setSegundosRestantes(descanso);
    }

    setRodando(false); // começa pausado, user aperta play
  }, [fase, exercicioAtual]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (!rodando) return;
    if (segundosRestantes <= 0) return;

    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          // chegou a zero
          avançarAutomatico();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [rodando, segundosRestantes]); // eslint-disable-line react-hooks/exhaustive-deps

  function avançarAutomatico() {
    // troca exec -> descanso OU vai para próximo exercício
    setRodando(false);

    setTimeout(() => {
      setSegundosRestantes(0);

      if (!treino || !exercicioAtual) return;

      if (fase === "execucao") {
        const descanso =
          exercicioAtual.descansoSegundos ?? TEMPO_PADRAO_DESCANSO;

        if (descanso > 0) {
          setFase("descanso");
          return;
        }

        // sem descanso: já pula pra próximo
        irParaProximo();
      } else {
        // estava em descanso -> próximo exercício
        irParaProximo();
      }
    }, 150);
  }

  function irParaProximo() {
    if (!treino) return;
    if (indiceAtual + 1 >= totalExercicios) {
      // acabou tudo ✨
      setTerminou(true);
      setRodando(false);
      return;
    }

    setIndiceAtual((i) => i + 1);
    setFase("execucao");
  }

  function irParaAnterior() {
    if (!treino) return;
    if (indiceAtual === 0) {
      setFase("execucao");
      setSegundosRestantes(TEMPO_PADRAO_EXERCICIO);
      setRodando(false);
      return;
    }

    setIndiceAtual((i) => i - 1);
    setFase("execucao");
  }

  function resetarFase() {
    if (!exercicioAtual) return;

    if (fase === "execucao") {
      setSegundosRestantes(TEMPO_PADRAO_EXERCICIO);
    } else {
      const descanso =
        exercicioAtual.descansoSegundos ?? TEMPO_PADRAO_DESCANSO;
      setSegundosRestantes(descanso);
    }

    setRodando(false);
  }

  async function concluirTreino() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      setConcluindo(true);

      const res = await fetch("/api/treinos/concluir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treinoId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao concluir treino.");
        return;
      }

      router.push("/monitoramento");
    } finally {
      setConcluindo(false);
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const resto = s % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(resto).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  const progressoTimer = useMemo(() => {
    if (!exercicioAtual) return 0;

    const total =
      fase === "execucao"
        ? TEMPO_PADRAO_EXERCICIO
        : exercicioAtual.descansoSegundos ?? TEMPO_PADRAO_DESCANSO;

    if (!total) return 0;

    return ((total - segundosRestantes) / total) * 100;
  }, [fase, exercicioAtual, segundosRestantes]);

  // ESTADOS ESPECIAIS
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-40 rounded bg-slate-800" />
            <div className="h-40 rounded-3xl bg-slate-900" />
            <div className="h-24 rounded-2xl bg-slate-900" />
          </div>
        </main>
      </div>
    );
  }

  if (!treino || !exercicioAtual || !totalExercicios) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-6">
          <button
            onClick={() => router.push(`/treinos/${id}`)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para detalhes do treino
          </button>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
            <p className="text-sm">
              Não foi possível carregar os exercícios deste treino.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // TELA DE TREINO CONCLUÍDO
  if (terminou) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-6 rounded-3xl border border-emerald-600/40 bg-gradient-to-b from-emerald-500/10 via-slate-900 to-slate-950 p-6 md:p-8 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-9 h-9 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">
              Treino concluído! 🎉
            </h1>
            <p className="text-sm text-slate-300">
              Você completou todos os exercícios do{" "}
              <span className="font-semibold">{treino.titulo}</span>. Excelente
              trabalho! Quer registrar esse treino no seu progresso?
            </p>

            <div className="grid gap-3 pt-2">
              <Button
                onClick={concluirTreino}
                disabled={concluindo}
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
              >
                {concluindo ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Registrar treino como concluído
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/treinos")}
                className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100 w-full"
              >
                Voltar para lista de treinos
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // TELA NORMAL (EM ANDAMENTO)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* topo */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => router.push(`/treinos/${id}`)}
            className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-400 hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Detalhes do treino
          </button>

          <span className="text-[11px] uppercase tracking-wide text-slate-400">
            Modo passo-a-passo
          </span>
        </div>

        {/* Card principal */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 space-y-5">
          {/* Título + progresso geral */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs text-emerald-400 uppercase tracking-wide">
                  Em andamento
                </p>
                <h1 className="text-lg md:text-xl font-semibold">
                  {treino.titulo}
                </h1>
              </div>

              <div className="hidden md:flex flex-col items-end text-xs text-slate-300">
                <span>
                  Exercício {indiceAtual + 1} de {totalExercicios}
                </span>
                <span className="text-[11px] text-slate-400">
                  {fase === "execucao" ? "Execução" : "Descanso"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>
                  Progresso do treino ({indiceAtual}/{totalExercicios})
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${progressoTreino}%` }}
                />
              </div>
            </div>
          </div>

          {/* EXERCÍCIO ATUAL */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs text-slate-400">
                  Exercício {indiceAtual + 1} de {totalExercicios}
                </p>
                <h2 className="text-base md:text-lg font-semibold">
                  {exercicioAtual.nome}
                </h2>
              </div>

              <div className="flex flex-col items-end text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-700">
                  <Dumbbell className="w-3 h-3 text-emerald-400" />
                  {treino.categoria || "Corpo inteiro"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] md:text-xs text-slate-300">
              {exercicioAtual.series && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <span className="font-semibold">Séries:</span>{" "}
                  {exercicioAtual.series}
                </span>
              )}

              {exercicioAtual.repeticoes && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-800">
                  <span className="font-semibold">Repetições:</span>{" "}
                  {exercicioAtual.repeticoes}
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-800">
                <Clock className="w-3 h-3 text-emerald-400" />
                {fase === "execucao" ? "Tempo de execução" : "Tempo de descanso"}
              </span>
            </div>

            {/* TIMER */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  {formatTime(segundosRestantes)}
                </span>
                <span className="text-[11px] text-slate-400">
                  {fase === "execucao" ? "Mantenha a técnica" : "Recupere o fôlego"}
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    fase === "execucao" ? "bg-emerald-500" : "bg-sky-400"
                  }`}
                  style={{ width: `${progressoTimer}%` }}
                />
              </div>
            </div>

            {/* CONTROLES */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={irParaAnterior}
                  className="border-slate-700 bg-slate-900 hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => setRodando((r) => !r)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                >
                  {rodando ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar
                    </>
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={resetarFase}
                  className="border-slate-700 bg-slate-900 hover:bg-slate-800"
                >
                  <Clock className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={irParaProximo}
                  className="border-slate-700 bg-slate-900 hover:bg-slate-800"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>
                  Intensidade:{" "}
                  <span className="font-semibold">
                    {treino.nivel || "Personalizada"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* INFO RÁPIDA */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-2 text-xs md:text-sm text-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <InfoBadge />
            <p className="font-medium">Dicas rápidas</p>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>Mantenha a coluna neutra e respiração constante.</li>
            <li>Se sentir dor forte, pare o exercício e adapte.</li>
            <li>
              Entre os blocos, beba água e evite ficar totalmente parado: caminhe
              devagar pelo ambiente.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function InfoBadge() {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-slate-900 border border-slate-700 w-5 h-5 text-[11px] text-slate-300">
      i
    </span>
  );
}
