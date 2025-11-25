"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { toast } from "@/components/ui/use-toast";

// Ícones
import {
  Loader2,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";

// Gamificação
import { adicionarXP } from "@/lib/gamificacao";

// Animação de confete
import { soltarConfete } from "@/components/animations/Confetti";

interface MicroMeta {
  id: string;
  titulo: string;
  descricao: string | null;
  semana: number;
  concluido: boolean;
}

export default function MicroMetasListPage() {
  const { supabase, session } = useSupabase();
  const params = useParams();
  const router = useRouter();

  const metaId = params.id as string;

  const [microMetas, setMicroMetas] = useState<MicroMeta[]>([]);
  const [loading, setLoading] = useState(true);

  //----------------------------------------------------
  // 🔵 CARREGAR MICRO-METAS
  //----------------------------------------------------
  async function carregarMicroMetas() {
    setLoading(true);

    const { data, error } = await supabase
      .from("micro_metas")
      .select("*")
      .eq("meta_id", metaId)
      .order("semana", { ascending: true });

    if (error) {
      toast({
        title: "Erro ao carregar micro-metas",
        description: error.message,
      });
    } else {
      setMicroMetas(data);
    }

    setLoading(false);
  }

  //----------------------------------------------------
  // 🟢 CONCLUIR / DESMARCAR MICRO-META
  //----------------------------------------------------
  async function concluirMicroMeta(id: string, concluido: boolean) {
    const { error } = await supabase
      .from("micro_metas")
      .update({ concluido: !concluido })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível alterar o status.",
      });
      return;
    }

    if (!concluido) {
      // Só dá XP quando marca como concluída
      await adicionarXP(supabase, session!.user.id, 15);

      // Confete 🎉
      soltarConfete();

      // Som de vitória fofinho
      const audio = new Audio(
        "https://cdn.pixabay.com/audio/2022/03/15/audio_f9ad01afee.mp3"
      );
      audio.volume = 0.3;
      audio.play();

      toast({
        title: "Micro-meta concluída! 🎉",
        description: "Você ganhou +15 XP",
      });
    } else {
      toast({
        title: "Micro-meta marcada como pendente",
      });
    }

    carregarMicroMetas();
  }

  //----------------------------------------------------
  // 🔴 EXCLUIR MICRO-META
  //----------------------------------------------------
  async function excluirMicroMeta(id: string) {
    const { error } = await supabase.from("micro_metas").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover a micro-meta.",
      });
    } else {
      toast({ title: "Micro-meta removida" });
      carregarMicroMetas();
    }
  }

  //----------------------------------------------------
  // 🔄 CARREGAR AO ABRIR A TELA
  //----------------------------------------------------
  useEffect(() => {
    carregarMicroMetas();
  }, []);

  //----------------------------------------------------
  // 🖥️ UI
  //----------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50"
    >
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Topo */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push(`/metas/${metaId}`)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <button
            onClick={() => router.push(`/metas/${metaId}/nova-micrometa`)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-white text-sm transition"
          >
            <Plus className="w-4 h-4" />
            Nova micro-meta
          </button>
        </div>

        {/* Título */}
        <div>
          <h1 className="text-2xl font-bold">Micro-metas</h1>
          <p className="text-slate-400 text-sm">
            Veja todas as micro-metas associadas à sua meta principal.
          </p>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : microMetas.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            Nenhuma micro-meta criada ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {microMetas.map((mm) => (
              <motion.div
                key={mm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-slate-900/40 border rounded-xl p-4 flex justify-between items-start transition ${
                  mm.concluido
                    ? "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : "border-slate-800"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-md text-slate-300">
                      Semana {mm.semana}
                    </span>
                    {mm.concluido && (
                      <span className="text-emerald-400 text-xs font-semibold">
                        ✔ Concluída
                      </span>
                    )}
                  </div>

                  <h2 className="font-semibold text-white">{mm.titulo}</h2>

                  {mm.descricao && (
                    <p className="text-sm text-slate-400">{mm.descricao}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  {/* Alternar concluído */}
                  <button
                    onClick={() => concluirMicroMeta(mm.id, mm.concluido)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                  >
                    {mm.concluido ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </button>

                  {/* Excluir */}
                  <button
                    onClick={() => excluirMicroMeta(mm.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-800/40 transition"
                  >
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
}
