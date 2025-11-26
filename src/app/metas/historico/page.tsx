"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Meta {
  id: string;
  titulo: string;
  categoria: string;
  status: string;
  criado_em: string;
}

export default function HistoricoMetasPage() {
  const { supabase, session } = useSupabase();
  const [metasConcluidas, setMetasConcluidas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) return;

    async function carregarHistorico() {
      const { data, error } = await supabase
        .from("metas_principais")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "concluida") // somente metas finalizadas
        .order("criado_em", { ascending: false });

      if (!error) setMetasConcluidas(data as Meta[]);
      setLoading(false);
    }

    carregarHistorico();
  }, [session]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
    >
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Voltar */}
        <button
          onClick={() => router.push("/metas")}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Título */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Histórico de metas</h1>
          <p className="text-slate-400 text-sm">
            Aqui você encontra todas as metas já concluídas.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-slate-400" />
          </div>
        ) : metasConcluidas.length === 0 ? (
          <p className="text-slate-400 text-center py-10">
            Você ainda não concluiu nenhuma meta.
          </p>
        ) : (
          <div className="space-y-4">
            {metasConcluidas.map((meta) => (
              <motion.div
                key={meta.id}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-800 rounded-xl p-4"
              >
                <h2 className="font-semibold">{meta.titulo}</h2>
                <p className="text-sm text-slate-400">{meta.categoria}</p>
                <p className="text-xs mt-2 text-emerald-400 font-medium">
                  Concluída em: {new Date(meta.criado_em).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}

      </main>
    </motion.div>
  );
}
