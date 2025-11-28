"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { Sunrise, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function RituaisPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">Rituais do Dia</h1>
        <p className="text-gray-400 mb-10">
          Crie hábitos saudáveis com dois rituais guiados pela IA: manhã e noite.
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* RITUAL MATINAL */}
          <Link href="/ritual-matinal">
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 cursor-pointer"
            >
              <Sunrise className="w-10 h-10 text-yellow-400 mb-3" />
              <h2 className="text-xl font-semibold">Ritual da Manhã</h2>
              <p className="text-gray-400 text-sm mt-2">
                Respiração, água, foco do dia e frase motivacional.
              </p>
            </motion.div>
          </Link>

          {/* RITUAL NOTURNO */}
          <Link href="/ritual-noturno">
            <motion.div
              whileHover={{ scale: 1.03, y: -3 }}
              className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 cursor-pointer"
            >
              <Moon className="w-10 h-10 text-purple-400 mb-3" />
              <h2 className="text-xl font-semibold">Ritual da Noite</h2>
              <p className="text-gray-400 text-sm mt-2">
                Reflexão, gratidão, revisão das metas e relaxamento.
              </p>
            </motion.div>
          </Link>

        </div>
      </main>
    </div>
  );
}
