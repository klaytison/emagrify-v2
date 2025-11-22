"use client";

import { useEffect, useState, useMemo } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Loader2, CalendarDays, ChevronLeft, ChevronRight, Dumbbell, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TreinoRow {
  id: string;
  titulo: string;
  duracao: number | null;
  calorias: number | null;
  categoria: string | null;
}

interface TreinoConcluidoRow {
  id: string;
  treino_id: string;
  created_at: string;
  treinos: TreinoRow | null;
}

type TreinosPorDia = Record<string, TreinoConcluidoRow[]>;

function getMondayOfWeek(baseDate: Date) {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0 = domingo, 1 = segunda...
  const diff = (day === 0 ? -6 : 1) - day; // segunda-feira
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

const dayShortLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export default function HistoricoTreinosPage() {
  const { supabase, session, loading: loadingSession } = useSupabase();

  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOfWeek(new Date()));
  const [treinosPorDia, setTreinosPorDia] = useState<TreinosPorDia>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dias da semana atual (segunda → domingo)
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const d = addDays(weekStart, index);
      return {
        date: d,
        isoDate: d.toISOString().slice(0, 10),
      };
    });
  }, [weekStart]);

  // Texto "Semana de 01/09 a 07/09"
  const weekRangeLabel = useMemo(() => {
    const startLabel = formatDateLabel(weekStart);
    const endLabel = formatDateLabel(addDays(weekStart, 6));
    return `Semana de ${startLabel} a ${endLabel}`;
  }, [weekStart]);

  async function loadHistorico() {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const startISO = weekStart.toISOString();
      const endExclusive = addDays(weekStart, 7).toISOString(); // < endExclusive

      const { data, error } = await supabase
        .from("treinos_concluidos")
        .select(
          `
          id,
          treino_id,
          created_at,
          treinos (
            id,
            titulo,
            duracao,
            calorias,
            categoria
          )
        `
        )
        .eq("user_id", session.user.id)
        .gte("created_at", startISO)
        .lt("created_at", endExclusive)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erro ao carregar histórico de treinos:", error);
        setError("Erro ao carregar histórico de treinos.");
        return;
      }

      const byDay: TreinosPorDia = {};

      (data || []).forEach((row) => {
        const dayKey = row.created_at.slice(0, 10);
        if (!byDay[dayKey]) byDay[dayKey] = [];
        byDay[dayKey].push(row as TreinoConcluidoRow);
      });

      setTreinosPorDia(byDay);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      loadHistorico();
    }
  }, [session, weekStart]); // recarrega ao mudar semana

  // Navegar semanas
  const handlePrevWeek = () => {
    setWeekStart((prev) => getMondayOfWeek(addDays(prev, -7)));
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => getMondayOfWeek(addDays(prev, 7)));
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50 text-yellow-900 px-4 py-3 text-sm dark:border-yellow-500/40 dark:bg-yellow-500/10 dark:text-yellow-100">
            Você precisa estar logada para ver o histórico de treinos.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Título / Cabeçalho */}
        <header className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Histórico de treinos
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Veja quais treinos você concluiu em cada dia da semana.
              </p>
            </div>
          </div>
        </header>

        {/* Mensagens de erro */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 px-4 py-3 text-sm dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
            {error}
          </div>
        )}

        {/* Controles da semana */}
        <section className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevWeek}
              className="border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextWeek}
              className="border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {weekRangeLabel}
          </div>
        </section>

        {/* Timeline semanal (bolinhas por dia) */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60 px-4 py-5">
          <div className="flex justify-between gap-2">
            {weekDays.map((day, index) => {
              const list = treinosPorDia[day.isoDate] || [];
              const hasTreinos = list.length > 0;

              return (
                <div
                  key={day.isoDate}
                  className="flex flex-col items-center gap-2 text-xs"
                >
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {dayShortLabels[index]}
                  </span>
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center border text-sm",
                      hasTreinos
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200",
                    ].join(" ")}
                  >
                    {day.date.getDate()}
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    {list.length > 0 ? `${list.length}x` : "-"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lista detalhada por dia (Opção B) */}
        <section className="space-y-5">
          {weekDays.map((day, index) => {
            const list = treinosPorDia[day.isoDate] || [];
            const hasTreinos = list.length > 0;

            return (
              <div
                key={day.isoDate}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3"
              >
                {/* Cabeçalho do dia */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {dayShortLabels[index]}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateLabel(day.date)}
                    </span>
                  </div>
                  {hasTreinos && (
                    <span className="text-xs text-emerald-500 font-medium">
                      {list.length} treino(s)
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                {!hasTreinos ? (
                  <p className="text-xs text-gray-400">
                    Nenhum treino concluído neste dia.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {list.map((item) => {
                      const treino = item.treinos;
                      const hora = new Date(item.created_at).toLocaleTimeString(
                        "pt-BR",
                        { hour: "2-digit", minute: "2-digit" }
                      );

                      return (
                        <li
                          key={item.id}
                          className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/80 px-3 py-2.5 flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Dumbbell className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-semibold">
                                {treino?.titulo ?? "Treino"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {hora}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                            {treino?.categoria && (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {treino.categoria}
                              </span>
                            )}
                            {treino?.duracao != null && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {treino.duracao} min
                              </span>
                            )}
                            {treino?.calorias != null && (
                              <span className="inline-flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                ~{treino.calorias} kcal
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </section>

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Atualizando histórico...
          </div>
        )}
      </main>
    </div>
  );
}
