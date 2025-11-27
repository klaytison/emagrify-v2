"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import { Clock, Loader2, ArrowRightLeft, BarChart4 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoricoSilhuetasPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [lista, setLista] = useState<any[]>([]);

  async function carregar() {
    if (!session?.user) return;

    const { data } = await supabase
      .from("evolucao_silhuetas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setLista(data || []);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-bold">Histórico de Silhuetas</h1>
        </div>

        <p className="text-gray-400 mb-6">
          Todas as silhuetas geradas pela IA ficam guardadas aqui.
        </p>

        {/* 🔥 BOTÃO: VER GRÁFICO DE EVOLUÇÃO */}
        <button
          onClick={() => router.push("/evolucao-visual/grafico")}
          className="
            flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600
            text-black font-semibold px-4 py-2 rounded-xl shadow mb-10
            transition w-full md:w-auto
          "
        >
          <BarChart4 className="w-4 h-4" />
          Ver Gráfico de Evolução
        </button>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        )}

        {!loading && lista.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            Nenhuma silhueta salva ainda.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {lista.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/40 border border-gray-800 p-5 rounded-2xl"
            >
              <div className="flex justify-between mb-3">
                <p className="text-sm text-gray-400">
                  {new Date(item.created_at).toLocaleString("pt-BR")}
                </p>

                {/* BOTÃO COMPARAR */}
                <button
                  onClick={() =>
                    router.push(`/evolucao-visual/comparar?base=${item.id}`)
                  }
                  className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-black px-3 py-1.5 text-xs rounded-lg font-semibold"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  Comparar
                </button>
              </div>

              {/* MINI SILHUETA */}
              <div
                className="flex justify-center p-5 bg-gray-900 rounded-xl border border-gray-700"
                dangerouslySetInnerHTML={{ __html: item.silhueta_svg }}
              />

              <div className="mt-4 text-sm text-gray-300">
                <p>
                  <span className="font-semibold text-emerald-400">Peso:</span>{" "}
                  {item.peso}kg
                </p>
                <p>
                  <span className="font-semibold text-blue-400">Cintura:</span>{" "}
                  {item.cintura}cm
                </p>
                <p>
                  <span className="font-semibold text-pink-400">Gordura:</span>{" "}
                  {item.gordura}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
