"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Target, PlusCircle, ListTodo, History } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Meta = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  dificuldade?: string;
  criado_em: string;
};

export default function MetasPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [metas, setMetas] = useState<any[]>([]);

  async function carregar() {
    if (!session?.user) return;

    setLoading(true);

    // Carrega metas principais
    const { data: metasData } = await supabase
      .from("metas_principais")
      .select("*")
      .eq("user_id", session.user.id)
      .order("criado_em", { ascending: false });

    if (!metasData) {
      setMetas([]);
      setLoading(false);
      return;
    }

    // Carregar micro-metas e calcular progresso real
    const metasComProgresso = await Promise.all(
      metasData.map(async (meta) => {
        const { data: micros } = await supabase
          .from("micro_metas")
          .select("concluido")
          .eq("meta_id", meta.id);

        const total = micros?.length ?? 0;
        const concluidas = micros?.filter((m) => m.concluido).length ?? 0;

        const progressoReal =
          total > 0 ? Math.round((concluidas / total) * 100) : 0;

        return {
          ...meta,
          progressoReal,
        };
      })
    );

    // Ordenar metas por progresso — ranking!
    metasComProgresso.sort((a, b) => b.progressoReal - a.progressoReal);

    setMetas(metasComProgresso);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Você precisa estar logada.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  // Ranking visual
  const medalha = (index: number) => {
    if (index === 0) return "🥇 Ouro";
    if (index === 1) return "🥈 Prata";
    return "🥉 Bronze";
  };

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* TÍTULO */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
            <Target className="w-3 h-3" />
            Metas inteligentes
          </span>

          <h1 className="text-3xl font-bold">Suas metas principais</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            Defina metas claras, acompanhe sua jornada e receba micro-metas semanais para manter a motivação.
          </p>
        </motion.div>

        {/* ATALHOS */}
        <motion.div
          className="flex flex-wrap gap-3 pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/metas/nova">
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm shadow">
              <PlusCircle className="w-4 h-4" />
              Criar meta
            </button>
          </Link>

          <button
            disabled={metas.length === 0}
            onClick={() =>
              metas.length > 0 &&
              router.push(`/metas/${metas[0].id}/micrometas`)
            }
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm shadow transition
              ${
                metas.length === 0
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              }
            `}
          >
            <ListTodo className="w-4 h-4" />
            Micro-metas
          </button>

          <Link href="/metas/historico">
            <button className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-900 transition">
              <History className="w-4 h-4" />
              Histórico
            </button>
          </Link>
        </motion.div>

        {/* LISTA DE METAS */}
        <div className="space-y-5 pt-4">
          {metas.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-800 rounded-2xl p-6 text-center"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Você ainda não criou nenhuma meta principal.
              </p>

              <Link href="/metas/nova">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl">
                  Criar minha primeira meta
                </button>
              </Link>
            </motion.div>
          )}

          {metas.map((meta, index) => {
            const pct = meta.progressoReal ?? 0;

            return (
              <Link key={meta.id} href={`/metas/${meta.id}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-gray-900/60 cursor-pointer transition shadow-sm"
                >

                  {/* CABEÇALHO */}
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        {meta.titulo}

                        {/* Selo de Concluída */}
                        {meta.status === "concluida" && (
                          <span className="text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/30 text-xs font-bold">
                            ✔ Concluída
                          </span>
                        )}
                      </h2>

                      <p className="text-sm text-gray-500">{meta.categoria}</p>

                      {/* Medalha / Ranking */}
                      <span className="text-xs bg-gray-800/40 text-gray-200 px-2 py-1 rounded-full border border-gray-700/40 mt-1 inline-block">
                        {medalha(index)}
                      </span>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      className={`
                        h-full
                        ${
                          pct < 35
                            ? "bg-red-400"
                            : pct < 70
                            ? "bg-yellow-400"
                            : "bg-emerald-500"
                        }
                      `}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {pct}% concluído
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </main>
    </motion.div>
  );
}
