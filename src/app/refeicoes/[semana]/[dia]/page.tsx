"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UtensilsCrossed,
  Loader2,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type MealKey = "cafe" | "almoco" | "jantar" | "pre_treino" | "pos_treino";

type Ingredient = {
  nome: string;
  quantidade: string; // mantemos como string no formulário
  unidade: "g" | "ml" | "un";
  calorias?: string; // preparado para futuro cálculo
};

type Refeicao = {
  chave: MealKey;
  titulo: string;
  ingredientes: Ingredient[];
};

type RefeicoesRow = {
  id: string;
  user_id: string;
  semana: string;
  dia: number;
  refeicoes: Refeicao[];
  created_at?: string;
};

const MEALS: { key: MealKey; titulo: string; description?: string }[] = [
  {
    key: "cafe",
    titulo: "Café da manhã",
    description: "Início do dia: energia e saciedade.",
  },
  {
    key: "almoco",
    titulo: "Almoço",
    description: "Refeição principal do dia.",
  },
  {
    key: "jantar",
    titulo: "Jantar",
    description: "Fechando o dia sem pesar.",
  },
  {
    key: "pre_treino",
    titulo: "Pré-treino",
    description: "Combustível para treinar melhor.",
  },
  {
    key: "pos_treino",
    titulo: "Pós-treino",
    description: "Recuperação muscular e reposição.",
  },
];

function criarRefeicoesPadrao(): Refeicao[] {
  return MEALS.map((m) => ({
    chave: m.key,
    titulo: m.titulo,
    ingredientes: [
      {
        nome: "",
        quantidade: "",
        unidade: "g",
        calorias: "",
      },
    ],
  }));
}

export default function RefeicoesDiaPage() {
  const params = useParams();
  const { supabase, session, loading: loadingSession } = useSupabase();

  const semana = params?.semana as string;
  const diaParam = params?.dia as string;

  const [refeicoes, setRefeicoes] = useState<Refeicao[]>(criarRefeicoesPadrao);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Carregar dados do dia
  async function carregarRefeicoes() {
    if (!session?.user?.id || !semana || !diaParam) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      const { data, error } = await supabase
        .from("refeicoes_semanais")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("semana", semana)
        .eq("dia", Number(diaParam))
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Erro ao carregar refeições:", error);
        setErro("Erro ao carregar suas refeições deste dia.");
        setLoading(false);
        return;
      }

      if (data && data.refeicoes) {
        setRefeicoes(data.refeicoes as Refeicao[]);
      } else {
        setRefeicoes(criarRefeicoesPadrao());
      }
    } catch (e) {
      console.error(e);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  // Primeiro carregamento
  useEffect(() => {
    if (!loadingSession) {
      if (session?.user) {
        carregarRefeicoes();
      } else {
        setLoading(false);
      }
    }
  }, [loadingSession, session, semana, diaParam]);

  // Handlers de ingredientes
  function atualizarIngrediente(
    mealKey: MealKey,
    index: number,
    campo: keyof Ingredient,
    valor: string
  ) {
    setRefeicoes((prev) =>
      prev.map((ref) =>
        ref.chave === mealKey
          ? {
              ...ref,
              ingredientes: ref.ingredientes.map((ing, i) =>
                i === index ? { ...ing, [campo]: valor } : ing
              ),
            }
          : ref
      )
    );
  }

  function adicionarIngrediente(mealKey: MealKey) {
    setRefeicoes((prev) =>
      prev.map((ref) =>
        ref.chave === mealKey
          ? {
              ...ref,
              ingredientes: [
                ...ref.ingredientes,
                { nome: "", quantidade: "", unidade: "g", calorias: "" },
              ],
            }
          : ref
      )
    );
  }

  function removerIngrediente(mealKey: MealKey, index: number) {
    setRefeicoes((prev) =>
      prev.map((ref) =>
        ref.chave === mealKey
          ? {
              ...ref,
              ingredientes:
                ref.ingredientes.length <= 1
                  ? ref.ingredientes // nunca deixa zero ingredientes
                  : ref.ingredientes.filter((_, i) => i !== index),
            }
          : ref
      )
    );
  }

  // Salvar no Supabase
  async function salvarRefeicoes() {
    if (!session?.user) {
      setErro("Você precisa estar logada para salvar suas refeições.");
      return;
    }

    if (!semana || !diaParam) {
      setErro("Informações de semana ou dia inválidas.");
      return;
    }

    setErro(null);
    setSucesso(null);
    setSalvando(true);

    try {
      const payload: Partial<RefeicoesRow> = {
        user_id: session.user.id,
        semana,
        dia: Number(diaParam),
        refeicoes,
      };

      const { data, error } = await supabase
        .from("refeicoes_semanais")
        .upsert(payload, {
          onConflict: "user_id,semana,dia",
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error("Erro ao salvar refeições:", error);
        setErro("Erro ao salvar suas refeições. Tente novamente.");
        return;
      }

      setSucesso("Refeições salvas com sucesso ✨");
      if (data?.refeicoes) {
        setRefeicoes(data.refeicoes as Refeicao[]);
      }
    } catch (e) {
      console.error(e);
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  const deslogada = !loadingSession && !session?.user;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (deslogada) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 px-4">
        <Header />
        <div className="mt-10 text-center max-w-md space-y-3">
          <p className="text-lg font-semibold">
            Você precisa estar logada para acessar suas refeições da semana.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entre na sua conta para salvar e acompanhar seu plano diário de alimentação.
          </p>
        </div>
      </div>
    );
  }

  const diaLabel = (() => {
    const n = Number(diaParam);
    const nomes = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    return nomes[n - 1] ?? `Dia ${diaParam}`;
  })();

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-10 space-y-8">
        {/* Cabeçalho */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-semibold">
              <UtensilsCrossed className="w-3 h-3" />
              Refeições do dia
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Planejamento de refeições – {diaLabel}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Organize o que você come ao longo do dia. Cada refeição tem lista
              de ingredientes com quantidade e unidade. No futuro, o Emagrify vai
              calcular calorias automaticamente com IA.
            </p>
          </div>

          <div className="text-sm rounded-2xl border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 space-y-1 max-w-xs">
            <p className="font-semibold text-emerald-400 text-xs uppercase tracking-wide">
              Sobre pré e pós-treino
            </p>
            <p className="text-[11px] text-gray-600 dark:text-gray-300">
              <span className="font-medium">Se você não treina</span>, pode
              ignorar as refeições de <b>pré-treino</b> e <b>pós-treino</b> sem problema.
            </p>
          </div>
        </section>

        {/* Alertas */}
        <AnimatePresence>
          {erro && (
            <motion.div
              key="erro"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {erro}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {sucesso && (
            <motion.div
              key="sucesso"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
            >
              {sucesso}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de refeições */}
        <section className="space-y-6">
          {refeicoes.map((ref) => {
            const meta = MEALS.find((m) => m.key === ref.chave);

            const isTreino =
              ref.chave === "pre_treino" || ref.chave === "pos_treino";

            return (
              <motion.div
                key={ref.chave}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/70 p-4 md:p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-base md:text-lg font-semibold">
                      {ref.titulo}
                    </h2>
                    {meta?.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {meta.description}
                      </p>
                    )}
                    {isTreino && (
                      <p className="flex items-center gap-1 text-[11px] text-amber-400 mt-1">
                        <Info className="w-3 h-3" />
                        Se você não treina, pode ignorar esta refeição.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {ref.ingredientes.map((ing, index) => (
                    <motion.div
                      key={`${ref.chave}-${index}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="grid md:grid-cols-[2fr,1.2fr,1.2fr,auto] gap-3 items-end rounded-xl bg-white/70 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800 px-3 py-3"
                    >
                      {/* Nome */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-500 dark:text-gray-400">
                          Alimento / ingrediente
                        </label>
                        <Input
                          value={ing.nome}
                          onChange={(e) =>
                            atualizarIngrediente(
                              ref.chave,
                              index,
                              "nome",
                              e.target.value
                            )
                          }
                          placeholder="Ex: Arroz integral, frango grelhado…"
                          className="bg-gray-100/60 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                        />
                      </div>

                      {/* Quantidade */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-500 dark:text-gray-400">
                          Quantidade
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={ing.quantidade}
                          onChange={(e) =>
                            atualizarIngrediente(
                              ref.chave,
                              index,
                              "quantidade",
                              e.target.value
                            )
                          }
                          placeholder="Ex: 100"
                          className="bg-gray-100/60 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                        />
                      </div>

                      {/* Unidade */}
                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-500 dark:text-gray-400">
                          Unidade
                        </label>
                        <Select
                          value={ing.unidade}
                          onValueChange={(v) =>
                            atualizarIngrediente(
                              ref.chave,
                              index,
                              "unidade",
                              v as Ingredient["unidade"]
                            )
                          }
                        >
                          <SelectTrigger className="bg-gray-100/60 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm">
                            <SelectValue placeholder="Unidade" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800 text-gray-50">
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="un">un</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Botão remover */}
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerIngrediente(ref.chave, index)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Botão adicionar ingrediente */}
                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adicionarIngrediente(ref.chave)}
                    className="border-emerald-500/60 text-emerald-500 hover:bg-emerald-500/10 text-xs"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar ingrediente
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Botão salvar geral */}
        <section className="flex justify-end pt-2 pb-8">
          <Button
            disabled={salvando}
            onClick={salvarRefeicoes}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 font-semibold"
          >
            {salvando ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando…
              </span>
            ) : (
              "Salvar refeições do dia"
            )}
          </Button>
        </section>
      </main>
    </motion.div>
  );
}
