"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Loader2,
  UtensilsCrossed,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";
import { getISOWeek } from "date-fns";

type RefeicaoRow = {
  id: string;
  user_id: string;
  semana: string;
  dia: number; // 0 = segunda ... 6 = domingo
  refeicao_tipo: string; // 'cafe', 'almoco', 'jantar', 'lanche'
  titulo: string;
  descricao: string | null;
  ingredientes: string[] | null;
  calorias: number | null;
  criado_em: string;
};

type DiaResumo = {
  dia: number;
  calorias: number;
  refeicoesPlanejadas: number; // 0 a 4
};

const DIAS_LABEL = [
  { dia: 0, nome: "Segunda" },
  { dia: 1, nome: "Terça" },
  { dia: 2, nome: "Quarta" },
  { dia: 3, nome: "Quinta" },
  { dia: 4, nome: "Sexta" },
  { dia: 5, nome: "Sábado" },
  { dia: 6, nome: "Domingo" },
];

function getSemanaAtualCodigo(date = new Date()) {
  const week = getISOWeek(date);
  const year = date.getFullYear();
  return `${year}-${week.toString().padStart(2, "0")}`;
}

export default function RefeicoesSemanaPage() {
  const { supabase, session, loading: loadingSession } = useSupabase();

  const [semanaAtual, setSemanaAtual] = useState<string>(() =>
    getSemanaAtualCodigo()
  );
  const [loading, setLoading] = useState(true);
  const [refeicoes, setRefeicoes] = useState<RefeicaoRow[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar dados da semana atual
  async function carregarSemana() {
    if (!session?.user?.id) return;

    setLoading(true);
    setErro(null);

    try {
      const { data, error } = await supabase
        .from("refeicoes_semanais")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("semana", semanaAtual)
        .order("dia", { ascending: true });

      if (error) {
        console.error(error);
        setErro("Erro ao carregar suas refeições da semana.");
        setRefeicoes([]);
        return;
      }

      setRefeicoes((data || []) as RefeicaoRow[]);
    } catch (e) {
      console.error(e);
      setErro("Erro inesperado ao carregar as refeições.");
      setRefeicoes([]);
    } finally {
      setLoading(false);
    }
  }

  // Recarrega quando logar ou quando mudar semana
  useEffect(() => {
    if (!loadingSession && session?.user) {
      carregarSemana();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingSession, session, semanaAtual]);

  const resumos: DiaResumo[] = useMemo(() => {
    const base: DiaResumo[] = DIAS_LABEL.map((d) => ({
      dia: d.dia,
      calorias: 0,
      refeicoesPlanejadas: 0,
    }));

    const mapaTiposPorDia: Record<number, Set<string>> = {};

    for (const r of refeicoes) {
      if (!mapaTiposPorDia[r.dia]) {
        mapaTiposPorDia[r.dia] = new Set<string>();
      }
      mapaTiposPorDia[r.dia].add(r.refeicao_tipo);

      const alvo = base.find((b) => b.dia === r.dia);
      if (alvo) {
        alvo.calorias += r.calorias ?? 0;
      }
    }

    for (const dia of Object.keys(mapaTiposPorDia)) {
      const dNum = Number(dia);
      const alvo = base.find((b) => b.dia === dNum);
      if (alvo) {
        alvo.refeicoesPlanejadas = mapaTiposPorDia[dNum].size;
      }
    }

    return base;
  }, [refeicoes]);

  const totalCaloriasSemana = resumos.reduce(
    (acc, d) => acc + d.calorias,
    0
  );

  if (!session?.user && !loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200">
        Você precisa estar logada para planejar suas refeições 😊
      </div>
    );
  }

  if (loadingSession || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-500">
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

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Cabeçalho */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-semibold">
              <UtensilsCrossed className="w-3 h-3" />
              Planejador de refeições
            </div>

            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              Sua semana de refeições
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Visualize e organize suas refeições da semana para diminuir
              decisões cansativas no dia a dia. Em breve a IA vai te sugerir
              cardápios automáticos com base nas suas metas.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CalendarDays className="w-4 h-4" />
              Semana atual (AAAA-WW)
            </label>
            <input
              type="text"
              value={semanaAtual}
              onChange={(e) => setSemanaAtual(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/60"
            />
            <p className="text-[11px] text-gray-500 dark:text-gray-500">
              Use o formato <code>AAAA-WW</code>, por exemplo:{" "}
              {getSemanaAtualCodigo()}.
            </p>
          </div>
        </section>

        {/* Alertas */}
        {erro && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {erro}
          </div>
        )}

        {/* Resumo semanal */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/70 p-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Resumo da semana
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {refeicoes.length > 0 ? (
                <>
                  Você já planejou{" "}
                  <span className="font-semibold">
                    {refeicoes.length} refeição
                    {refeicoes.length !== 1 && "s"}
                  </span>{" "}
                  nesta semana.
                </>
              ) : (
                <>Nenhuma refeição planejada ainda. Que tal começar hoje? 🍽️</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Calorias totais estimadas:{" "}
                <span className="font-semibold text-amber-300">
                  {totalCaloriasSemana} kcal
                </span>
              </span>
            </div>

            <Link href={`/refeicoes/${semanaAtual}/0`}>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-4 py-2">
                Planejar semana agora
              </Button>
            </Link>
          </div>
        </section>

        {/* Grid de dias */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Refeições por dia</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIAS_LABEL.map((diaInfo) => {
              const resumo =
                resumos.find((d) => d.dia === diaInfo.dia) ??
                ({
                  dia: diaInfo.dia,
                  calorias: 0,
                  refeicoesPlanejadas: 0,
                } as DiaResumo);

              const pct = (resumo.refeicoesPlanejadas / 4) * 100;

              const href = `/refeicoes/${semanaAtual}/${diaInfo.dia}`;

              return (
                <Link key={diaInfo.dia} href={href}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 p-4 cursor-pointer shadow-sm hover:shadow-lg flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Dia {diaInfo.dia + 1}
                        </p>
                        <h3 className="text-sm font-semibold">
                          {diaInfo.nome}
                        </h3>
                      </div>

                      <div className="text-right text-xs text-gray-500">
                        <p>
                          {resumo.refeicoesPlanejadas}/4 refeições
                        </p>
                        <p className="text-[11px] text-amber-300">
                          {resumo.calorias} kcal
                        </p>
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>

                    <p className="text-[11px] text-gray-500">
                      {resumo.refeicoesPlanejadas === 0
                        ? "Nenhuma refeição planejada ainda."
                        : resumo.refeicoesPlanejadas < 4
                        ? "Planejamento em andamento."
                        : "Dia totalmente planejado! 🎉"}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
