"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Target, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

type Meta = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  progresso: number;
  status: string;
};

export default function MetasPage() {
  const { supabase, session } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [metas, setMetas] = useState<Meta[]>([]);

  async function carregar() {
    if (!session?.user) return;

    const { data } = await supabase
      .from("metas_principais")
      .select("*")
      .eq("user_id", session.user.id)
      .order("criado_em", { ascending: false });

    setMetas((data as Meta[]) || []);
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

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Título */}
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
            Defina objetivos realistas e receba micro-metas semanais automaticamente.
          </p>
        </motion.div>

        {/* Botão criar meta */}
        <div>
          <Link href="/metas/nova">
            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl">
              <PlusCircle className="w-4 h-4" />
              Criar nova meta
            </button>
          </Link>
        </div>

        {/* Lista de metas */}
        <div className="space-y-5 pt-4">
          {metas.length === 0 && (
            <p className="text-gray-500 text-sm">
              Você ainda não criou nenhuma meta.
            </p>
          )}

          {metas.map((meta) => {
            const pct = meta.progresso ?? 0;

            return (
              <Link key={meta.id} href={`/metas/${meta.id}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-gray-900/60 cursor-pointer transition"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{meta.titulo}</h2>
                      <p className="text-sm text-gray-500">{meta.categoria}</p>
                      <p className="text-xs mt-2 text-gray-400 capitalize">
                        Status: {meta.status}
                      </p>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
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

