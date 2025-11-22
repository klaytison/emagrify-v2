"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Dumbbell, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

interface Treino {
  id: string;
  titulo: string;
  descricao: string;
  nivel: string;
  categoria: string;
  duracao: number;
  calorias: number;
  created_at: string;
}

export default function AdminTreinosPage() {
  const { supabase } = useSupabase();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTreinos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("treinos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTreinos(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTreinos();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-emerald-400" />
            Treinos cadastrados
          </h1>

          <Link
            href="/admin/treinos/novo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition text-white font-semibold"
          >
            <Plus className="w-4 h-4" />
            Novo treino
          </Link>
        </header>

        {/* Lista */}
        <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-300 gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              Carregando treinos...
            </div>
          ) : treinos.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">
              Nenhum treino cadastrado ainda.
            </p>
          ) : (
            <ul className="divide-y divide-gray-800">
              {treinos.map((t) => (
                <li key={t.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-lg">{t.titulo}</h2>
                    <p className="text-gray-400 text-sm">{t.categoria} • {t.nivel}</p>
                  </div>

                  <Link
                    href={`/admin/treinos/${t.id}`}
                    className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                  >
                    Ver detalhes
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

