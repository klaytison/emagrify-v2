"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import { Loader2, History } from "lucide-react";

export default function HistoricoSilhuetasPage() {
  const { supabase, session } = useSupabase();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("evolucao_silhuetas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* TÍTULO */}
        <div className="flex items-center gap-3 mb-8">
          <History className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-bold">Histórico de Silhuetas</h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-10">
          Aqui você pode acompanhar todas as silhuetas geradas pela IA ao longo do tempo.
        </p>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        )}

        {/* LISTA */}
        {!loading && items.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-20">
            Nenhuma silhueta registrada ainda.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, index) => {
            const date = new Date(item.created_at).toLocaleDateString("pt-BR");

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-lg"
              >
                {/* SILHUETA */}
                <div
                  className="w-full flex justify-center mb-4"
                  dangerouslySetInnerHTML={{ __html: item.silhueta_svg }}
                />

                {/* INFO */}
                <div className="text-sm text-gray-300 mt-3 space-y-1 text-center">
                  <p><strong>Peso:</strong> {item.peso} kg</p>
                  <p><strong>Cintura:</strong> {item.cintura} cm</p>
                  <p><strong>Gordura:</strong> {item.gordura}%</p>
                  <p className="text-gray-500 text-xs mt-2">{date}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
