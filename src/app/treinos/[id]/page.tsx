"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dumbbell,
  Clock,
  Flame,
  ArrowLeft,
  Loader2,
  Heart,
  Check,
  PlayCircle,
  Info,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";

interface TreinoExercicio {
  nome: string;
  series: string | null;
  repeticoes: string | null;
  descansoSegundos: number | null;
}

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
  exercicios: TreinoExercicio[];
}

export default function TreinoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const id = params?.id as string;

  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);

  const [favorito, setFavorito] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  // Helpers
  const duracaoMin = treino?.duracao ?? 45;
  const calorias = treino?.calorias ?? 220;

  function formatNivel(nivel: string) {
    if (!nivel) return "Nível não informado";
    const n = nivel.toLowerCase();
    if (n.includes("inic")) return "Iniciante";
    if (n.includes("inter")) return "Intermediário";
    if (n.includes("avan")) return "Avançado";
    return nivel;
  }

  function intensidadeFromNivel(nivel: string) {
    const n = nivel.toLowerCase();
    if (n.includes("inic")) return "Leve";
    if (n.includes("inter")) return "Moderada";
    if (n.includes("avan")) return "Intensa";
    return "Personalizada";
  }

  const intensidade = intensidadeFromNivel(treino?.nivel || "");

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
    if (!session?.user) {
      alert("Você precisa estar logada para favoritar treinos.");
      return;
    }

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

      if (!res.ok) {
        alert(data.error || "Erro ao atualizar favorito.");
        return;
      }

      setFavorito(!favorito);
    } finally {
      setFavLoading(false);
    }
  }

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-40 rounded-2xl bg-slate-800/60" />
            <div className="h-8 w-64 rounded bg-slate-800/70" />
            <div className="h-24 rounded-2xl bg-slate-900/80" />
            <div className="h-64 rounded-2xl bg-slate-900/80" />
          </div>
        </main>
      </div>
    );
  }

  // NÃO ENCONTROU
  if (!treino) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-300 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-lg font-medium">Treino não encontrado.</p>
            <Button
              variant="outline"
              onClick={() => router.push("/treinos")}
              className="border-slate-700 bg-slate-900 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para treinos
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* VOLTAR */}
        <button
          onClick={() => router.push("/treinos")}
          className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para treinos
        </button>

        {/* CAPA + INFO PRINCIPAL */}
        <section className="space-y-6">
          {/* Capa */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-slate-900">
            {treino.imagem_url ? (
              <img
                src={treino.imagem_url}
                alt={treino.titulo}
                className="w-full h-44 md:h-56 object-cover"
              />
            ) : (
              <div className="w-full h-44 md:h-56 flex items-center justify-center">
                <Dumbbell className="w-10 h-10 md:w-14 md:h-14 text-emerald-400/80" />
              </div>
            )}
          </div>

          {/* Título + stats */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {treino.titulo}
                </h1>
                {treino.descricao && (
                  <p className="text-sm md:text-[13px] text-slate-400 max-w-2xl">
                    {treino.descricao}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={concluirTreino}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1 text-sm">
                      <Check className="w-4 h-4" />
                      Concluir
                    </span>
                  )}
                </Button>

                <Button
                  onClick={toggleFavorito}
                  disabled={favLoading}
                  variant={favorito ? "default" : "outline"}
                  className={
                    favorito
                      ? "bg-red-500 hover:bg-red-600 border-red-500 text-white"
                      : "border-slate-700 text-slate-100 bg-slate-900 hover:bg-slate-800"
                  }
                >
                  {favLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2 text-sm">
                      <Heart
                        className={`w-4 h-4 ${
                          favorito ? "fill-white" : "fill-transparent"
                        }`}
                      />
                      {favorito ? "Remover" : "Favoritar"}
                    </span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Modo passo-a-passo
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Calorias
                  </p>
                  <p className="font-semibold">{calorias} kcal</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                <Clock className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Duração
                  </p>
                  <p className="font-semibold">{duracaoMin} min</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Intensidade
                  </p>
                  <p className="font-semibold">{intensidade}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3">
                <Dumbbell className="w-4 h-4 text-violet-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Nível
                  </p>
                  <p className="font-semibold">
                    {formatNivel(treino.nivel || "")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESUMO DO TREINO */}
        <section className="grid md:grid-cols-[1.1fr,0.9fr] gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold tracking-wide">
                Resumo do treino
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Este treino foi gerado de forma personalizada com base nas suas
              informações e objetivos. Ele foi pensado para ativar{" "}
              <span className="font-semibold">
                vários grupos musculares
              </span>{" "}
              ao mesmo tempo, melhorar sua{" "}
              <span className="font-semibold">resistência</span> e auxiliar no
              seu progresso dentro do Emagrify.
            </p>

            <ul className="text-xs md:text-sm text-slate-300 space-y-1.5">
              <li>
                • Foco principal:{" "}
                <span className="font-semibold">
                  {treino.categoria || "corpo inteiro"}
                </span>
              </li>
              <li>• Ideal para treinar em casa, com pouco ou nenhum equipamento.</li>
              <li>
                • Combine este treino com descanso adequado e boa alimentação
                para melhores resultados.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold tracking-wide">
                Recomendações rápidas
              </h2>
            </div>

            <ul className="text-xs md:text-sm text-slate-300 space-y-1.5">
              <li>• Faça um aquecimento leve de 3–5 minutos antes do treino.</li>
              <li>• Mantenha a respiração fluindo, sem prender o ar.</li>
              <li>• Se sentir dor aguda (e não apenas esforço), pare o exercício.</li>
              <li>
                • Priorize a técnica correta antes de aumentar a intensidade.
              </li>
            </ul>
          </div>
        </section>

        {/* EXERCÍCIOS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              Exercícios
            </h2>
            <p className="text-xs text-slate-400">
              {treino.exercicios?.length || 0} exercícios neste treino
            </p>
          </div>

          {treino.exercicios && treino.exercicios.length > 0 ? (
            <div className="space-y-3">
              {treino.exercicios.map((ex, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      {index + 1}. {ex.nome}
                    </p>
                    <div className="flex flex-wrap gap-3 text-[11px] md:text-xs text-slate-300">
                      {ex.series && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/80">
                          <span className="font-semibold">Séries:</span>{" "}
                          {ex.series}
                        </span>
                      )}

                      {ex.repeticoes && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/80">
                          <span className="font-semibold">Repetições:</span>{" "}
                          {ex.repeticoes}
                        </span>
                      )}

                      {ex.descansoSegundos != null && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/80">
                          <span className="font-semibold">Descanso:</span>{" "}
                          {ex.descansoSegundos}s
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 md:items-end">
                    <span className="inline-flex items-center rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400">
                      Foco: corpo inteiro
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-6 text-center text-sm text-slate-400">
              Nenhum exercício listado para este treino.
            </div>
          )}
        </section>

        {/* BOTÃO FINAL */}
        <section className="pt-2 pb-10">
          <Button
            onClick={concluirTreino}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full py-3 rounded-2xl"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2 text-base">
                <Check className="w-5 h-5" />
                Concluir treino
              </span>
            )}
          </Button>
        </section>
      </main>
    </div>
  );
}
