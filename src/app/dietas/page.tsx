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

// IMPORTAÇÃO CERTA (única)
import { supabaseClient } from "@/lib/supabaseClient";

// CLIENTE SUPABASE CORRETO
const supabase = supabaseClient();

interface DietPlan {
  id: string;
  objetivo: string | null;
  preferencias: string | null;
  restricoes: string | null;
  plano: any;
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

  // Buscar usuário logado corretamente
  useEffect(() => {
    const loadUser = async () => {
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

    loadUser();
  }, []);

  // Buscar última dieta do usuário
  useEffect(() => {
    const loadLastPlan = async () => {
      if (!userId) return;
      setLoadingPlan(true);

      try {
        const res = await fetch(`/api/dietas?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.plan) {
          setLastPlan(data.plan);
        }
      } catch {
        setError("Erro ao carregar sua última dieta.");
      }

      setLoadingPlan(false);
    };

    loadLastPlan();
  }, [userId]);

  // Criar nova dieta
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      setError("Você precisa estar logada para gerar dieta.");
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
          objetivo,
          preferencias,
          restricoes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao gerar dieta.");
        return;
      }

      setLastPlan(data.plan);
    } catch {
      setError("Erro ao conectar ao servidor.");
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7BE4B7]/15 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-[#7BE4B7]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dietas Personalizadas</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gere planos alimentares inteligentes com IA.
            </p>
          </div>
        </div>

        {/* Erros e login */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loadingUser ? (
          <p className="text-gray-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Carregando usuário…
          </p>
        ) : !userId ? (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-900 px-4 py-3 text-sm">
            Nenhum usuário logado.
          </div>
        ) : null}

        {/* Formulário */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Gerar nova dieta</CardTitle>
            <CardDescription>
              Preencha abaixo para gerar automaticamente sua dieta personalizada.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <input
                type="text"
                placeholder="Objetivo"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
              />

              <textarea
                placeholder="Preferências"
                value={preferencias}
                onChange={(e) => setPreferencias(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
              />

              <textarea
                placeholder="Restrições"
                value={restricoes}
                onChange={(e) => setRestricoes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900"
              />

              <Button
                type="submit"
                disabled={!userId || saving}
                className="bg-[#7BE4B7] hover:bg-[#62cfa2] text-white"
              >
                {saving ? "Gerando…" : "Gerar dieta com IA"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Última dieta */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Última dieta gerada</CardTitle>
          </CardHeader>

          <CardContent>
            {!lastPlan ? (
              <p className="text-gray-500">Nenhuma dieta gerada ainda.</p>
            ) : (
              <pre className="text-sm bg-black/20 p-4 rounded-lg whitespace-pre-wrap">
                {JSON.stringify(lastPlan.plano, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
