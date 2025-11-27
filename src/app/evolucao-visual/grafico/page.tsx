// src/app/evolucao-visual/grafico/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type SilhuetaRow = {
  id: string;
  user_id: string;
  peso: number;
  cintura: number;
  gordura: number;
  silhueta_svg: string | null;
  criado_em: string;
};

export default function EvolucaoVisualGraficoPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [dados, setDados] = useState<SilhuetaRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do Supabase
  useEffect(() => {
    async function carregar() {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("evolucao_silhuetas")
        .select("*")
        .eq("user_id", session.user.id)
        .order("criado_em", { ascending: true });

      if (!error && data) {
        setDados(data as SilhuetaRow[]);
      }

      setLoading(false);
    }

    carregar();
  }, [session, supabase]);

  const chartData = useMemo(
    () =>
      dados.map((item) => {
        const date = new Date(item.criado_em);
        const label = date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });

        // “largura” da silhueta só para visual (aqui uso gordura)
        const shapeIndex = item.gordura;

        return {
          id: item.id,
          date,
          label,
          peso: item.peso,
          cintura: item.cintura,
          gordura: item.gordura,
          shapeIndex,
        };
      }),
    [dados]
  );

  // Resumo de evolução (primeiro x último registro)
  const resumo = useMemo(() => {
    if (chartData.length < 2) return null;

    const first = chartData[0];
    const last = chartData[chartData.length - 1];

    const diffPeso = last.peso - first.peso;
    const diffCintura = last.cintura - first.cintura;
    const diffGordura = last.gordura - first.gordura;

    const dias =
      (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24);
    const semanas = Math.max(1, Math.round(dias / 7));

    function formatDiff(valor: number, unidade: string) {
      if (valor === 0) return `sem alteração em ${unidade}`;
      const sinal = valor > 0 ? "+" : "";
      return `${sinal}${valor.toFixed(1)} ${unidade}`;
    }

    return {
      semanas,
      pesoText: formatDiff(diffPeso, "kg"),
      cinturaText: formatDiff(diffCintura, "cm"),
      gorduraText: formatDiff(diffGordura, "% gordura"),
      pesoUp: diffPeso > 0,
      cinturaUp: diffCintura > 0,
      gorduraUp: diffGordura > 0,
    };
  }, [chartData]);

  if (!session?.user && !loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Você precisa estar logada para ver a evolução visual.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Voltar */}
        <button
          onClick={() => router.push("/evolucao-visual")}
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para evolução visual
        </button>

        {/* Título */}
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <Activity className="w-3 h-3" />
            Linha do tempo do corpo
          </div>

          <h1 className="text-3xl font-bold">Gráfico de evolução</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            Visualize, em forma de gráfico suave, como seu peso, cintura e
            percentual de gordura mudaram ao longo do tempo.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Carregando evolução...
          </div>
        )}

        {!loading && chartData.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            Nenhuma silhueta salva ainda.
            <br />
            Gere sua primeira silhueta na página{" "}
            <button
              className="underline text-emerald-400"
              onClick={() => router.push("/evolucao-visual")}
            >
              Evolução Visual
            </button>
            .
          </div>
        )}

        {/* Conteúdo quando há dados */}
        {!loading && chartData.length > 0 && (
          <>
            {/* Resumo de evolução */}
            {resumo && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Janela de acompanhamento
                  </p>
                  <p className="text-lg font-semibold">
                    {resumo.semanas} semana
                    {resumo.semanas > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Peso / Cintura
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    {resumo.pesoUp ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{resumo.pesoText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {resumo.cinturaUp ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{resumo.cinturaText}</span>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Percentual de gordura
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    {resumo.gorduraUp ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{resumo.gorduraText}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Gráfico principal */}
            <div className="mt-4 bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 md:p-6">
              <p className="text-sm font-semibold mb-4 flex items-center gap-2">
                Evolução ao longo do tempo
                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  (linha suave)
                </span>
              </p>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148,163,184,0.2)"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 11 }}
                    />
                    <YAxis
                      tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderRadius: 12,
                        border: "1px solid rgba(148,163,184,0.4)",
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#e5e7eb" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="peso"
                      name="Peso (kg)"
                      stroke="#22c55e"
                      strokeWidth={2.4}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cintura"
                      name="Cintura (cm)"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="gordura"
                      name="Gordura (%)"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
