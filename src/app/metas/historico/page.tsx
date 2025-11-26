"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import {
  Loader2,
  ArrowLeft,
  Filter,
  Trophy,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Meta {
  id: string;
  titulo: string;
  categoria: string;
  dificuldade: string;
  status: string;
  criado_em: string;
}

export default function HistoricoMetasPage() {
  const { supabase, session } = useSupabase();
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // FILTROS -------------------------
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState("todas");
  const [periodoFiltro, setPeriodoFiltro] = useState("todas");
  // ---------------------------------

  useEffect(() => {
    if (!session?.user) return;

    async function carregarHistorico() {
      const { data, error } = await supabase
        .from("metas_principais")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "concluida")
        .order("criado_em", { ascending: false });

      if (!error) setMetas(data as Meta[]);
      setLoading(false);
    }

    carregarHistorico();
  }, [session]);

  // CALCULAR FILTROS
  const metasFiltradas = metas.filter((m) => {
    const dataMeta = new Date(m.criado_em);

    // Filtro categoria
    if (categoriaFiltro !== "todas" && m.categoria !== categoriaFiltro) {
      return false;
    }

    // Filtro dificuldade
    if (dificuldadeFiltro !== "todas" && m.dificuldade !== dificuldadeFiltro) {
      return false;
    }

    // Filtro período
    const agora = new Date();

    if (periodoFiltro === "mes") {
      const mesmoMes =
        dataMeta.getMonth() === agora.getMonth() &&
        dataMeta.getFullYear() === agora.getFullYear();
      if (!mesmoMes) return false;
    }

    if (periodoFiltro === "3meses") {
      const diff = agora.getTime() - dataMeta.getTime();
      const dias = diff / (1000 * 60 * 60 * 24);
      if (dias > 90) return false;
    }

    if (periodoFiltro === "ano") {
      if (dataMeta.getFullYear() !== agora.getFullYear()) return false;
    }

    return true;
  });

  // MEDALHAS
  function medalhaPorDificuldade(d: string) {
    if (d === "dificil") return "🥇";
    if (d === "medio") return "🥈";
    return "🥉";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
    >
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Voltar */}
        <button
          onClick={() => router.push("/metas")}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Título */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Histórico de metas
          </h1>
          <p className="text-slate-400 text-sm">
            Veja suas metas concluídas, com medalhas e filtros especiais ✨
          </p>
        </div>

        {/* FILTROS */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl border border-gray-300 dark:border-gray-700 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Filter className="w-4 h-4" /> Filtros
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            {/* Filtro categoria */}
            <select
              className="bg-gray-200 dark:bg-gray-800 border border-gray-500 rounded-lg px-3 py-2 text-sm"
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
            >
              <option value="todas">Todas categorias</option>
              <option value="peso">Peso</option>
              <option value="saude">Saúde</option>
              <option value="financas">Finanças</option>
              <option value="rotina">Rotina</option>
            </select>

            {/* Filtro dificuldade */}
            <select
              className="bg-gray-200 dark:bg-gray-800 border border-gray-500 rounded-lg px-3 py-2 text-sm"
              value={dificuldadeFiltro}
              onChange={(e) => setDificuldadeFiltro(e.target.value)}
            >
              <option value="todas">Todas dificuldades</option>
              <option value="facil">Fácil 🥉</option>
              <option value="medio">Médio 🥈</option>
              <option value="dificil">Difícil 🥇</option>
            </select>

            {/* Período */}
            <select
              className="bg-gray-200 dark:bg-gray-800 border border-gray-500 rounded-lg px-3 py-2 text-sm"
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
            >
              <option value="todas">Todo o histórico</option>
              <option value="mes">Este mês</option>
              <option value="3meses">Últimos 3 meses</option>
              <option value="ano">Ano atual</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-slate-400" />
          </div>
        ) : metasFiltradas.length === 0 ? (
          <p className="text-slate-400 text-center py-10">
            Nenhuma meta encontrada com os filtros escolhidos.
          </p>
        ) : (
          <div className="space-y-4">
            {metasFiltradas.map((meta) => (
              <motion.div
                key={meta.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-100 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    {medalhaPorDificuldade(meta.dificuldade)}
                    {meta.titulo}
                  </h2>

                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(meta.criado_em).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  Categoria: {meta.categoria}
                </p>
                <p className="text-sm text-slate-400 capitalize">
                  Dificuldade: {meta.dificuldade}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
}
