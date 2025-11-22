"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Loader2, TrendingDown, TrendingUp, Footprints, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

type MonitoramentoRow = {
  id: string;
  created_at: string;
  // possíveis nomes de colunas (vamos tentar vários para evitar erro)
  peso_kg?: number | null;
  weight_kg?: number | null;
  calorias?: number | null;
  calories_in?: number | null;
  passos?: number | null;
  steps?: number | null;
  humor?: string | null;
};

type PeriodType = "7" | "30";

export default function MonitoramentoHistoricoPage() {
  const { supabase, session, loading } = useSupabase();
  const [rows, setRows] = useState<MonitoramentoRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>("7");

  // Buscar últimos 30 dias do monitoramento
  useEffect(() => {
    if (!supabase) return;
    if (loading) return;

    async function loadData() {
      try {
        setLoadingData(true);
        setError(null);

        // 30 dias atrás
        const now = new Date();
        const past30 = new Date();
        past30.setDate(now.getDate() - 30);

        const { data, error } = await supabase
          .from("monitoramento_diario")
          .select("*")
          .gte("created_at", past30.toISOString())
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Erro ao carregar monitoramento:", error);
          setError("Erro ao carregar histórico.");
          return;
        }

        setRows((data as any[]) as MonitoramentoRow[]);
      } catch (err) {
        console.error(err);
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [supabase, loading]);

  // Normalizar dados (peso / calorias / passos / data)
  const normalized = useMemo(() => {
    return rows.map((row) => {
      const date =
        (row as any).data ||
        (row as any).day ||
        row.created_at;

      const d = new Date(date);

      const weight = row.peso_kg ?? row.weight_kg ?? null;
      const calories = row.calorias ?? row.calories_in ?? null;
      const steps = row.passos ?? row.steps ?? null;

      return {
        ...row,
        date: d,
        weight,
        calories,
        steps,
      };
    });
  }, [rows]);

  // Filtrar por período (7 ou 30 dias)
  const filtered = useMemo(() => {
    if (!normalized.length) return [];

    if (period === "30") return normalized;

    // "7 dias": pegamos os últimos 7 registros
    if (normalized.length <= 7) return normalized;
    return normalized.slice(normalized.length - 7);
  }, [normalized, period]);

  // Cálculos de resumo
  const summary = useMemo(() => {
    if (!filtered.length) return null;

    const first = filtered[0];
    const last = filtered[filtered.length - 1];

    const weights = filtered
      .map((r) => r.weight)
      .filter((w): w is number => typeof w === "number");
    const caloriesList = filtered
      .map((r) => r.calories)
      .filter((c): c is number => typeof c === "number");
    const stepsList = filtered
      .map((r) => r.steps)
      .filter((s): s is number => typeof s === "number");

    const weightDiff =
      first.weight != null && last.weight != null
        ? Number((last.weight - first.weight).toFixed(1))
        : null;

    const avgCalories =
      caloriesList.length > 0
        ? Math.round(
            caloriesList.reduce((a, b) => a + b, 0) / caloriesList.length
          )
        : null;

    const avgSteps =
      stepsList.length > 0
        ? Math.round(
            stepsList.reduce((a, b) => a + b, 0) / stepsList.length
          )
        : null;

    return {
      firstWeight: first.weight ?? null,
      lastWeight: last.weight ?? null,
      weightDiff,
      avgCalories,
      avgSteps,
    };
  }, [filtered]);

  // Para “gráficos” de barra
  const maxWeight = useMemo(() => {
    const list = filtered
      .map((r) => r.weight)
      .filter((w): w is number => typeof w === "number");
    return list.length ? Math.max(...list) : null;
  }, [filtered]);

  const maxCalories = useMemo(() => {
    const list = filtered
      .map((r) => r.calories)
      .filter((c): c is number => typeof c === "number");
    return list.length ? Math.max(...list) : null;
  }, [filtered]);

  const maxSteps = useMemo(() => {
    const list = filtered
      .map((r) => r.steps)
      .filter((s): s is number => typeof s === "number");
    return list.length ? Math.max(...list) : null;
  }, [filtered]);

  function formatDateLabel(d: Date) {
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Título */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Histórico & Evolução
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Veja sua evolução de peso, calorias, passos e humor ao longo
              dos dias. Ideal para entender tendências e ajustar o plano.
            </p>
          </div>

          {/* Filtro de período */}
          <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1">
            <button
              onClick={() => setPeriod("7")}
              className={`px-3 py-1 text-xs md:text-sm rounded-full transition ${
                period === "7"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Últimos 7 dias
            </button>
            <button
              onClick={() => setPeriod("30")}
              className={`px-3 py-1 text-xs md:text-sm rounded-full transition ${
                period === "30"
                  ? "bg-emerald-500 text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Últimos 30 dias
            </button>
          </div>
        </section>

        {/* Mensagens de estado */}
        {loading && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verificando sessão…
          </div>
        )}

        {!loading && !session && (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-900 px-4 py-3 text-sm">
            Você precisa estar logada para ver seu histórico.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Loading de dados */}
        {loadingData && (
          <div className="flex items-center justify-center py-10 text-gray-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Carregando histórico…
          </div>
        )}

        {!loadingData && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 px-4 py-6 text-sm text-gray-600 dark:text-gray-300">
            Você ainda não tem registros de monitoramento.  
            Use a aba <b>Monitoramento</b> para registrar seu primeiro dia.
          </div>
        )}

        {/* Conteúdo principal */}
        {!loadingData && !error && filtered.length > 0 && (
          <>
            {/* Cards de resumo */}
            {summary && (
              <section className="grid md:grid-cols-3 gap-4">
                {/* Peso */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      Peso
                    </span>
                    {summary.weightDiff != null && (
                      summary.weightDiff < 0 ? (
                        <TrendingDown className="w-4 h-4 text-emerald-400" />
                      ) : summary.weightDiff > 0 ? (
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      ) : null
                    )}
                  </div>
                  <div className="text-lg font-semibold">
                    {summary.lastWeight != null
                      ? `${summary.lastWeight.toFixed(1)} kg`
                      : "—"}
                  </div>
                  <p className="text-xs text-gray-500">
                    Início:{" "}
                    {summary.firstWeight != null
                      ? `${summary.firstWeight.toFixed(1)} kg`
                      : "—"}
                    {" · "}
                    {summary.weightDiff != null && summary.weightDiff !== 0 ? (
                      <span
                        className={
                          summary.weightDiff < 0
                            ? "text-emerald-500"
                            : "text-red-400"
                        }
                      >
                        {summary.weightDiff < 0 ? "" : "+"}
                        {summary.weightDiff.toFixed(1)} kg no período
                      </span>
                    ) : (
                      "Peso estável no período"
                    )}
                  </p>
                </div>

                {/* Calorias */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      Calorias médias
                    </span>
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-lg font-semibold">
                    {summary.avgCalories != null
                      ? `${summary.avgCalories} kcal/dia`
                      : "—"}
                  </div>
                  <p className="text-xs text-gray-500">
                    Use como referência para ajustar sua dieta com o tempo.
                  </p>
                </div>

                {/* Passos */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-gray-500">
                      Passos médios
                    </span>
                    <Footprints className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-lg font-semibold">
                    {summary.avgSteps != null
                      ? `${summary.avgSteps.toLocaleString("pt-BR")} passos/dia`
                      : "—"}
                  </div>
                  <p className="text-xs text-gray-500">
                    Pequenos aumentos diários já fazem grande diferença.
                  </p>
                </div>
              </section>
            )}

            {/* "Gráficos" de barras simples */}
            <section className="grid md:grid-cols-3 gap-6 pt-4">
              {/* Peso */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <h2 className="text-sm font-semibold mb-3">
                  Peso x Dia
                </h2>
                <div className="h-40 flex items-end gap-1">
                  {filtered.map((r, idx) => {
                    const h =
                      r.weight != null && maxWeight
                        ? Math.max(8, (r.weight / maxWeight) * 100)
                        : 0;

                    return (
                      <div
                        key={r.id || idx}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-full rounded-t-full bg-emerald-400/80"
                          style={{ height: `${h}%` }}
                          title={
                            r.weight != null
                              ? `${r.weight.toFixed(1)} kg`
                              : "Sem registro"
                          }
                        />
                        <span className="text-[10px] text-gray-500">
                          {formatDateLabel(r.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calorias */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <h2 className="text-sm font-semibold mb-3">
                  Calorias x Dia
                </h2>
                <div className="h-40 flex items-end gap-1">
                  {filtered.map((r, idx) => {
                    const h =
                      r.calories != null && maxCalories
                        ? Math.max(8, (r.calories / maxCalories) * 100)
                        : 0;

                    return (
                      <div
                        key={r.id || idx}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-full rounded-t-full bg-amber-400/80"
                          style={{ height: `${h}%` }}
                          title={
                            r.calories != null
                              ? `${r.calories} kcal`
                              : "Sem registro"
                          }
                        />
                        <span className="text-[10px] text-gray-500">
                          {formatDateLabel(r.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Passos */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <h2 className="text-sm font-semibold mb-3">
                  Passos x Dia
                </h2>
                <div className="h-40 flex items-end gap-1">
                  {filtered.map((r, idx) => {
                    const h =
                      r.steps != null && maxSteps
                        ? Math.max(8, (r.steps / maxSteps) * 100)
                        : 0;

                    return (
                      <div
                        key={r.id || idx}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div
                          className="w-full rounded-t-full bg-sky-400/80"
                          style={{ height: `${h}%` }}
                          title={
                            r.steps != null
                              ? `${r.steps.toLocaleString("pt-BR")} passos`
                              : "Sem registro"
                          }
                        />
                        <span className="text-[10px] text-gray-500">
                          {formatDateLabel(r.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Lista detalhada por dia */}
            <section className="space-y-3 pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Detalhes por dia
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/monitoramento")}
                  className="text-xs"
                >
                  Voltar para registrar hoje
                </Button>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {filtered
                  .slice()
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((r) => (
                    <div
                      key={r.id}
                      className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {r.date.toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </span>
                        {r.humor && (
                          <span className="text-xs text-gray-500">
                            Humor: {r.humor}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        {r.weight != null && (
                          <span>
                            <b>Peso:</b> {r.weight.toFixed(1)} kg
                          </span>
                        )}
                        {r.calories != null && (
                          <span>
                            <b>Calorias:</b> {r.calories} kcal
                          </span>
                        )}
                        {r.steps != null && (
                          <span>
                            <b>Passos:</b>{" "}
                            {r.steps.toLocaleString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
