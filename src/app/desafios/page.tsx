"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Loader2, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Desafio = {
  id: string;
  user_id: string;
  semana: string;
  titulo: string;
  descricao: string;
  progresso: boolean[];
};

export default function DesafiosSemanaisPage() {
  const { session } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [progresso, setProgresso] = useState<boolean[]>(
    new Array(7).fill(false)
  );

  // Carregar desafio da semana
  async function carregarDesafio() {
    if (!session?.user?.id) return;

    setLoading(true);

    try {
      const res = await fetch("/api/desafios/semana", {
        headers: {
          "x-user-id": session.user.id,
        },
      });

      const data = await res.json();

      if (data?.desafio) {
        setDesafio(data.desafio);
        setProgresso(data.desafio.progresso || new Array(7).fill(false));
      }
    } catch (e) {
      console.error("Erro ao carregar desafio:", e);
    }

    setLoading(false);
  }

  // Salvar progresso semanal
  async function salvarProgresso() {
    if (!session?.user?.id) return;
    setSalvando(true);

    try {
      const res = await fetch("/api/desafios/semana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          progresso,
        }),
      });

      const data = await res.json();
      if (data?.desafio) setDesafio(data.desafio);
    } catch (e) {
      console.error("Erro ao salvar progresso:", e);
    }

    setSalvando(false);
  }

  // Carregar assim que o usuário estiver logado
  useEffect(() => {
    carregarDesafio();
  }, [session]);

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Você precisa estar logada para acessar seus desafios semanais 😊
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Cabeçalho */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 text-xs rounded-full font-semibold">
            <Target className="w-3 h-3" />
            Desafios Semanais
          </div>

          <h1 className="text-3xl font-bold">{desafio?.titulo}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {desafio?.descricao}
          </p>
        </section>

        {/* Barra de progresso */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Seu progresso</h2>

          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{
                width: `${(progresso.filter(Boolean).length / 7) * 100}%`,
              }}
            />
          </div>

          <p className="text-sm text-gray-500">
            {progresso.filter(Boolean).length} de 7 dias completos
          </p>
        </section>

        {/* Dias da semana */}
        <section className="grid grid-cols-7 gap-3">
          {["S", "T", "Q", "Q", "S", "S", "D"].map((dia, index) => (
            <button
              key={index}
              onClick={() => {
                const novo = [...progresso];
                novo[index] = !novo[index];
                setProgresso(novo);
              }}
              className={`p-4 rounded-xl border text-center transition ${
                progresso[index]
                  ? "bg-emerald-500 text-white border-emerald-600"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500"
              }`}
            >
              {progresso[index] ? (
                <CheckCircle2 className="w-5 h-5 mx-auto" />
              ) : (
                dia
              )}
            </button>
          ))}
        </section>

        {/* Botões finais */}
        <section className="pt-6 flex justify-between items-center">

          {/* LINK PARA O HISTÓRICO */}
          <Link
            href="/desafios/historico"
            className="text-sm text-gray-400 underline hover:text-gray-300 transition"
          >
            Ver histórico de semanas anteriores →
          </Link>

          <Button
            onClick={salvarProgresso}
            disabled={salvando}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
          >
            {salvando ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Salvar progresso semanal"
            )}
          </Button>
        </section>
      </main>
    </div>
  );
}
