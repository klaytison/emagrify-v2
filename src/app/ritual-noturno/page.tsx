"use client";

import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";

export default function RitualNoturnoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Moon className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold">Ritual da Noite</h1>
        </div>

        <p className="text-gray-400 mb-10">
          Finalize seu dia com calma, gratidão e preparo para amanhã.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-purple-300">1. Reflexão</h2>
          <p className="text-gray-400 text-sm mt-2">
            O que você aprendeu hoje?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-emerald-300">2. Gratidão</h2>
          <p className="text-gray-400 text-sm mt-2">
            Liste 2 coisas boas do dia.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-blue-300">3. Revisão</h2>
          <p className="text-gray-400 text-sm mt-2">
            O que você conseguiu concluir hoje?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl mb-5"
        >
          <h2 className="text-lg font-semibold text-pink-300">4. Relaxamento</h2>
          <p className="text-gray-400 text-sm mt-2">
            Respire fundo e alongue o pescoço.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
