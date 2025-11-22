"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Trash2, Pencil, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Treino {
  id: string;
  titulo: string;
  descricao: string | null;
  nivel: string;
  categoria: string;
  duracao: number | null;
  calorias: number | null;
  exercicios: {
    nome: string;
    series: string | null;
    repeticoes: string | null;
    descansoSegundos: number | null;
  }[];
  video_url: string | null;
  imagem_url: string | null;
}

export default function TreinoDetalhesPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const params = useParams();
  const treinoId = params?.id as string;

  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  async function loadTreino() {
    setLoading(true);

    const { data, error } = await supabase
      .from("treinos")
      .select("*")
      .eq("id", treinoId)
      .single();

    if (!error) {
      setTreino(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (treinoId) loadTreino();
  }, [treinoId]);

  async function deleteTreino() {
    if (!confirm("Tem certeza que deseja excluir este treino?")) return;

    setDeleting(true);

    const { error } = await supabase
      .from("treinos")
      .delete()
      .eq("id", treinoId);

    setDeleting(false);

    if (!error) {
      router.push("/admin/treinos");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </main>
    );
  }

  if (!treino) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center">
        Treino não encontrado.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Voltar */}
        <button
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 transition-colors"
          onClick={() => router.push("/admin/treinos")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-emerald-400" />
            {treino.titulo}
          </h1>

          <div className="flex gap-3">
            <Button
              onClick={() => router.push(`/admin/treinos/editar/${treinoId}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Editar
            </Button>

            <Button
              onClick={deleteTreino}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1" />
              )}
              Excluir
            </Button>
          </div>
        </div>

        {/* Categoria / nível */}
        <p className="text-gray-400 text-sm">
          {treino.categoria} • {treino.nivel}
        </p>

        {/* Descrição */}
        {treino.descricao && (
          <p className="text-gray-300 leading-relaxed">{treino.descricao}</p>
        )}

        {/* Vídeo */}
        {treino.video_url && (
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-800 bg-black">
            <iframe
              src={treino.video_url}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {/* Imagem */}
        {treino.imagem_url && (
          <img
            src={treino.imagem_url}
            className="w-full max-h-80 object-cover rounded-xl border border-gray-800"
          />
        )}

        {/* Exercícios */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Exercícios do treino</h2>

          <div className="space-y-3">
            {treino.exercicios.map((ex, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-800 bg-gray-900 p-4"
              >
                <p className="text-lg font-semibold">{ex.nome}</p>

                <p className="text-gray-400 text-sm">
                  {ex.series ? `${ex.series} séries` : ""}
                  {ex.repeticoes ? ` • ${ex.repeticoes} reps` : ""}
                  {ex.descansoSegundos
                    ? ` • ${ex.descansoSegundos}s descanso`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
