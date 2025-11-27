"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import { ArrowsLeftRight } from "lucide-react";

export default function CompararSilhuetas() {
  const { supabase, session } = useSupabase();
  const [lista, setLista] = useState<any[]>([]);
  const [before, setBefore] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);

  async function carregar() {
    if (!session?.user) return;

    const { data } = await supabase
      .from("evolucao_silhuetas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("criado_em", { ascending: true });

    setLista(data || []);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Comparar Silhuetas</h1>

        <p className="text-gray-400 mb-8">
          Selecione duas silhuetas para comparar sua evolução.
        </p>

        {/* Seleção */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* ANTES */}
          <div>
            <label className="block mb-2 font-semibold">Antes</label>
            <select
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
              onChange={(e) => setBefore(e.target.value)}
            >
              <option value="">Selecione</option>
              {lista.map((item) => (
                <option key={item.id} value={item.silhueta_svg}>
                  {new Date(item.criado_em).toLocaleDateString("pt-BR")}
                </option>
              ))}
            </select>
          </div>

          {/* DEPOIS */}
          <div>
            <label className="block mb-2 font-semibold">Depois</label>
            <select
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
              onChange={(e) => setAfter(e.target.value)}
            >
              <option value="">Selecione</option>
              {lista.map((item) => (
                <option key={item.id} value={item.silhueta_svg}>
                  {new Date(item.criado_em).toLocaleDateString("pt-BR")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RESULTADO */}
        {before && after && (
          <div className="mt-10 flex flex-col items-center gap-6">
            <ArrowsLeftRight className="w-10 h-10 text-gray-500" />

            <div className="grid grid-cols-2 gap-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/40 p-5 rounded-xl border border-gray-800"
                dangerouslySetInnerHTML={{ __html: before }}
              />

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/40 p-5 rounded-xl border border-gray-800"
                dangerouslySetInnerHTML={{ __html: after }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
