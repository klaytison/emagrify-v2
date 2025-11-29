"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import { Clock, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoricoDietas() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState<any[]>([]);

  async function carregar() {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("dietas_geradas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("criado_em", { ascending: false });

    if (!error) setLista(data || []);

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Título */}
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-bold">Histórico de Dietas</h1>
        </div>

        <p className="text-gray-400 mb-10">
          Todos os planos alimentares gerados ficam guardados aqui.
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        )}

        {/* Sem dietas */}
        {!loading && lista.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            Nenhuma dieta criada ainda.
          </div>
        )}

        {/* Lista */}
        <div className="space-y-5">
          {lista.map((item) => {
            const preview = item.plano_texto
              ?.split("\n")
              .slice(0, 6)
              .join("\n");

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl"
              >
                {/* Data + botão */}
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-gray-400">
                    {new Date(item.criado_em).toLocaleString("pt-BR")}
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/dietas/visualizar?id=${item.id}`)
                    }
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-black px-3 py-1.5 text-xs rounded-lg font-semibold"
                  >
                    <FileText className="w-3 h-3" />
                    Ver Completa
                  </button>
                </div>

                {/* Prévia do plano */}
                <pre className="whitespace-pre-line text-gray-200 text-sm">
                  {preview}
                </pre>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
