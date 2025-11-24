"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Loader2, Target, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

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

  async function carregar() {
    if (!session?.user) return;

    setLoading(true);

    // Carregar meta principal
    const { data: m } = await supabase
      .from("metas_principais")
      .select("*")
      .eq("id", metaId)
      .maybeSingle();

    setMeta(m as MetaPrincipal);

    // Carregar micro-metas
    const { data: micro } = await supabase
      .from("micro_metas")
      .select("*")
      .eq("meta_id", metaId)
      .order("semana", { ascending: true });

    setMicroMetas(micro || []);

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

  if (loading || !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const total = microMetas.length;
  const concluidas = microMetas.filter((m) => m.concluido).length;
  const progresso = total > 0 ? (concluidas / total) * 100 : 0;

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
            <Target className="w-3 h-3" />
            Meta principal
          </span>

          <h1 className="text-3xl font-bold">{meta.titulo}</h1>

          {meta.descricao && (
            <p className="text-gray-600 dark:text-gray-400 max-w-xl">
              {meta.descricao}
            </p>
          )}
        </motion.div>

        {/* Barra de progresso */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Progresso geral</h2>

          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>

          <p className="text-sm text-gray-500">
            {concluidas} de {total} micro-metas concluídas
          </p>
        </section>

        {/* Micro metas */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Micro-metas semanais</h2>

            <Link
              href={`/metas/${metaId}/nova-micrometa`}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-sm text-white rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              Criar micro-meta
            </Link>
          </div>

          {microMetas.length === 0 && (
            <p className="text-gray-500 text-sm">
              Nenhuma micro-meta criada ainda.
            </p>
          )}

          <div className="space-y-4">
            {microMetas.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border ${
                  m.concluido
                    ? "bg-emerald-500/20 border-emerald-500/40"
                    : "bg-gray-100 dark:bg-gray-900 border-gray-700"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">Semana {m.semana}</h3>
                    <p className="text-sm text-gray-500">{m.titulo}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
