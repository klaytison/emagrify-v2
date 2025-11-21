"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// cliente Supabase para pegar o usuário logado no front
import { supabaseClient } from "@/lib/supabaseClient";

const supabase = supabaseClient();


interface DietPlan {
  id: string;
  objetivo: string | null;
  preferencias: string | null;
  restricoes: string | null;
  plano: {
    cafe?: string;
    lanche_manha?: string;
    almoco?: string;
    lanche_tarde?: string;
    jantar?: string;
    [key: string]: any;
  };
  created_at: string;
}

export default function DietasPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [objetivo, setObjetivo] = useState("");
  const [preferencias, setPreferencias] = useState("");
  const [restricoes, setRestricoes] = useState("");

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lastPlan, setLastPlan] = useState<DietPlan | null>(null);

  // 1) Buscar usuário logado
useEffect(() => {
  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      setUserId(session.user.id);
      setError(null);
    } else {
      setError("Nenhum usuário logado.");
    }

    setLoadingUser(false);
  };

  getSession();
}, []);

  // 2) Buscar última dieta salva para o usuário
  useEffect(() => {
    const loadLastPlan = async () => {
      if (!userId) return;
      setLoadingPlan(true);
      setError(null);

      try {
        const res = await fetch(`/api/dietas?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.plan) {
          setLastPlan(data.plan);
        } else if (!res.ok && data.error) {
          // se não tiver plano ainda, não é erro grave
          console.warn(data.error);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar sua última dieta.");
      } finally {
        setLoadingPlan(false);
      }
    };

    loadLastPlan();
  }, [userId]);

  // 3) Enviar para API e gerar nova dieta
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("Você precisa estar logada para gerar a dieta.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/dietas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          objetivo: objetivo || null,
          preferencias: preferencias || null,
          restricoes: restricoes || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        setError(data.error || "Erro ao gerar dieta.");
        return;
      }

      if (data.plan) {
        setLastPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  const hasEnvError = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7BE4B7]/15 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-[#7BE4B7]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Dietas Personalizadas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gere planos alimentares com IA com base no seu objetivo, rotina e preferências.
            </p>
          </div>
        </div>

        {hasEnvError && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 px-4 py-3 text-sm">
            As variáveis <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> precisam estar configuradas.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Estado de usuário/carregamento */}
        {loadingUser ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando usuário…
          </div>
        ) : !userId ? (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-900 px-4 py-3 text-sm">
            Nenhum usuário logado. Acesse sua conta para salvar e visualizar suas dietas.
          </div>
        ) : null}

        {/* Formulário para gerar dieta */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Gerar nova dieta</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Informe seu objetivo, preferências e restrições. O sistema gera um plano base,
              que você pode ajustar depois.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Objetivo principal
                </label>
                <input
                  type="text"
                  placeholder="Ex: Perder 5kg em 3 meses, ganhar massa magra, definir abdômen…"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Preferências alimentares
                </label>
                <textarea
                  placeholder="Ex: Prefiro almoço mais reforçado, gosto de ovos, iogurte, frutas específicas…"
                  value={preferencias}
                  onChange={(e) => setPreferencias(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Restrições / observações
                </label>
                <textarea
                  placeholder="Ex: Intolerância à lactose, evitar glúten, não como carne vermelha…"
                  value={restricoes}
                  onChange={(e) => setRestricoes(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={saving || !userId}
                className="w-full md:w-auto bg-[#7BE4B7] hover:bg-[#62cfa2] text-white font-semibold"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando dieta…
                  </span>
                ) : (
                  "Gerar dieta com IA"
                )}
              </Button>

              {!userId && (
                <p className="text-xs text-gray-500 mt-1">
                  Faça login para que sua dieta seja salva na sua conta.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Última dieta gerada */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Última dieta gerada</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Visualize o plano mais recente gerado para você.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPlan && !lastPlan ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando dieta…
              </div>
            ) : !lastPlan ? (
              <p className="text-sm text-gray-500">
                Nenhuma dieta gerada ainda. Preencha o formulário acima para criar sua
                primeira dieta personalizada.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Gerada em{" "}
                  {new Date(lastPlan.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {lastPlan.objetivo && (
                  <p>
                    <span className="font-medium">Objetivo:</span> {lastPlan.objetivo}
                  </p>
                )}

                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(lastPlan.plano || {}).map(([refeicao, texto]) => (
                    <div
                      key={refeicao}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white/70 dark:bg-gray-900"
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                        {refeicao
                          .replace("_", " ")
                          .replace("manha", "manhã")
                          .toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        {String(texto)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
