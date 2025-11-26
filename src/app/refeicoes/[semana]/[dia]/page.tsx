"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Info } from "lucide-react";

type Ingrediente = {
  nome: string;
  quantidade: string;
  unidade: string;
};

type Refeicao = {
  refeicao_tipo: string; // chave técnica (cafe, almoco, etc)
  titulo: string;
  descricao: string;
  ingredientes: Ingrediente[];
};

type PageProps = {
  params: {
    semana: string; // ex: 2025-48
    dia: string; // ex: "0"
  };
};

const BASE_REFEICOES: Refeicao[] = [
  {
    refeicao_tipo: "cafe",
    titulo: "Café da manhã",
    descricao: "Início do dia: energia e saciedade.",
    ingredientes: [
      { nome: "", quantidade: "100", unidade: "g" },
    ],
  },
  {
    refeicao_tipo: "lanche_manha",
    titulo: "Lanche da manhã",
    descricao: "Pequeno lanche para manter a energia.",
    ingredientes: [{ nome: "", quantidade: "1", unidade: "un" }],
  },
  {
    refeicao_tipo: "almoco",
    titulo: "Almoço",
    descricao: "Refeição principal do dia.",
    ingredientes: [
      { nome: "", quantidade: "100", unidade: "g" },
    ],
  },
  {
    refeicao_tipo: "lanche_tarde",
    titulo: "Lanche da tarde",
    descricao: "Ajuda a não chegar com muita fome à noite.",
    ingredientes: [{ nome: "", quantidade: "1", unidade: "un" }],
  },
  {
    refeicao_tipo: "pre_treino",
    titulo: "Pré-treino (opcional)",
    descricao:
      "Foco em energia rápida. Se você não treina, pode ignorar essa refeição.",
    ingredientes: [{ nome: "", quantidade: "1", unidade: "un" }],
  },
  {
    refeicao_tipo: "pos_treino",
    titulo: "Pós-treino (opcional)",
    descricao:
      "Ajuda na recuperação muscular. Se você não treina, pode ignorar essa refeição.",
    ingredientes: [{ nome: "", quantidade: "1", unidade: "un" }],
  },
  {
    refeicao_tipo: "jantar",
    titulo: "Jantar",
    descricao: "Fechamento do dia, mais leve e equilibrado.",
    ingredientes: [
      { nome: "", quantidade: "100", unidade: "g" },
    ],
  },
  {
    refeicao_tipo: "ceia",
    titulo: "Ceia (opcional)",
    descricao: "Lanchinho leve antes de dormir, se você sentir necessidade.",
    ingredientes: [{ nome: "", quantidade: "1", unidade: "un" }],
  },
];

export default function PlanejamentoRefeicoesDiaPage({ params }: PageProps) {
  const { supabase, session, loading: loadingSession } = useSupabase();
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>(BASE_REFEICOES);
  const [loadingDia, setLoadingDia] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const semana = params.semana;
  const diaNumero = Number(params.dia || 0);

  // Helpers de estado
  function atualizarIngrediente(
    refeicaoIndex: number,
    ingredienteIndex: number,
    campo: keyof Ingrediente,
    valor: string
  ) {
    setRefeicoes((prev) => {
      const clone = structuredClone(prev) as Refeicao[];
      clone[refeicaoIndex].ingredientes[ingredienteIndex][campo] = valor;
      return clone;
    });
  }

  function adicionarIngrediente(refeicaoIndex: number) {
    setRefeicoes((prev) => {
      const clone = structuredClone(prev) as Refeicao[];
      clone[refeicaoIndex].ingredientes.push({
        nome: "",
        quantidade: "100",
        unidade: "g",
      });
      return clone;
    });
  }

  function removerIngrediente(refeicaoIndex: number, ingredienteIndex: number) {
    setRefeicoes((prev) => {
      const clone = structuredClone(prev) as Refeicao[];
      clone[refeicaoIndex].ingredientes.splice(ingredienteIndex, 1);
      if (clone[refeicaoIndex].ingredientes.length === 0) {
        clone[refeicaoIndex].ingredientes.push({
          nome: "",
          quantidade: "100",
          unidade: "g",
        });
      }
      return clone;
    });
  }

  // Carregar dados salvos do dia
  useEffect(() => {
    async function carregar() {
      if (!session?.user || !supabase) return;
      setLoadingDia(true);
      setErro(null);
      setSucesso(null);

      const { data, error } = await supabase
        .from("refeicoes_semanais")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("semana", semana)
        .eq("dia", diaNumero)
        .order("refeicao_tipo", { ascending: true });

      if (error) {
        console.error(error);
        setErro("Erro ao carregar refeições deste dia.");
        setLoadingDia(false);
        return;
      }

      if (!data || data.length === 0) {
        // nada salvo ainda → mantém BASE_REFEICOES
        setRefeicoes(BASE_REFEICOES);
        setLoadingDia(false);
        return;
      }

      // Monta refeicoes com base na BASE, preenchendo ingredientes do banco
      const basePorTipo = Object.fromEntries(
        BASE_REFEICOES.map((r) => [r.refeicao_tipo, r])
      );

      const preenchidas: Refeicao[] = BASE_REFEICOES.map((r) => {
        const encontrado = data.find(
          (row: any) => row.refeicao_tipo === r.refeicao_tipo
        );
        if (!encontrado) return r;

        return {
          ...r,
          titulo: encontrado.titulo || r.titulo,
          descricao: encontrado.descricao || r.descricao,
          ingredientes: Array.isArray(encontrado.ingredientes)
            ? encontrado.ingredientes
            : r.ingredientes,
        };
      });

      setRefeicoes(preenchidas);
      setLoadingDia(false);
    }

    if (!loadingSession && session?.user && supabase) {
      carregar();
    }
  }, [loadingSession, session, supabase, semana, diaNumero]);

  // Salvar no Supabase
  async function salvarPlano() {
    if (!session?.user || !supabase) return;
    setSalvando(true);
    setErro(null);
    setSucesso(null);

    try {
      // 1) Apaga tudo desse user/semana/dia
      const { error: delError } = await supabase
        .from("refeicoes_semanais")
        .delete()
        .eq("user_id", session.user.id)
        .eq("semana", semana)
        .eq("dia", diaNumero);

      if (delError) {
        console.error(delError);
        setErro("Erro ao limpar dados antigos deste dia.");
        setSalvando(false);
        return;
      }

      // 2) Insere o plano atual
      const payload = refeicoes.map((r) => ({
        user_id: session.user.id,
        semana,
        dia: diaNumero,
        refeicao_tipo: r.refeicao_tipo,
        titulo: r.titulo,
        descricao: r.descricao,
        ingredientes: r.ingredientes,
        calorias: null, // IA vai preencher no futuro
      }));

      const { error: insertError } = await supabase
        .from("refeicoes_semanais")
        .insert(payload);

      if (insertError) {
        console.error(insertError);
        setErro("Erro ao salvar o planejamento do dia.");
        setSalvando(false);
        return;
      }

      setSucesso("Planejamento do dia salvo com sucesso ✨");
    } finally {
      setSalvando(false);
    }
  }

  const deslogada = !loadingSession && !session?.user;

  if (deslogada) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100">
        Você precisa estar logada para planejar suas refeições 😊
      </div>
    );
  }

  if (loadingDia || loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const tituloDia = `Dia ${diaNumero}`;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Cabeçalho */}
        <section className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-semibold">
            Refeições do dia
          </span>
          <h1 className="text-2xl md:text-3xl font-bold">
            Planejamento de refeições – {tituloDia}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
            Organize o que você come ao longo do dia. Cada refeição tem lista de
            ingredientes com quantidade e unidade. No futuro, o Emagrify vai
            calcular calorias automaticamente com IA.
          </p>
        </section>

        {/* Aviso sobre pré/pós-treino */}
        <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 flex gap-3 items-start text-sm text-amber-100">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p>
            <span className="font-semibold">Sobre pré e pós-treino:</span>{" "}
            Se você não treina, pode ignorar essas refeições sem problema. Elas
            são opcionais e pensadas para quem faz atividade física.
          </p>
        </section>

        {/* Alertas */}
        {erro && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {sucesso}
          </div>
        )}

        {/* Lista de refeições */}
        <section className="space-y-6">
          {refeicoes.map((refeicao, rIndex) => (
            <div
              key={refeicao.refeicao_tipo}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/70 p-4 md:p-5 space-y-4"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{refeicao.titulo}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
                  {refeicao.descricao}
                </p>
              </div>

              <div className="space-y-3">
                {refeicao.ingredientes.map((ing, iIndex) => (
                  <div
                    key={iIndex}
                    className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr),minmax(0,1fr),minmax(0,1fr),auto] gap-2 items-center"
                  >
                    <Input
                      placeholder="Ex: Arroz integral, frango grelhado..."
                      value={ing.nome}
                      onChange={(e) =>
                        atualizarIngrediente(
                          rIndex,
                          iIndex,
                          "nome",
                          e.target.value
                        )
                      }
                      className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                    />

                    <Input
                      type="number"
                      min={0}
                      value={ing.quantidade}
                      onChange={(e) =>
                        atualizarIngrediente(
                          rIndex,
                          iIndex,
                          "quantidade",
                          e.target.value
                        )
                      }
                      className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                    />

                    <select
                      value={ing.unidade}
                      onChange={(e) =>
                        atualizarIngrediente(
                          rIndex,
                          iIndex,
                          "unidade",
                          e.target.value
                        )
                      }
                      className="h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-2 text-sm"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">L</option>
                      <option value="un">un</option>
                      <option value="colher">colher</option>
                      <option value="xícara">xícara</option>
                      <option value="fatia">fatia</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => removerIngrediente(rIndex, iIndex)}
                      className="text-xs text-red-400 hover:text-red-300 px-2"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-1 flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => adicionarIngrediente(rIndex)}
                  className="border-emerald-500/60 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                >
                  + Adicionar ingrediente
                </Button>
              </div>
            </div>
          ))}
        </section>

        {/* Botão salvar geral */}
        <section className="pt-4 flex justify-end">
          <Button
            onClick={salvarPlano}
            disabled={salvando}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 font-semibold"
          >
            {salvando ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando…
              </span>
            ) : (
              "Salvar plano do dia"
            )}
          </Button>
        </section>
      </main>
    </div>
  );
}
