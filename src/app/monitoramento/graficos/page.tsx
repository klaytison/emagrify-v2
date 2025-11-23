"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";

import {
  Activity,
  TrendingDown,
  Ruler,
  Flame,
  Smile,
  Loader2,
} from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

type MonitoramentoRow = {
  id: string;
  user_id: string | null;
  dia: string;
  peso_kg: number | null;
  cintura_cm: number | null;
  quadril_cm: number | null;
  peito_cm: number | null;
  gordura_pct: number | null;
  passos: number | null;
  calorias_in: number | null;
  calorias_out: number | null;
  humor: string | null;
  notas: string | null;
  criado_em: string;
};

export default function MonitoramentoGraficosPage() {
  const { supabase, session, loading: loadingSession } = useSupabase();

  const [dados, setDados] = useState<MonitoramentoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar últimos 30 dias
  useEffect(() => {
    async function carregar() {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErro(null);

        const hoje = new Date();
        const inicio = new Date();
        inicio.setDate(hoje.getDate() - 29); // últimos 30 dias
        const inicioIso = inicio.toISOString().slice(0, 10);

        const { data, error } = await supabase
          .from("monitoramento_diario")
          .select("*")
          .gte("dia", inicioIso)
          .order("dia", { ascending: true });

        if (error) {
          console.error(error);
          setErro("Erro ao carregar histórico de progresso.");
          return;
        }

        setDados((data || []) as MonitoramentoRow[]);
      } finally {
        setLoading(false);
      }
    }

    if (!loadingSession) {
      carregar();
    }
  }, [loadingSession, session, supabase]);

  const chartData = dados.map((row) => {
    const data = new Date(row.dia);
    const labelDia = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

    return {
      dia: row.dia,
      labelDia,
      peso: row.peso_kg,
      gordura: row.gordura_pct,
      cintura: row.cintura_cm,
      quadril: row.quadril_cm,
      peito: row.peito_cm,
      passos: row.passos,
      caloriasIn: row.calorias_in,
      caloriasOut: row.calorias_out,
      humor: row.humor,
    };
  });

  const semDados = !loading && chartData.length === 0;
  const deslogada = !loadingSession && !session?.user;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Cabeçalho */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-semibold">
            <Activity className="w-3 h-3" />
            Painel de gráficos
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">
            Visualize sua evolução em gráficos
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Este painel mostra a sua evolução dos últimos dias em forma de
            gráficos. Use junto com o monitoramento diário para entender
            tendências de peso, medidas, atividade e como você está se sentindo.
          </p>

          {deslogada && (
            <div className="mt-2 rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
              Você não está logada. Entre na sua conta para ver seus gráficos
              de progresso.
            </div>
          )}

          {erro && (
            <div className="mt-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {erro}
            </div>
          )}
        </section>

        {/* Estado de carregamento */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-gray-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Carregando gráficos…
          </div>
        )}

        {/* Sem dados */}
        {semDados && !loading && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-6 text-sm text-gray-600 dark:text-gray-300">
            Nenhum dado encontrado para os últimos 30 dias. Registre seu
            progresso na aba{" "}
            <span className="font-semibold">Monitoramento diário</span> para
            começar a ver gráficos aqui.
          </div>
        )}

        {/* Accordion de gráficos */}
        {!loading && !semDados && (
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-3"
            defaultValue="peso"
          >
            {/* Peso & Gordura */}
            <AccordionItem value="peso">
              <AccordionTrigger className="text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>Peso & percentual de gordura</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="h-64 md:h-80 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="labelDia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="peso"
                        name="Peso (kg)"
                        stroke="#22c55e"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="gordura"
                        name="% Gordura"
                        stroke="#fb923c"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Medidas */}
            <AccordionItem value="medidas">
              <AccordionTrigger className="text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-sky-400" />
                  <span>Medidas corporais (cintura, quadril, peito)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="h-64 md:h-80 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="labelDia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="cintura"
                        name="Cintura (cm)"
                        stroke="#38bdf8"
                        fill="#38bdf8"
                        fillOpacity={0.25}
                      />
                      <Area
                        type="monotone"
                        dataKey="quadril"
                        name="Quadril (cm)"
                        stroke="#a855f7"
                        fill="#a855f7"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="peito"
                        name="Peito (cm)"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Atividade & calorias */}
            <AccordionItem value="atividade">
              <AccordionTrigger className="text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Passos, calorias ingeridas e gastas</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-4">
                {/* Passos */}
                <div className="h-56 md:h-72 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-3">
                  <h3 className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    Passos por dia
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="labelDia" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="passos" name="Passos" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Calorias in/out */}
                <div className="h-56 md:h-72 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-3">
                  <h3 className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Flame className="w-3 h-3 text-amber-400" />
                    Calorias ingeridas x gastas
                  </h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="labelDia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="caloriasIn"
                        name="Calorias in"
                        stroke="#f97316"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="caloriasOut"
                        name="Calorias out"
                        stroke="#22c55e"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Humor & notas (lista em vez de gráfico) */}
            <AccordionItem value="humor">
              <AccordionTrigger className="text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  <span>Humor & anotações do dia</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-4 space-y-3 max-h-80 overflow-y-auto">
                  {chartData
                    .filter((d) => d.humor || dados.find((r) => r.dia === d.dia)?.notas)
                    .map((d) => {
                      const notas =
                        dados.find((r) => r.dia === d.dia)?.notas ?? null;

                      return (
                        <div
                          key={d.dia}
                          className="border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs md:text-sm bg-white/60 dark:bg-gray-900/60"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-100">
                              {d.labelDia}
                            </span>
                            {d.humor && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                <Smile className="w-3 h-3" />
                                {d.humor}
                              </span>
                            )}
                          </div>
                          {notas && (
                            <p className="mt-1 text-gray-600 dark:text-gray-300">
                              {notas}
                            </p>
                          )}
                        </div>
                      );
                    })}

                  {chartData.every(
                    (d) => !d.humor && !dados.find((r) => r.dia === d.dia)?.notas
                  ) && (
                    <p className="text-xs md:text-sm text-gray-500">
                      Você ainda não registrou humor ou anotações nos últimos
                      dias. Use esses campos no monitoramento diário para
                      entender como emoções e rotina afetam seu progresso.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </main>
    </div>
  );
}
