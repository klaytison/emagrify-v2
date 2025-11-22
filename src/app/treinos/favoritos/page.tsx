"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Heart, Dumbbell, Flame, Clock } from "lucide-react";
import Link from "next/link";

interface TreinoFavorito {
  id: string;
  treino: {
    id: string;
    titulo: string;
    categoria: string | null;
    nivel: string;
    imagem_url: string | null;
    duracao: number | null;
    calorias: number | null;
  };
}

export default function FavoritosPage() {
  const { supabase, session, loading: loadingSession } = useSupabase();

  const [favoritos, setFavoritos] = useState<TreinoFavorito[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFavoritos() {
    if (!session?.user?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("treinos_favoritos")
      .select(`
        id,
        treino:treinos (
          id,
          titulo,
          categoria,
          nivel,
          imagem_url,
          duracao,
          calorias
        )
      `)
      .eq("user_id", session.user.id)
      .order("id", { ascending: false });

    if (!error && data) {
      setFavoritos(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!loadingSession) {
      loadFavoritos();
    }
  }, [loadingSession]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-bold">Treinos Favoritos</h1>
        </div>

        {/* Carregando */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}

        {/* Nenhum favorito */}
        {!loading && favoritos.length === 0 && (
          <p className="text-gray-500 text-center text-sm py-20">
            Você ainda não favoritou nenhum treino.
          </p>
        )}

        {/* Lista */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoritos.map((fav) => (
            <Link
              key={fav.id}
              href={`/treinos/${fav.treino.id}`}
              className="group rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* Imagem */}
              {fav.treino.imagem_url ? (
                <img
                  src={fav.treino.imagem_url}
                  alt={fav.treino.titulo}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-gradient-to-br from-emerald-400/30 via-sky-400/30 to-slate-900" />
              )}

              {/* Conteúdo */}
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-lg group-hover:text-emerald-400 transition">
                  {fav.treino.titulo}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {fav.treino.categoria ?? "Sem categoria"} • {fav.treino.nivel}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-1">
                  {fav.treino.duracao && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-sky-400" />
                      {fav.treino.duracao}min
                    </span>
                  )}

                  {fav.treino.calorias && (
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-amber-400" />
                      {fav.treino.calorias} kcal
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
