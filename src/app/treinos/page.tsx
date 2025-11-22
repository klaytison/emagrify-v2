"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Dumbbell, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkoutPlan {
  id: string;
  titulo: string | null;
  nivel: string | null; // iniciante / intermediario / avancado
  foco: string | null; // peito, costas, pernas...
  descricao: string | null;
  plano: any; // JSON com os exercícios
  created_at: string;
}

export default function TreinosPage() {
  const { supabase, session, loading } = useSupabase();

  const [treinos, setTreinos] = useState<WorkoutPlan[]>([]);
  const [loadingTreinos, setLoadingTreinos] = useState(true);

  const [filtroNivel, setFiltroNivel] = useState<string | null>(null);
  const [filtroFoco, setFiltroFoco] = useState<string | null>(null);

  // Carregar treinos da API
  useEffect(() => {
    const loadTreinos = async () => {
      try {
        const res = await fetch("/api/treinos");
        const data = await res.json();

        if (data.plans) {
          setTreinos(data.plans);
        }
      } catch (e) {
        console.error("Erro ao carregar treinos:", e);
      }
      setLoadingTreinos(false);
    };

    loadTreinos();
  }, []);

  const treinosFiltrados = treinos.filter((t) => {
    if (filtroNivel && t.nivel !== filtroNivel) return false;
    if (filtroFoco && t.foco !== filtroFoco) return false;
    return true;
  });

  // Lista de focos musculares (pode expandir quando quiser)
  const focos = [
    "peito",
    "costas",
    "pernas",
    "ombros",
    "biceps",
    "triceps",
    "gluteos",
    "abdomen",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-10">
        {/* TÍTULO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6ECBF5]/20 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-[#6ECBF5]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Treinos Adaptados</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Treinos para casa ou academia, ajustados ao seu nível.
            </p>
          </div>
        </div>

        {/* FILTROS */}
        <Card className="dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de personalização
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {["iniciante", "intermediario", "avancado"].map((nivel) => (
                <Button
                  key={nivel}
                  variant={filtroNivel === nivel ? "default" : "outline"}
                  className={
                    filtroNivel === nivel
                      ? "bg-[#7BE4B7] text-white"
                      : "border-[#7BE4B7] text-[#7BE4B7]"
                  }
                  onClick={() =>
                    setFiltroNivel(filtroNivel === nivel ? null : nivel)
                  }
                >
                  {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {focos.map((f) => (
                <Button
                  key={f}
                  variant={filtroFoco === f ? "default" : "outline"}
                  className={
                    filtroFoco === f
                      ? "bg-[#6ECBF5] text-white"
                      : "border-[#6ECBF5] text-[#6ECBF5]"
                  }
                  onClick={() => setFiltroFoco(filtroFoco === f ? null : f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* LISTAGEM DE TREINOS */}
        {loadingTreinos ? (
          <p className="flex items-center gap-2 text-gray-500 mt-10">
            <Loader2 className="w-5 h-5 animate-spin" /> Carregando treinos…
          </p>
        ) : treinosFiltrados.length === 0 ? (
          <p className="text-gray-400">Nenhum treino encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {treinosFiltrados.map((treino) => (
              <Card
                key={treino.id}
                className="dark:bg-gray-800 border border-[#6ECBF5]/20 hover:border-[#6ECBF5] transition-all cursor-pointer"
                onClick={() =>
                  (window.location.href = `/treinos/${treino.id}`)
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {treino.titulo || "Treino sem título"}
                    <Dumbbell className="w-5 h-5 text-[#6ECBF5]" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Nível:{" "}
                    <span className="text-white font-semibold">
                      {treino.nivel}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Foco:{" "}
                    <span className="text-white font-semibold">
                      {treino.foco}
                    </span>
                  </p>
                  <p className="mt-3 text-gray-300 line-clamp-3">
                    {treino.descricao || "Sem descrição disponível."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
