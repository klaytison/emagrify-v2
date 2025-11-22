"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, CheckCircle } from "lucide-react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";

interface TreinoConcluido {
  id: string;
  treino_id: string;
  created_at: string;
  treinos: {
    titulo: string;
    imagem_url: string | null;
  };
}

export default function TreinosConcluidosPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();

  const [lista, setLista] = useState<TreinoConcluido[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!session?.user?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("treinos_concluidos")
      .select("id, treino_id, created_at, treinos(titulo, imagem_url)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setLista(data);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Você precisa estar logada para ver seu histórico.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-emerald-500" />
          Treinos concluídos
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="animate-spin w-6 h-6" />
          </div>
        )}

        {/* Nenhum registro */}
        {!loading && lista.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            Você ainda não concluiu nenhum treino.
          </p>
        )}

        {/* Lista */}
        <ul className="divide-y divide-gray-800/40 rounded-xl overflow-hidden border border-gray-800/40 bg-gray-900/40">
          {lista.map((item) => (
            <li
              key={item.id}
              className="p-4 flex items-center justify-between hover:bg-gray-800/40 transition"
            >
              <div>
                <h2 className="font-semibold">{item.treinos?.titulo}</h2>
                <p className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString("pt-BR")}
                </p>
              </div>

              <button
                onClick={() => router.push(`/treinos/${item.treino_id}`)}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm"
              >
                Ver treino <ChevronRight className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
