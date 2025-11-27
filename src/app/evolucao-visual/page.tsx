"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Ruler, Weight, Percent, History } from "lucide-react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useRouter } from "next/navigation";

export default function EvolucaoVisualPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [gordura, setGordura] = useState("");

  const [silhueta, setSilhueta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function gerarSilhueta() {
    if (!peso || !cintura || !gordura) return;

    setLoading(true);

    // ----- NÍVEL 2 — SVG ORGÂNICO -----
    const cinturaNum = Number(cintura);
    const gorduraNum = Number(gordura);

    const cinturaScale = Math.max(0.6, Math.min(1.4, cinturaNum / 70));
    const quadrilScale = Math.max(0.7, Math.min(1.6, gorduraNum / 22));
    const troncoAltura = 110;
    const troncoLargura = 45 * cinturaScale;

    const svg = `
      <svg width="180" height="320" viewBox="0 0 180 320" fill="none" xmlns="http://www.w3.org/2000/svg">

        <!-- Cabeça -->
        <circle cx="90" cy="45" r="28" stroke="white" stroke-width="4"/>

        <!-- Tronco orgânico -->
        <path d="
          M ${90 - troncoLargura} 90
          Q 90 110, ${90 - troncoLargura * 0.8} 120
          Q 90 ${130 + troncoAltura * 0.4}, ${90 - troncoLargura * quadrilScale} ${90 + troncoAltura}
          L ${90 + troncoLargura * quadrilScale} ${90 + troncoAltura}
          Q 90 ${130 + troncoAltura * 0.4}, ${90 + troncoLargura * 0.8} 120
          Q 90 110, ${90 + troncoLargura} 90
          Z
        " stroke="white" stroke-width="4" fill="none"/>

        <!-- Braços -->
        <path d="M ${90 - troncoLargura} 110 L 40 150" stroke="white" stroke-width="4" stroke-linecap="round"/>
        <path d="M ${90 + troncoLargura} 110 L 140 150" stroke="white" stroke-width="4" stroke-linecap="round"/>

        <!-- Pernas -->
        <path d="M 80  ${90 + troncoAltura} L 70 300" stroke="white" stroke-width="4" stroke-linecap="round"/>
        <path d="M 100 ${90 + troncoAltura} L 110 300" stroke="white" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;

    setSilhueta(svg);

    // ----- SALVAR NO SUPABASE -----
    if (session?.user) {
      await supabase.from("evolucao_silhuetas").insert({
        user_id: session.user.id,
        peso: Number(peso),
        cintura: Number(cintura),
        gordura: Number(gordura),
        silhueta_svg: svg,
      });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Evolução Visual do Corpo</h1>

        <p className="text-gray-600 dark:text-gray-400 mb-10">
          Acompanhe sua transformação através de uma silhueta minimalista gerada automaticamente
          pela IA. Sem fotos, sem exposição — apenas evolução.
        </p>

        {/* FORM */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">

          {/* Peso */}
          <div className="bg-gray-100 dark:bg-gray-900/60 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <label className="flex items-center gap-2 font-semibold mb-2">
              <Weight className="w-4 h-4 text-emerald-400" />
              Peso (kg)
            </label>
            <input
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Cintura */}
          <div className="bg-gray-100 dark:bg-gray-900/60 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <label className="flex items-center gap-2 font-semibold mb-2">
              <Ruler className="w-4 h-4 text-blue-400" />
              Cintura (cm)
            </label>
            <input
              type="number"
              value={cintura}
              onChange={(e) => setCintura(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Gordura (%) */}
          <div className="bg-gray-100 dark:bg-gray-900/60 p-5 rounded-xl border border-gray-200 dark:border-gray-800">
            <label className="flex items-center gap-2 font-semibold mb-2">
              <Percent className="w-4 h-4 text-pink-400" />
              Gordura (%)
            </label>
            <input
              type="number"
              value={gordura}
              onChange={(e) => setGordura(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-pink-400"
            />
          </div>

        </div>

        {/* BUTTON — GERAR */}
        <Button
          onClick={gerarSilhueta}
          className="w-full py-3 text-lg bg-emerald-500 hover:bg-emerald-600"
        >
          {loading ? "Gerando..." : "Gerar Silhueta"}
        </Button>

        {/* BUTTON — HISTÓRICO */}
        <Button
          onClick={() => router.push("/evolucao-visual/historico")}
          variant="outline"
          className="w-full py-3 text-lg mt-3 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
        >
          <History className="w-4 h-4 mr-2" />
          Ver Histórico de Silhuetas
        </Button>

        {/* SILHUETA GERADA */}
        {silhueta && (
          <motion.div
            key={silhueta}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-12 mx-auto flex justify-center bg-gray-900/40 p-10 rounded-2xl border border-gray-700"
            dangerouslySetInnerHTML={{ __html: silhueta }}
          />
        )}

      </main>
    </div>
  );
}
