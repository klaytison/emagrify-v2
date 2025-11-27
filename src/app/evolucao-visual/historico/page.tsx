"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";

export default function HistoricoEvolucao() {
  const { supabase, session } = useSupabase();
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    if (!session?.user) return;

    const { data } = await supabase
      .from("evolucao_silhuetas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("criado_em", { ascending: false });

    setLista(data || []);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Histórico da Evolução</h1>

        {loading && <p className="text-gray-400">Carregando...</p>}

        <div className="space-y-6">
          {lista.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-gray-900/40 border border-gray-800 flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-400">
                  Peso: {item.peso} kg • Cintura: {item.cintura} cm
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <CalendarClock className="w-4 h-4" />
                  {new Date(item.criado_em).toLocaleDateString("pt-BR")}
                </div>
              </div>

              {/* Mini preview */}
              <div
                className="w-16 h-32 opacity-80"
                dangerouslySetInnerHTML={{ __html: item.silhueta_svg }}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
