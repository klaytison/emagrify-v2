"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Dumbbell, Clock, Flame, ArrowLeft, Loader2, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";

interface Treino {
  id: string;
  titulo: string;
  descricao: string | null;
  nivel: string;
  categoria: string | null;
  duracao: number | null;
  calorias: number | null;
  video_url: string | null;
  imagem_url: string | null;
  exercicios: {
    nome: string;
    series: string | null;
    repeticoes: string | null;
    descansoSegundos: number | null;
  }[];
}

export default function TreinoDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const { supabase, session } = useSupabase();

  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);

  const [favorito, setFavorito] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  // FUNÇÃO: Concluir Treino
  async function concluirTreino() {
    if (!session?.user) {
      alert("Você precisa estar logada para concluir treinos.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/treinos/concluir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treinoId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao concluir treino.");
        return;
      }

      router.push("/monitoramento");
    } finally {
      setSaving(false);
    }
  }

  // Carregar treino
  useEffect(() => {
    async function loadTreino() {
      try {
        setLoading(true);
        const res = await fetch(`/api/treinos/${id}`);
        const data = await res.json();

        if (!res.ok) return;
        setTreino(data.treino);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadTreino();
  }, [id]);

  // Verificar se é favorito
  useEffect(() => {
    async function checkFavorite() {
      if (!session?.user?.id) return;

      const { data } = await supabase
        .from("treinos_favoritos")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("treino_id", id)
        .maybeSingle();

      setFavorito(!!data);
    }

    checkFavorite();
  }, [session, id, supabase]);

  // Favoritar
  async function toggleFavorito() {
    if (!session?.user) return alert("Você precisa estar logada.");

    setFavLoading(true);

    try {
      const res = await fetch("/api/treinos/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treinoId: id,
          action: favorito ? "remove" : "add",
        }),
      });

      const data = await res.json();

      if (!res.ok) return alert("Erro ao atualizar favorito.");

      setFavorito(!favorito);
    } finally {
      setFavLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!treino) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        Treino não encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* VOLTAR */}
        <button
          onClick={() => router.push("/treinos")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para treinos
        </button>

        {/* CAPA */}
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {treino.imagem_url ? (
            <img
              src={treino.imagem_url}
              alt={treino.titulo}
              className="w-full h-56 object-cover"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-emerald-500/30 via-sky-500/30 to-slate-900" />
          )}
        </div>

        {/* TÍTULO + BOTÕES (TOP) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">

            <h1 className="text-2xl md:text-3xl font-bold">{treino.titulo}</h1>

            <div className="flex gap-3">
              
              {/* Concluir treino (TOPO) */}
              <Button
                onClick={concluirTreino}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Concluir
                  </span>
                )}
              </Button>

              {/* Favoritar */}
              <Button
                onClick={toggleFavorito}
                disabled={favLoading}
                className={
                  favorito
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }
              >
                {favLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Heart
                      className={`w-4 h-4 ${
                        favorito ? "fill-white" : "fill-transparent"
                      }`}
                    />
                    {favorito ? "Remover" : "Favoritar"}
                  </span>
                )}
              </Button>

            </div>
          </div>

          {treino.descricao && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {treino.descricao}
            </p>
          )}
        </section>

        {/* Botão no meio */}
        <div className="pt-4">
          <Button
            onClick={concluirTreino}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Concluir treino
              </span>
            )}
          </Button>
        </div>

        {/* VÍDEO */}
        {treino.video_url && (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Vídeo demonstrativo</h2>

            <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <iframe
                src={treino.video_url.replace("watch?v=", "embed/")}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* EXERCÍCIOS */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Exercícios</h2>

          <div className="space-y-4">
            {treino.exercicios.map((ex, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
              >
                <h3 className="font-semibold">{ex.nome}</h3>

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-x-3">
                  {ex.series && <span><b>Séries:</b> {ex.series}</span>}
                  {ex.repeticoes && <span><b>Reps:</b> {ex.repeticoes}</span>}
                  {ex.descansoSegundos != null && (
                    <span><b>Descanso:</b> {ex.descansoSegundos}s</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTÃO FINAL */}
        <div className="pt-6 flex">
          <Button
            onClick={concluirTreino}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-3"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2 text-lg">
                <Check className="w-5 h-5" />
                Concluir treino
              </span>
            )}
          </Button>
        </div>

      </main>
    </div>
  );
}
