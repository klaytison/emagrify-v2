"use client";

import { useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Loader2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NovaMicroMetaPage() {
  const { supabase, session } = useSupabase();
  const params = useParams();
  const router = useRouter();

  const metaId = params.id as string;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [semana, setSemana] = useState<number>(1);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!session?.user) return;

    if (!titulo.trim()) return alert("O título é obrigatório.");

    setSalvando(true);

    const { error } = await supabase.from("micro_metas").insert({
      meta_id: metaId,
      titulo,
      descricao,
      semana,
      concluido: false,
    });

    setSalvando(false);

    if (error) {
      console.error(error);
      alert("Erro ao salvar micro-meta.");
      return;
    }

    router.push(`/metas/${metaId}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
    >
      <Header />

      <main className="max-w-xl mx-auto px-4 py-10 space-y-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-2"
        >
          <span className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 text-xs rounded-full font-semibold">
            <Target className="w-3 h-3" />
            Nova Micro-meta
          </span>

          <h1 className="text-2xl font-bold">Criar micro-meta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Divida sua meta principal em partes menores para garantir que você continue avançando semana após semana.
          </p>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-5"
        >
          {/* Campo título */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Título da micro-meta</label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Treinar 3x na semana"
              className="bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* Campo descrição */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Descrição (opcional)</label>
            <Textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes da micro-meta..."
              className="bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* Campo semana */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Semana (1 a 52)</label>
            <Input
              type="number"
              min={1}
              max={52}
              value={semana}
              onChange={(e) => setSemana(Number(e.target.value))}
              className="bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
          </div>
        </motion.div>

        {/* Botão salvar */}
        <motion.div whileTap={{ scale: 0.95 }} className="pt-4 flex justify-end">
          <Button
            onClick={salvar}
            disabled={salvando}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
          >
            {salvando ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Salvar micro-meta"
            )}
          </Button>
        </motion.div>
      </main>
    </motion.div>
  );
}
