"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2, Dumbbell, Filter } from "lucide-react";

interface Workout {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: number;
  calories: number;
  image_url: string | null;
  description: string | null;
}

export default function TreinosPage() {
  const { supabase } = useSupabase();
  const [treinos, setTreinos] = useState<Workout[]>([]);
  const [filtered, setFiltered] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroNivel, setFiltroNivel] = useState("todos");

  useEffect(() => {
    async function loadWorkouts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("workouts_catalog")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTreinos(data);
        setFiltered(data);
      }

      setLoading(false);
    }

    loadWorkouts();
  }, [supabase]);

  // Aplicar filtros
  useEffect(() => {
    let lista = [...treinos];

    if (filtroCategoria !== "todos") {
      lista = lista.filter((t) => t.category === filtroCategoria);
    }

    if (filtroNivel !== "todos") {
      lista = lista.filter((t) => t.level === filtroNivel);
    }

    setFiltered(lista);
  }, [filtroCategoria, filtroNivel, treinos]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-10 text-gray-900 dark:text-gray-50">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex gap-2 items-center">
          <Dumbbell className="w-7 h-7 text-[#7BE4B7]" />
          Treinos Adaptados
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Escolha um treino feito especialmente para o seu nível e objetivo!
        </p>

        {/* FILTROS */}
        <Card className="mb-10 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center gap-3">
            <Filter className="w-5 h-5 text-[#7BE4B7]" />
            <div>
              <CardTitle className="text-lg">Filtros</CardTitle>
              <CardDescription>
                Personalize a busca pelos melhores treinos.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="todos">Todas as categorias</option>
              <option value="perda de peso">Perda de peso</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="mobilidade">Mobilidade</option>
              <option value="funcional">Funcional</option>
              <option value="cardio">Cardio</option>
            </select>

            <select
              value={filtroNivel}
              onChange={(e) => setFiltroNivel(e.target.value)}
              className="px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="todos">Todos os níveis</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediário">Intermediário</option>
              <option value="avançado">Avançado</option>
            </select>
          </CardContent>
        </Card>

        {/* LISTAGEM DE TREINOS */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-20">
            Nenhum treino encontrado para esses filtros.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((treino) => (
              <Card
                key={treino.id}
                className="cursor-pointer hover:shadow-xl transition dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                onClick={() => (window.location.href = `/treinos/${treino.id}`)}
              >
                {treino.image_url ? (
                  <img
                    src={treino.image_url}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-t-xl" />
                )}

                <CardContent className="p-4 space-y-1">
                  <CardTitle className="text-lg">{treino.title}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {treino.level.toUpperCase()} • {treino.duration} min
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {treino.category}
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
