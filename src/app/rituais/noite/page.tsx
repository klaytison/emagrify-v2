"use client";

import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";

export default function RitualNoitePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Moon className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold">Ritual da Noite</h1>
        </div>

        <p className="text-gray-400 mb-10">
          Finalize seu dia com calma, reflexão e preparação para um novo amanhã.
        </p>

        {/* PASSO 1 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-purple-300">1. Reflexão</h2>
          <p className="text-gray-400 text-sm mt-2">
            Como você se sentiu hoje? Houve algo que te orgulhou?
          </p>
        </motion.div>

        {/* PASSO 2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-emerald-300">2. Gratidão</h2>
          <p className="text-gray-400 text-sm mt-2">
            Liste 1 ou 2 coisas pelas quais você é grata hoje.
          </p>
        </motion.div>

        {/* PASSO 3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-blue-300">3. Revisão das micro-metas</h2>
          <p className="text-gray-400 text-sm mt-2">
            Veja o que conseguiu cumprir hoje e selecione 1 prioridade para amanhã.
          </p>
        </motion.div>

        {/* PASSO 4 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-pink-300">4. Relaxamento</h2>
          <p className="text-gray-400 text-sm mt-2">
            Respire lentamente e alongue o pescoço por 30 segundos.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
