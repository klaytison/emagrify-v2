"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Dumbbell,
  Loader2,
  Pause,
  Play,
  SkipForward,
} from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

interface TreinoExercicio {
  nome: string;
  series: string | null;
  repeticoes: string | null;
  descansoSegundos: number | null;

  // campos extras que a IA pode começar a mandar:
  grupo_muscular?: string | null;
  equipamento?: string | null;
  explicacao_curta?: string | null;
  explicacao_detalhada?: string | null;
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

type Phase = "preparo" | "exercicio" | "descanso" | "finalizado";

const PREP_TIME = 10; // segundos antes de começar o 1º exercício
const DEFAULT_EX_TIME = 40; // tempo base para cada exercício, quando não tiver outro dado
const DEFAULT_REST = 45; // descanso padrão quando vier null

// Beep simples só para marcar fim de fase
function playBeep() {
  if (typeof window === "undefined") return;

  try {
    const AudioCtx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // ignora se não der
  }

  if (navigator.vibrate) {
    navigator.vibrate(150);
  }
}

export default function TreinoPassoAPassoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("preparo");
  const [timeLeft, setTimeLeft] = useState(PREP_TIME);
  const [totalTime, setTotalTime] = useState(PREP_TIME);
  const [isRunning, setIsRunning] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // carregar treino
  useEffect(() => {
    async function load() {
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

    if (id) load();
  }, [id]);

  const totalExercicios = treino?.exercicios?.length ?? 0;
  const currentEx = useMemo(() => {
    if (!treino || !treino.exercicios?.length) return null;
    return treino.exercicios[currentIndex] ?? null;
  }, [treino, currentIndex]);

  const proximoEx = useMemo(() => {
    if (!treino || !treino.exercicios?.length) return null;
    if (currentIndex + 1 >= treino.exercicios.length) return null;
    return treino.exercicios[currentIndex + 1];
  }, [treino, currentIndex]);

  // timer principal
  useEffect(() => {
    if (!isRunning) return;
    if (phase === "finalizado") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  // quando o tempo zera, avança fase
  useEffect(() => {
    if (timeLeft > 0) return;
    if (phase === "finalizado") return;
    if (!autoAdvance) return;

    playBeep();
    avancarFase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function resetTimer(newSeconds: number) {
    setTotalTime(newSeconds);
    setTimeLeft(newSeconds);
  }

  function iniciarExercicio(index: number) {
    setCurrentIndex(index);
    setPhase("exercicio");
    resetTimer(DEFAULT_EX_TIME);
    setIsRunning(true);
  }

  function avancarFase() {
    if (!treino || !treino.exercicios?.length) return;

    // 1) PREPARO -> PRIMEIRO EXERCÍCIO
    if (phase === "preparo") {
      iniciarExercicio(0);
      return;
    }

    const descansoSegundos =
      (currentEx?.descansoSegundos ?? DEFAULT_REST) || DEFAULT_REST;

    // 2) EXERCÍCIO -> DESCANSO (se tiver) OU PRÓXIMO EXERCÍCIO
    if (phase === "exercicio") {
      if (descansoSegundos > 0) {
        setPhase("descanso");
        resetTimer(descansoSegundos);
        return;
      }
      // sem descanso, já vai para próximo passo
      irParaProximoExercicio();
      return;
    }

    // 3) DESCANSO -> PRÓXIMO EXERCÍCIO OU FINALIZA
    if (phase === "descanso") {
      irParaProximoExercicio();
      return;
    }
  }

  function irParaProximoExercicio() {
    if (!treino || !treino.exercicios?.length) return;

    const ultimoIndex = treino.exercicios.length - 1;

    if (currentIndex < ultimoIndex) {
      const novoIndex = currentIndex + 1;
      setCurrentIndex(novoIndex);
      setPhase("exercicio");
      resetTimer(DEFAULT_EX_TIME);
      setIsRunning(true);
    } else {
      // acabou o treino
      setPhase("finalizado");
      setIsRunning(false);
      resetTimer(0);
    }
  }

  function pularDescansoOuIrProximo() {
    if (phase === "descanso") {
      irParaProximoExercicio();
    } else {
      avancarFase();
    }
  }

  function handleReiniciarTempo() {
    resetTimer(totalTime);
    setIsRunning(true);
  }

  function handleSair() {
    router.push(`/treinos/${id}`);
  }

  function formatSegundos(seg: number) {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    if (m <= 0) return `${s.toString().padStart(2, "0")}s`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // dados visuais do timer circular
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const progressoGeral =
    totalExercicios > 0
      ? (currentIndex + (phase === "descanso" ? 1 : 0)) / totalExercicios
      : 0;

  // STATES DE CARREGAMENTO / ERROS
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-10 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </main>
      </div>
    );
  }

  if (!treino || !treino.exercicios?.length) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-10">
          <button
            onClick={handleSair}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para treino
          </button>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center space-y-3">
            <p className="text-lg font-semibold">Não há exercícios neste treino.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* topo nav */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSair}
            className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <span className="text-[11px] md:text-xs text-slate-400">
            {currentIndex + 1} / {totalExercicios} exercícios
          </span>
        </div>

        {/* título + barra de progresso */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <div>
              <h1 className="text-lg md:text-xl font-semibold">
                Modo passo-a-passo
              </h1>
              <p className="text-xs text-slate-400 line-clamp-1">
                {treino.titulo}
              </p>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 transition-all"
              style={{ width: `${Math.min(progressoGeral * 100, 100)}%` }}
            />
          </div>
        </section>

        {/* conteúdo principal */}
        <section className="grid md:grid-cols-[1.2fr,0.9fr] gap-6 items-stretch">
          {/* TIMER + CONTROLES */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-6 flex flex-col items-center justify-between gap-6">
            <div className="text-center space-y-2">
              <p className="text-[11px] uppercase tracking-wide text-emerald-400">
                {phase === "preparo" && "Preparar"}
                {phase === "exercicio" && "Executando exercício"}
                {phase === "descanso" && "Descanso"}
                {phase === "finalizado" && "Treino finalizado"}
              </p>
              <p className="text-sm font-semibold">
                {phase === "finalizado"
                  ? "Parabéns! Você concluiu este treino 👏"
                  : currentEx?.nome}
              </p>
            </div>

            {/* timer circular */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  strokeWidth="12"
                  fill="transparent"
                  className="transition-all duration-300 ease-linear"
                  strokeLinecap="round"
                  style={{
                    stroke: "#34d399", // emerald-400
                    strokeDasharray: circumference,
                    strokeDashoffset,
                  }}
                />
              </svg>

              {/* círculo interno pulsante */}
              <div
                className={`absolute inset-10 rounded-full flex items-center justify-center ${
                  phase === "finalizado"
                    ? "bg-emerald-500/10"
                    : "bg-slate-900/80"
                } ${
                  timeLeft <= 3 && phase !== "finalizado"
                    ? "animate-pulse"
                    : ""
                }`}
              >
                <div className="text-center">
                  <p className="text-3xl font-semibold tabular-nums">
                    {formatSegundos(timeLeft)}
                  </p>
                  {phase !== "finalizado" && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      {phase === "exercicio"
                        ? "Mantenha a técnica"
                        : phase === "descanso"
                        ? "Respire e se prepare"
                        : "Prepare-se para começar"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* botões de controle */}
            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsRunning((v) => !v)}
                className="border-slate-700 bg-slate-900 hover:bg-slate-800"
                disabled={phase === "finalizado"}
              >
                {isRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleReiniciarTempo}
                className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs md:text-sm"
                disabled={phase === "finalizado" || totalTime === 0}
              >
                Reiniciar tempo
              </Button>

              <Button
                onClick={pularDescansoOuIrProximo}
                className="bg-emerald-600 hover:bg-emerald-700 text-xs md:text-sm flex items-center gap-1"
                disabled={phase === "finalizado"}
              >
                <SkipForward className="w-4 h-4" />
                {phase === "descanso" ? "Pular descanso" : "Próximo"}
              </Button>
            </div>

            <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                />
                Avançar automaticamente
              </label>

              {phase === "finalizado" && (
                <Button
                  size="sm"
                  onClick={handleSair}
                  className="bg-emerald-500 hover:bg-emerald-600 text-xs flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Voltar ao treino
                </Button>
              )}
            </div>
          </div>

          {/* detalhes do exercício atual + próximo */}
          <div className="space-y-4">
            {/* atual */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Exercício atual
              </p>

              <h2 className="text-sm md:text-base font-semibold">
                {currentEx?.nome}
              </h2>

              <div className="flex flex-wrap gap-2 text-[11px] md:text-xs text-slate-200">
                {currentEx?.series && (
                  <span className="px-2 py-1 rounded-full bg-slate-800/80">
                    Séries: {currentEx.series}
                  </span>
                )}
                {currentEx?.repeticoes && (
                  <span className="px-2 py-1 rounded-full bg-slate-800/80">
                    Repetições: {currentEx.repeticoes}
                  </span>
                )}
                {currentEx?.descansoSegundos != null && (
                  <span className="px-2 py-1 rounded-full bg-slate-800/80">
                    Descanso: {currentEx.descansoSegundos}s
                  </span>
                )}
                {currentEx?.grupo_muscular && (
                  <span className="px-2 py-1 rounded-full bg-slate-800/80">
                    Grupo: {currentEx.grupo_muscular}
                  </span>
                )}
                {currentEx?.equipamento && (
                  <span className="px-2 py-1 rounded-full bg-slate-800/80">
                    Equipamento: {currentEx.equipamento}
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {currentEx?.explicacao_detalhada ||
                  currentEx?.explicacao_curta ||
                  "Mantenha a postura alinhada, controle o movimento e foque na respiração. Use o tempo como referência para executar o máximo de repetições com boa técnica."}
              </p>
            </div>

            {/* próximo */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Próximo exercício
              </p>

              {proximoEx ? (
                <>
                  <p className="text-sm font-medium">{proximoEx.nome}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                    {proximoEx.series && (
                      <span className="px-2 py-1 rounded-full bg-slate-800/80">
                        Séries: {proximoEx.series}
                      </span>
                    )}
                    {proximoEx.repeticoes && (
                      <span className="px-2 py-1 rounded-full bg-slate-800/80">
                        Repetições: {proximoEx.repeticoes}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400">
                  Você está no último exercício deste treino.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
