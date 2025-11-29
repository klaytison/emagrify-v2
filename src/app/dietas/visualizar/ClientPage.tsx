"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ClientVisualizarDieta() {
  const { supabase, session } = useSupabase();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [dieta, setDieta] = useState<any>(null);

  async function carregar() {
    if (!session?.user || !id) return;

    const { data } = await supabase
      .from("dietas_geradas")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    setDieta(data);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        
        <button
          onClick={() => router.push("/dietas/historico")}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao histórico
        </button>

        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-bold">Plano Alimentar Completo</h1>
        </div>

        {dieta && (
          <p className="text-gray-400 text-sm mb-10">
            Gerado em{" "}
            {new Date(dieta.created_at || dieta.criado_em).toLocaleString(
              "pt-BR"
            )}
          </p>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        )}

        {!loading && !dieta && (
          <p className="text-center text-gray-400 py-20">
            Dieta não encontrada.
          </p>
        )}

        {dieta && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl prose prose-invert max-w-none whitespace-pre-line text-sm"
          >
            {dieta.plano}
          </motion.div>
        )}
      </main>
    </div>
  );
}
