"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Dumbbell, CheckCircle } from "lucide-react";

interface WorkoutPlan {
  id: string;
  titulo: string | null;
  nivel: string | null;
  foco: string | null;
  descricao: string | null;
  plano: {
    exercicios: {
      nome: string;
      series: string;
      repeticoes: string;
      descanso: string;
      explicacao: string;
    }[];
  };
}

export default function TreinoDetalhesPage() {
  const { id } = useParams();
  const { supabase, session, loading } = useSupabase();

  const [treino, setTreino] = useState<WorkoutPlan | null>(null);
  const [loadingTreino, setLoadingTreino] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/treinos/${id}`);
        const data = await res.json();

        if (data.plan) {
          setTreino(data.plan);
        }
      } catch (e) {
        console.error("Erro ao carregar treino:", e);
      }

      setLoadingTreino(false);
    };

    load();
  }, [id]);

  const registrarConclusao = async () => {
    if (!session?.user?.id) {
      setMsg("Você precisa estar logado para marcar o treino.");
      return;
    }

    setSaving(true);
    setMsg("");

    const { error } = await supabase.from("workout_logs").insert({
      user_id: session.user.id,
      treino_id: id,
      concluido_em: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
      setMsg("Erro ao registrar conclusão.");
    } else {
      setMsg("Treino concluído com sucesso! 💪🔥");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        {/* LOADING */}
        {loadingTreino ? (
          <p className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" /> Carregando treino…
          </p>
        ) : !treino ? (
          <p className="text-gray-400">Treino não encontrado.</p>
        ) : (
          <>
            {/* TÍTULO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6ECBF5]/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-[#6ECBF5]" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">{treino.titulo}</h1>
                <p className="text-gray-400">
                  Nível:{" "}
                  <span className="text-white font-semibold">{treino.nivel}</span>{" "}
                  • Foco:{" "}
                  <span className="text-white font-semibold">{treino.foco}</span>
                </p>
              </div>
            </div>

            {/* DESCRIÇÃO */}
            {treino.descricao && (
              <p className="text-gray-300 text-lg">{treino.descricao}</p>
            )}

            {/* LISTA DE EXERCÍCIOS */}
            <Card className="dark:bg-gray-800 border border-[#6ECBF5]/20 mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Exercícios</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {treino.plano.exercicios.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-gray-900/40 border border-gray-700"
                  >
                    <h2 className="text-xl font-bold text-[#6ECBF5]">
                      {ex.nome}
                    </h2>

                    <p className="text-gray-300 mt-1">{ex.explicacao}</p>

                    <p className="mt-3 text-gray-400">
                      <span className="text-gray-300 font-semibold">Séries:</span>{" "}
                      {ex.series}
                    </p>

                    <p className="text-gray-400">
                      <span className="text-gray-300 font-semibold">
                        Repetições:
                      </span>{" "}
                      {ex.repeticoes}
                    </p>

                    <p className="text-gray-400">
                      <span className="text-gray-300 font-semibold">
                        Descanso:
                      </span>{" "}
                      {ex.descanso}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* BOTÃO CONCLUIR */}
            <div className="flex flex-col items-start gap-3 mt-6">
              <Button
                onClick={registrarConclusao}
                disabled={saving}
                className="bg-[#7BE4B7] hover:bg-[#62cfa2] text-white"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Registrando…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Marcar como concluído
                  </span>
                )}
              </Button>

              {msg && (
                <p className="text-sm text-gray-300 bg-black/30 px-3 py-2 rounded-lg">
                  {msg}
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
