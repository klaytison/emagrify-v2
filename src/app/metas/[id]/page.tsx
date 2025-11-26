"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Loader2,
  Target,
  PlusCircle,
  CheckCircle2,
  ChevronLeft,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type MetaPrincipal = {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  dificuldade: string;
  inicio: string | null;
  fim: string | null;
  criado_em: string;
};

type MicroMeta = {
  id: string;
  meta_id: string;
  titulo: string;
  descricao: string | null;
  semana: number;
  concluido: boolean;
};

export default function MetaDetalhes() {
  const { supabase, session } = useSupabase();
  const params = useParams();
  const router = useRouter();

  const metaId = params.id as string;

  const [meta, setMeta] = useState<MetaPrincipal | null>(null);
  const [microMetas, setMicroMetas] = useState<MicroMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function carregar() {
    if (!session?.user) return;

    setLoading(true);

    // META PRINCIPAL
    const { data: m } = await supabase
      .from("metas_principais")
      .select("*")
      .eq("id", metaId)
      .maybeSingle();

    setMeta(m as MetaPrincipal);

    // MICRO-METAS
    const { data: micro } = await supabase
      .from("micro_metas")
      .select("*")
      .eq("meta_id", metaId)
      .order("semana", { ascending: true });

    setMicroMetas((micro as MicroMeta[]) || []);

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  async function toggleConcluido(m: MicroMeta) {
    if (!session?.user) return;

    try {
      setUpdatingId(m.id);

      const { error } = await supabase
        .from("micro_metas")
        .update({ concluido: !m.concluido })
        .eq("id", m.id)
        .eq("meta_id", metaId);

      if (!error) {
        setMicroMetas((prev) =>
          prev.map((x) =>
            x.id === m.id ? { ...x, concluido: !m.concluido } : x
          )
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Você precisa estar logada.
      </div>
    );
  }

  if (loading || !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const total = microMetas.length;
  const concluidas = microMetas.filter((m) => m.concluido).length;
  const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <button
          onClick={() => router.push("/metas")}
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para metas
        </button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
            <Target className="w-3 h-3" />
            Meta principal
          </span>

          <h1 className="text-3xl font-bold flex items-center gap-2">
            {meta.titulo}
            {progresso === 100 && (
              <Trophy className="w-6 h-6 text-yellow-400" />
            )}
          </h1>

          {meta.descricao && (
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              {meta.descricao}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs">
            {meta.categoria && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Categoria: {meta.categoria}
              </span>
            )}

            {meta.dificuldade && (
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 capitalize">
                Dificuldade: {meta.dificuldade}
              </span>
            )}
          </div>
        </motion.div>

        {/* Progresso */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Progresso geral</h2>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Micro-metas concluídas
              </span>
              <span className="font-semibold text-emerald-400">
                {concluidas}/{total} ({progresso}%)
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progresso}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </section>

        {/* Micro-metas */}
        <section className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <h2 className="text-lg font-bold">Micro-metas semanais</h2>

            <Link
              href={`/metas/${metaId}/nova-micrometa`}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-sm text-white rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              Criar micro-meta
            </Link>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {microMetas.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`flex items-start justify-between gap-3 p-4 rounded-xl border transition ${
                    m.concluido
                      ? "bg-emerald-500/10 border-emerald-500/40"
                      : "bg-gray-100/60 dark:bg-gray-900 border-gray-300/60 dark:border-gray-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase text-gray-500">
                        Semana {m.semana}
                      </span>

                      {m.concluido && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Concluída
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        m.concluido ? "line-through text-emerald-200" : ""
                      }`}
                    >
                      {m.titulo}
                    </p>

                    {m.descricao && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {m.descricao}
                      </p>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant={m.concluido ? "default" : "outline"}
                    onClick={() => toggleConcluido(m)}
                    disabled={updatingId === m.id}
                    className={
                      m.concluido
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-gray-800"
                    }
                  >
                    {updatingId === m.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          m.concluido ? "fill-white" : "fill-transparent"
                        }`}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
