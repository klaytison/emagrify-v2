"use client";

import { useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Loader2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NovaMetaPage() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dificuldade, setDificuldade] = useState("médio");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  const [salvando, setSalvando] = useState(false);

  async function salvarMeta() {
    if (!session?.user) return;
    if (!titulo.trim()) return alert("Coloque um título para a meta!");

    setSalvando(true);

    const { error } = await supabase.from("metas_principais").insert({
      user_id: session.user.id,
      titulo,
      categoria,
      descricao,
      dificuldade,
      inicio: inicio || null,
      fim: fim || null,
    });

    setSalvando(false);

    if (error) {
      console.error(error);
      alert("Erro ao criar meta.");
      return;
    }

    router.push("/metas");
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Você precisa estar logada.
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Cabeçalho */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
            <PlusCircle className="w-3 h-3" />
            Criar nova meta
          </span>

          <h1 className="text-3xl font-bold">Definir meta principal</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg">
            Crie um objetivo claro e realista. Depois você poderá acompanhar seu progresso semanalmente.
          </p>
        </motion.div>

        {/* Formulário */}
        <motion.div
          className="border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 rounded-2xl p-6 space-y-5"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Título */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Título da meta</label>
            <input
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              placeholder="Ex: Ganhar massa magra"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Categoria */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            >
              <option value="">Selecione...</option>
              <option value="peso">Peso</option>
              <option value="alimentação">Alimentação</option>
              <option value="treino">Treino</option>
              <option value="saúde">Saúde geral</option>
              <option value="hábito">Hábitos</option>
            </select>
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <textarea
              rows={3}
              placeholder="Explique mais detalhes sobre sua meta..."
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Dificuldade */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Dificuldade estimada</label>
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            >
              <option value="fácil">Fácil</option>
              <option value="médio">Médio</option>
              <option value="difícil">Difícil</option>
            </select>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Data inicial</label>
              <input
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Data final (opcional)</label>
              <input
                type="date"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between">
            <Link
              href="/metas"
              className="text-sm text-gray-500 hover:text-gray-300 transition"
            >
              Cancelar
            </Link>

            <button
              onClick={salvarMeta}
              disabled={salvando}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl disabled:opacity-50"
            >
              {salvando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="w-4 h-4" />
              )}
              Criar meta
            </button>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}
