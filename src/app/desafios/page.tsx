"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Sparkles,
  Swords,
  Target,
  Calendar,
  Trophy,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star,
  Dumbbell,
} from "lucide-react";

// Tipos de dados
type MissaoTipo = "treino" | "extra" | "bonus";

interface Missao {
  id: string;
  tipo: MissaoTipo;
  titulo: string;
  descricao: string;
  recompensaXp: number;
  concluida: boolean;
  obrigatoria: boolean;
  ligadoATreinoId?: string | null;
}

interface DesafioSemanalIA {
  id: string;
  tema: string;
  subtitulo: string;
  semanaTexto: string;
  focoPrincipal: string;
  focoSecundario: string;
  caloriasAlvo: number;
  treinosAlvo: number;
  missoes: Missao[];
  xpTotal: number;
  xpAtual: number;
  nivelBatalha: "Bronze" | "Prata" | "Ouro" | "Lendário";
}

// 💡 Mock de desafio gerado 100% pela IA (por enquanto fixo)
// Depois você pode trocar para um fetch em /api/desafios/semana
const desafioMockIA: DesafioSemanalIA = {
  id: "semana-1",
  tema: "Semana do Bumbum & Abdômen",
  subtitulo:
    "Desafio temático com foco em glúteos e core, em formato de batalha semanal.",
  semanaTexto: "Semana 12 · 2025",
  focoPrincipal: "Glúteos e abdômen",
  focoSecundario: "Resistência e queima de gordura",
  caloriasAlvo: 1200,
  treinosAlvo: 4,
  xpTotal: 400,
  xpAtual: 180,
  nivelBatalha: "Prata",
  missoes: [
    {
      id: "m1",
      tipo: "treino",
      titulo: "Treino IA — Lower Body Fire",
      descricao:
        "Treino guiado com foco em glúteos e posterior de coxa. Inclui agachamentos, avanços e elevações pélvicas.",
      recompensaXp: 100,
      concluida: true,
      obrigatoria: true,
      ligadoATreinoId: "treino-lower-1",
    },
    {
      id: "m2",
      tipo: "treino",
      titulo: "Treino IA — Core Definido",
      descricao:
        "Sequência de prancha, crunches e elevações de perna para ativar profundamente o abdômen.",
      recompensaXp: 100,
      concluida: false,
      obrigatoria: true,
      ligadoATreinoId: "treino-core-1",
    },
    {
      id: "m3",
      tipo: "extra",
      titulo: "Missão Cardio — Queima Rápida",
      descricao: "20 a 30 minutos de caminhada acelerada ou bicicleta leve.",
      recompensaXp: 60,
      concluida: false,
      obrigatoria: false,
    },
    {
      id: "m4",
      tipo: "extra",
      titulo: "Missão Alongamento — Recuperação Inteligente",
      descricao: "Sessão de alongamentos focados em lombar, quadril e posterior.",
      recompensaXp: 40,
      concluida: true,
      obrigatoria: false,
    },
    {
      id: "m5",
      tipo: "bonus",
      titulo: "Batalha Relâmpago — 5 min de prancha acumulada",
      descricao:
        "Some o tempo de prancha do dia e tente chegar a 5 minutos no total.",
      recompensaXp: 100,
      concluida: false,
      obrigatoria: false,
    },
  ],
};

export default function DesafiosSemanaisPage() {
  const [desafio, setDesafio] = useState<DesafioSemanalIA | null>(null);
  const [loading, setLoading] = useState(true);

  // Simula carregamento de IA
  useEffect(() => {
    // Aqui futuramente você troca por um fetch para a sua função de IA:
    // fetch("/api/desafios/semana").then(...)
    setTimeout(() => {
      setDesafio(desafioMockIA);
      setLoading(false);
    }, 300);
  }, []);

  if (loading || !desafio) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-40 bg-slate-800 rounded-full" />
            <div className="h-40 bg-slate-900 rounded-3xl" />
            <div className="h-32 bg-slate-900 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  const progressoTreinosObrigatorios =
    desafio.missoes.filter((m) => m.obrigatoria).filter((m) => m.concluida)
      .length / desafio.missoes.filter((m) => m.obrigatoria).length;

  const progressoMissoes =
    desafio.missoes.filter((m) => m.concluida).length / desafio.missoes.length;

  const xpPercent = Math.min((desafio.xpAtual / desafio.xpTotal) * 100, 100);

  function badgeNivel(nivel: DesafioSemanalIA["nivelBatalha"]) {
    if (nivel === "Bronze")
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    if (nivel === "Prata")
      return "bg-slate-200/10 text-slate-100 border-slate-300/30";
    if (nivel === "Ouro")
      return "bg-yellow-400/20 text-yellow-200 border-yellow-400/40";
    return "bg-purple-500/20 text-purple-200 border-purple-400/40";
  }

  function getTipoLabel(tipo: MissaoTipo) {
    if (tipo === "treino") return "Treino principal";
    if (tipo === "extra") return "Missão extra";
    return "Missão bônus";
  }

  function getTipoCor(tipo: MissaoTipo) {
    if (tipo === "treino") return "text-emerald-300 bg-emerald-500/10";
    if (tipo === "extra") return "text-sky-300 bg-sky-500/10";
    return "text-violet-300 bg-violet-500/10";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* topo */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Desafios semanais com IA
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              {desafio.tema}
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-400">
              {desafio.subtitulo}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {desafio.semanaTexto}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Gerado automaticamente pela IA do Emagrify
            </span>
          </div>
        </section>

        {/* card principal: tema + batalha */}
        <section className="grid md:grid-cols-[1.2fr,0.8fr] gap-5">
          {/* Tema da semana */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                  Tema da semana (IA)
                </p>
                <p className="text-sm text-slate-200">
                  Foco principal:{" "}
                  <span className="font-semibold">
                    {desafio.focoPrincipal}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Foco secundário: {desafio.focoSecundario}
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end text-right text-xs">
                <span className="text-slate-300">Treinos alvo</span>
                <span className="text-xl font-semibold">
                  {desafio.treinosAlvo}
                </span>
                <span className="text-[11px] text-slate-500">
                  sugeridos pela IA
                </span>
              </div>
            </div>

            {/* metas principais */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-center gap-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Meta de calorias
                  </p>
                  <p className="font-semibold text-slate-50">
                    {desafio.caloriasAlvo} kcal
                  </p>
                  <p className="text-[11px] text-slate-500">
                    estimadas pela IA
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-center gap-3">
                <Target className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Treinos principais
                  </p>
                  <p className="font-semibold text-slate-50">
                    {desafio.missoes.filter((m) => m.obrigatoria).length} treinos
                  </p>
                  <p className="text-[11px] text-slate-500">
                    temáticos da semana
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-center gap-3">
                <Clock className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Progresso geral
                  </p>
                  <p className="font-semibold text-slate-50">
                    {Math.round(progressoMissoes * 100)}%
                  </p>
                  <p className="text-[11px] text-slate-500">
                    missões concluídas
                  </p>
                </div>
              </div>
            </div>

            {/* barra de progresso treinos obrigatórios */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Progresso dos treinos principais</span>
                <span>
                  {Math.round(progressoTreinosObrigatorios * 100)}% completos
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-400 transition-all"
                  style={{
                    width: `${Math.min(
                      progressoTreinosObrigatorios * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Batalha da semana */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
                  <Swords className="w-4 h-4 text-violet-300" />
                  Batalha da semana
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  Nível atual:{" "}
                  <span className="font-bold">{desafio.nivelBatalha}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Suba de nível completando treinos e missões IA.
                </p>
              </div>

              <div
                className={`px-3 py-2 rounded-2xl border text-[11px] font-semibold flex flex-col items-end gap-1 ${badgeNivel(
                  desafio.nivelBatalha
                )}`}
              >
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Liga
                </span>
                <span>{desafio.nivelBatalha}</span>
              </div>
            </div>

            {/* XP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>XP da semana</span>
                <span>
                  {desafio.xpAtual} / {desafio.xpTotal} XP
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 via-emerald-400 to-amber-300 transition-all"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {desafio.missoes.filter((m) => m.concluida).length} /{" "}
                {desafio.missoes.length} missões
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-700">
                <Star className="w-3 h-3 text-yellow-300" />
                IA ativa — desafios ajustados ao seu perfil
              </span>
            </div>

            <Button className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-xs md:text-sm flex items-center justify-center gap-2">
              Ver plano da semana
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* missões divididas em seções: treinos, extras, bônus */}
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm md:text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Missões da semana
            </h2>
            <p className="text-[11px] md:text-xs text-slate-400">
              Todas as missões foram montadas pela IA com base no seu objetivo,
              nível e foco da semana.
            </p>
          </div>

          <div className="space-y-4">
            {/* TREINOS PRINCIPAIS */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                <Dumbbell className="w-3 h-3 text-emerald-400" />
                Treinos principais da IA (obrigatórios)
              </p>

              <div className="space-y-2">
                {desafio.missoes
                  .filter((m) => m.tipo === "treino")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTipoCor(
                              m.tipo
                            )}`}
                          >
                            {getTipoLabel(m.tipo)}
                          </span>
                          {m.concluida && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              concluído
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold">{m.titulo}</p>
                        <p className="text-[11px] md:text-xs text-slate-400">
                          {m.descricao}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-emerald-300">
                          +{m.recompensaXp} XP
                        </span>
                        <Button
                          size="sm"
                          variant={m.concluida ? "outline" : "default"}
                          className={
                            m.concluida
                              ? "border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs"
                              : "bg-emerald-600 hover:bg-emerald-700 text-xs"
                          }
                        >
                          {m.concluida ? "Ver detalhes" : "Iniciar treino IA"}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* MISSÕES EXTRAS */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                <Flame className="w-3 h-3 text-sky-300" />
                Missões extras da semana
              </p>

              <div className="space-y-2">
                {desafio.missoes
                  .filter((m) => m.tipo === "extra")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTipoCor(
                              m.tipo
                            )}`}
                          >
                            {getTipoLabel(m.tipo)}
                          </span>
                          {m.concluida && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              concluída
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold">{m.titulo}</p>
                        <p className="text-[11px] md:text-xs text-slate-400">
                          {m.descricao}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-sky-300">
                          +{m.recompensaXp} XP
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs"
                        >
                          Registrar como feita
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* MISSÕES BÔNUS */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                <Swords className="w-3 h-3 text-violet-300" />
                Missões bônus da batalha
              </p>

              <div className="space-y-2">
                {desafio.missoes
                  .filter((m) => m.tipo === "bonus")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-violet-700/40 bg-violet-950/40 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTipoCor(
                              m.tipo
                            )}`}
                          >
                            {getTipoLabel(m.tipo)}
                          </span>
                          {m.concluida && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              bônus concluído
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold">{m.titulo}</p>
                        <p className="text-[11px] md:text-xs text-violet-100/80">
                          {m.descricao}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-violet-200">
                          +{m.recompensaXp} XP bônus
                        </span>
                        <Button
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-700 text-xs"
                        >
                          Marcar como concluída
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* rodapé informativo IA */}
        <section className="pb-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] md:text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
              <p>
                Este desafio foi construído 100% pela IA do Emagrify, combinando
                seus dados de objetivo, nível, preferências e limites com
                estratégias reais de treino. A cada semana, um novo tema e uma
                nova batalha são gerados automaticamente.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900 hover:bg-slate-800 mt-1 md:mt-0"
            >
              Ver próximos temas sugeridos pela IA
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
