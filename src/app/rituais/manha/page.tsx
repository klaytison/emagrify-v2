"use client";

import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Sunrise } from "lucide-react";

export default function RitualManhaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Sunrise className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold">Ritual da Manhã</h1>
        </div>

        <p className="text-gray-400 mb-10">
          Comece seu dia com energia e foco. A IA organizará uma rotina personalizada.
        </p>

        {/* PASSO 1 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-yellow-300">1. Respiração</h2>
          <p className="text-gray-400 text-sm mt-2">
            Inspire profundamente por 4s, segure 2s, solte em 6s.  
            Repita 5 vezes.
          </p>
        </motion.div>

        {/* PASSO 2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-emerald-300">2. Hidratação</h2>
          <p className="text-gray-400 text-sm mt-2">
            Beba um copo de água para ativar o metabolismo.
          </p>
        </motion.div>

        {/* PASSO 3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-blue-300">3. Foco do Dia</h2>
          <p className="text-gray-400 text-sm mt-2">
            Escolha uma micro-meta simples para manter o ritmo.
          </p>
        </motion.div>

        {/* PASSO 4 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-pink-300">4. Frase motivacional</h2>
          <p className="text-gray-400 text-sm mt-2 italic">
            “Você só precisa dar um passo hoje.”
          </p>
        </motion.div>
      </main>
    </div>
  );
}
