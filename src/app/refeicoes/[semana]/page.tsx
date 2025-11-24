"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const diasSemana = [
  { key: "segunda", label: "Segunda-feira", short: "Seg", color: "from-emerald-500/80 via-emerald-400/80 to-teal-400/80" },
  { key: "terca", label: "Terça-feira", short: "Ter", color: "from-sky-500/80 via-sky-400/80 to-cyan-400/80" },
  { key: "quarta", label: "Quarta-feira", short: "Qua", color: "from-violet-500/80 via-violet-400/80 to-fuchsia-400/80" },
  { key: "quinta", label: "Quinta-feira", short: "Qui", color: "from-amber-500/80 via-orange-400/80 to-yellow-400/80" },
  { key: "sexta", label: "Sexta-feira", short: "Sex", color: "from-pink-500/80 via-rose-400/80 to-red-400/80" },
  { key: "sabado", label: "Sábado", short: "Sáb", color: "from-lime-500/80 via-green-400/80 to-emerald-400/80" },
  { key: "domingo", label: "Domingo", short: "Dom", color: "from-indigo-500/80 via-blue-400/80 to-sky-400/80" },
];

export default function RefeicoesSemanaPage() {
  const params = useParams();
  const router = useRouter();
  const { session, loading: loadingSession } = useSupabase();

  const semanaParam = params?.semana as string | undefined;

  const [semanaLabel, setSemanaLabel] = useState<string>("Semana atual");

  useEffect(() => {
    if (!semanaParam) return;

    // Ex: "2025-47" → "Semana 47 de 2025"
    const [ano, semanaNum] = semanaParam.split("-");
    if (ano && semanaNum) {
      setSemanaLabel(`Semana ${semanaNum} de ${ano}`);
    } else {
      setSemanaLabel(`Semana ${semanaParam}`);
    }
  }, [semanaParam]);

  const deslogada = !loadingSession && !session?.user;

  // Estado de carregamento da sessão
  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-500">
        Carregando sessão...
      </div>
    );
  }

  // Usuária não logada
  if (deslogada) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-16 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 text-amber-500 px-3 py-1 text-xs font-semibold">
            <UtensilsCrossed className="w-3 h-3" />
            Refeições da semana
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Faça login para planejar suas refeições
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Entre na sua conta para montar o cardápio da semana, visualizar
            cada dia e, no futuro, deixar a IA do Emagrify ajustar tudo
            automaticamente para o seu objetivo.
          </p>
          <Button
            className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => router.push("/login")}
          >
            Ir para login
          </Button>
        </main>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Cabeçalho */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-semibold"
              initial={{ scale: 0.8, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UtensilsCrossed className="w-3 h-3" />
              Refeições da semana
            </motion.div>

            <motion.h1
              className="text-2xl md:text-3xl font-bold"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              Organize seu cardápio da semana
            </motion.h1>

            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 max-w-xl"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Clique em cada dia para montar refeições como café da manhã,
              almoço, jantar, lanches, pré-treino e pós-treino. Se você não
              treina, pode simplesmente ignorar o pré/pós-treino sem problemas.
            </motion.p>

            <motion.div
              className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <CalendarDays className="w-3 h-3" />
              {semanaLabel}
            </motion.div>
          </div>

          {/* Navegação de semana (apenas visual por enquanto) */}
          <motion.div
            className="flex items-center gap-3 self-start md:self-auto bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
              onClick={() => {
                alert(
                  "No futuro, aqui você vai poder navegar entre semanas passadas e futuras. 😉"
                );
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-xs text-center">
              <p className="font-medium text-gray-800 dark:text-gray-100">
                {semanaLabel}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Navegação de semanas em breve
              </p>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-200/70 dark:hover:bg-gray-800 transition"
              onClick={() => {
                alert(
                  "Em breve você também poderá ver planos futuros (por exemplo, a próxima semana)."
                );
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </section>

        {/* Grid de dias da semana - estilo app fitness colorido */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {diasSemana.map((dia, index) => (
            <motion.div
              key={dia.key}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 shadow-sm hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.04 * index }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              {/* Faixa colorida topo */}
              <div
                className={`h-1.5 w-full bg-gradient-to-r ${dia.color}`}
              />

              <div className="p-4 flex flex-col gap-3">
                {/* Cabeçalho do card */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Dia {index + 1}
                    </p>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">
                      {dia.label}
                    </h2>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {/* Badge de status (por enquanto sempre "em branco") */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                      ●{" "}
                      <span className="font-medium">
                        Plano em branco
                      </span>
                    </span>
                    <span className="text-[10px] text-gray-400">
                      0 refeições salvas
                    </span>
                  </div>
                </div>

                {/* Mini barra de progresso (no futuro será real) */}
                <div className="space-y-1 pt-1">
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[0%] bg-gradient-to-r from-emerald-400 to-emerald-500" />
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Em breve: progresso baseado na quantidade de refeições
                    definidas para este dia.
                  </p>
                </div>

                {/* Ações */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 max-w-[70%]">
                    Planeje café da manhã, almoço, jantar, lanches e, se quiser,
                    pré/pós-treino.
                  </span>

                  <Link href={`/refeicoes/${semanaParam}/${dia.key}`}>
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1"
                    >
                      Abrir dia
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Card de ação: duplicar semana passada (placeholder) */}
        <section className="pt-4">
          <motion.div
            className="rounded-2xl border border-dashed border-emerald-500/50 bg-emerald-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-500">
                Duplicar semana passada (em breve)
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md">
                Em vez de montar tudo do zero, você vai poder copiar as
                refeições da semana anterior e só ajustar o que mudou. A IA
                também poderá sugerir pequenas melhorias para acelerar seus
                resultados.
              </p>
            </div>

            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white text-xs"
              type="button"
              onClick={() =>
                alert(
                  "Função de duplicar a semana ainda será implementada quando todas as funcionalidades estiverem prontas. 💚"
                )
              }
            >
              Em breve
            </Button>
          </motion.div>
        </section>
      </main>
    </motion.div>
  );
}
