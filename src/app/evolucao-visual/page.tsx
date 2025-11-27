"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Ruler, Weight, Percent } from "lucide-react";
import { useSupabase } from "@/providers/SupabaseProvider";

export default function EvolucaoVisualPage() {
  const { supabase, session } = useSupabase();

  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [gordura, setGordura] = useState("");

  const [silhueta, setSilhueta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function gerarSilhueta() {
    if (!peso || !cintura || !gordura) return;

    setLoading(true);

    // ---- LÓGICA TEMPORÁRIA (MOCK) ---- //
    const gorduraNum = Number(gordura);
    let level = "media";

    if (gorduraNum <= 18) level = "baixa";
    else if (gorduraNum >= 30) level = "alta";

    const silhuetaSVG = {
      baixa: `
        <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="40" r="25" stroke="white" stroke-width="4"/>
          <rect x="45" y="70" width="30" height="70" rx="15" stroke="white" stroke-width="4"/>
          <line x1="30" y1="90" x2="45" y2="110" stroke="white" stroke-width="4"/>
          <line x1="90" y1="90" x2="75" y2="110" stroke="white" stroke-width="4"/>
          <line x1="55" y1="140" x2="45" y2="200" stroke="white" stroke-width="4"/>
          <line x1="65" y1="140" x2="75" y2="200" stroke="white" stroke-width="4"/>
        </svg>
      `,
      media: `
        <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="40" r="25" stroke="white" stroke-width="4"/>
          <rect x="35" y="70" width="50" height="80" rx="25" stroke="white" stroke-width="4"/>
          <line x1="20" y1="95" x2="35" y2="120" stroke="white" stroke-width="4"/>
          <line x1="100" y1="95" x2="85" y2="120" stroke="white" stroke-width="4"/>
          <line x1="50" y1="150" x2="40" y2="210" stroke="white" stroke-width="4"/>
          <line x1="70" y1="150" x2="80" y2="210" stroke="white" stroke-width="4"/>
        </svg>
      `,
      alta: `
        <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="40" r="28" stroke="white" stroke-width="4"/>
          <rect x="25" y="70" width="70" height="95" rx="35" stroke="white" stroke-width="4"/>
          <line x1="10" y1="100" x2="25" y2="130" stroke="white" stroke-width="4"/>
          <line x1="110" y1="100" x2="95" y2="130" stroke="white" stroke-width="4"/>
          <line x1="55" y1="165" x2="45" y2="225" stroke="white" stroke-width="4"/>
          <line x1="65" y1="165" x2="75" y2="225" stroke="white" stroke-width="4"/>
        </svg>
      `
    };

    const svg = silhuetaSVG[level];
    setSilhueta(svg);

    // ---- SALVAR NO SUPABASE ---- //
    if (session?.user) {
      await supabase.from("evolucao_silhuetas").insert({
        user_id: session.user.id,
        peso: Number(peso),
        cintura: Number(cintura),
        gordura: Number(gordura),
        silhueta_svg: svg
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

          {/* Gordura */}
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

        {/* BUTTON */}
        <Button
          onClick={gerarSilhueta}
          className="w-full py-3 text-lg bg-emerald-500 hover:bg-emerald-600"
        >
          {loading ? "Gerando..." : "Gerar Silhueta"}
        </Button>

        {/* SILHUETA */}
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
