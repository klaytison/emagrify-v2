"use client";

import { useEffect, useMemo, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  UtensilsCrossed,
  ShoppingBag,
  Loader2,
  Plus,
  Edit3,
} from "lucide-react";
import { motion } from "framer-motion";
import { getISOWeek, getYear } from "date-fns";

type MealType = "cafe" | "almoco" | "jantar" | "lanche";

const MEAL_TYPES: { key: MealType; label: string }[] = [
  { key: "cafe", label: "Café" },
  { key: "almoco", label: "Almoço" },
  { key: "jantar", label: "Jantar" },
  { key: "lanche", label: "Lanches" },
];

const DIAS_LABEL = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

type RefeicaoSlot = {
  id?: string;
  dia: number; // 0-6 (Seg-Dom)
  refeicao_tipo: MealType;
  titulo: string;
  descricao: string;
  ingredientesTexto: string; // multiline (vai virar array na hora de salvar)
  calorias: string; // armazenamos como string no form
};

type DbRefeicao = {
  id: string;
  user_id: string;
  semana: string;
  dia: number;
  refeicao_tipo: MealType;
  titulo: string;
  descricao: string | null;
  ingredientes: string[] | null;
  calorias: number | null;
  criado_em: string;
};

function getSemanaAtualId(date = new Date()) {
  const year = getYear(date);
  const week = getISOWeek(date);
  return `${year}-${week.toString().padStart(2, "0")}`;
}

export default function PlanejadorRefeicoesPage() {
  const { supabase, session, loading: loadingSession } = useSupabase();

  const [semanaId, setSemanaId] = useState<string>(getSemanaAtualId());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const [slots, setSlots] = useState<RefeicaoSlot[]>([]);
  const [editing, setEditing] = useState<{ dia: number; refeicao_tipo: MealType } | null>(
    null
  );

  // ---------- Helpers ----------

  function criarSlotsVazios(): RefeicaoSlot[] {
    const base: RefeicaoSlot[] = [];
    for (let dia = 0; dia < 7; dia++) {
      for (const meal of MEAL_TYPES) {
        base.push({
          dia,
          refeicao_tipo: meal.key,
          titulo: "",
          descricao: "",
          ingredientesTexto: "",
          calorias: "",
        });
      }
    }
    return base;
  }

  function aplicarDadosBanco(data: DbRefeicao[]): RefeicaoSlot[] {
    const base = criarSlotsVazios();

    for (const row of data) {
      const index = base.findIndex(
        (s) => s.dia === row.dia && s.refeicao_tipo === row.refeicao_tipo
      );
      const ingredientesTexto = (row.ingredientes ?? []).join("\n");

      if (index >= 0) {
        base[index] = {
          ...base[index],
          id: row.id,
          titulo: row.titulo,
          descricao: row.descricao ?? "",
          ingredientesTexto,
          calorias: row.calorias != null ? String(row.calorias) : "",
        };
      }
    }

    return base;
  }

  // ---------- Carregar dados da semana ----------

  async function carregarSemana(idSemana: string) {
    if (!session?.user?.id) return;
    setLoading(true);
    setErro(null);
    setSucesso(null);

    try {
      const { data, error } = await supabase
        .from("refeicoes_semanais")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("semana", idSemana)
        .order("dia", { ascending: true });

      if (error) {
        console.error(error);
        setErro("Erro ao carregar plano de refeições desta semana.");
        setSlots(criarSlotsVazios());
        return;
      }

      const rows = (data as DbRefeicao[]) ?? [];
      if (rows.length === 0) {
        setSlots(criarSlotsVazios());
      } else {
        setSlots(aplicarDadosBanco(rows));
      }
    } catch (e) {
      console.error(e);
      setErro("Erro inesperado ao carregar dados.");
      setSlots(criarSlotsVazios());
    } finally {
      setLoading(false);
    }
  }

  // ---------- Salvar semana ----------

  async function salvarSemana() {
    if (!session?.user?.id) {
      setErro("Você precisa estar logada para salvar seu plano de refeições.");
      return;
    }

    setSaving(true);
    setErro(null);
    setSucesso(null);

    try {
      // Só salva slots que tenham título preenchido
      const preenchidos = slots.filter((s) => s.titulo.trim().length > 0);

      const payload = preenchidos.map((s) => ({
        user_id: session.user!.id,
        semana: semanaId,
        dia: s.dia,
        refeicao_tipo: s.refeicao_tipo,
        titulo: s.titulo.trim(),
        descricao: s.descricao.trim() || null,
        ingredientes:
          s.ingredientesTexto
            .split(/\r?\n/)
            .map((i) => i.trim())
            .filter(Boolean) || null,
        calorias: s.calorias ? Number(s.calorias) : null,
      }));

      // Estratégia simples: apaga tudo da semana e insere de novo
      const { error: delError } = await supabase
        .from("refeicoes_semanais")
        .delete()
        .eq("user_id", session.user.id)
        .eq("semana", semanaId);

      if (delError) {
        console.error(delError);
        setErro("Erro ao limpar dados antigos da semana.");
        return;
      }

      if (payload.length > 0) {
        const { error: insertError } = await supabase
          .from("refeicoes_semanais")
          .insert(payload);

        if (insertError) {
          console.error(insertError);
          setErro("Erro ao salvar plano de refeições.");
          return;
        }
      }

      setSucesso("Plano de refeições salvo com sucesso ✨");
    } catch (e) {
      console.error(e);
      setErro("Erro inesperado ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  // ---------- Efeitos ----------

  useEffect(() => {
    if (!loadingSession && session?.user) {
      carregarSemana(semanaId);
    }
  }, [loadingSession, session, semanaId]);

  // ---------- Edição de um slot ----------

  function abrirEdicao(dia: number, refeicao_tipo: MealType) {
    setEditing({ dia, refeicao_tipo });
  }

  function atualizarSlot(
    dia: number,
    refeicao_tipo: MealType,
    field: keyof RefeicaoSlot,
    value: string
  ) {
    setSlots((prev) =>
      prev.map((s) =>
        s.dia === dia && s.refeicao_tipo === refeicao_tipo
          ? { ...s, [field]: value }
          : s
      )
    );
  }

  function getSlot(dia: number, refeicao_tipo: MealType) {
    return (
      slots.find((s) => s.dia === dia && s.refeicao_tipo === refeicao_tipo) ?? {
        dia,
        refeicao_tipo,
        titulo: "",
        descricao: "",
        ingredientesTexto: "",
        calorias: "",
      }
    );
  }

  // ---------- Lista de compras ----------

  const listaCompras = useMemo(() => {
    const mapa = new Map<string, number>();

    slots.forEach((s) => {
      s.ingredientesTexto
        .split(/\r?\n/)
        .map((i) => i.trim())
        .filter(Boolean)
        .forEach((item) => {
          const key = item.toLowerCase();
          mapa.set(key, (mapa.get(key) ?? 0) + 1);
        });
    });

    return Array.from(mapa.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([nome, qtd]) => ({ nome, qtd }));
  }, [slots]);

  // ---------- Estado global (sem sessão) ----------

  if (!loadingSession && !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Você precisa estar logada para usar o planejador de refeições 🍽️
      </div>
    );
  }

  if (loading || loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // ---------- UI ----------

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Cabeçalho */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-semibold">
              <UtensilsCrossed className="w-3 h-3" />
              Planejador de refeições
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Organize sua semana sem quebrar a cabeça
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Monte suas refeições da semana, salve seu plano e acompanhe a
              lista de compras automaticamente. No futuro, a IA do Emagrify vai
              preencher tudo para você.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CalendarDays className="w-4 h-4" />
              Semana (AAAA-W)
            </label>
            <Input
              value={semanaId}
              onChange={(e) => setSemanaId(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
            />
            <p className="text-[11px] text-gray-500 dark:text-gray-500">
              Ex: <span className="font-mono">{getSemanaAtualId()}</span> para a
              semana atual.
            </p>
          </div>
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

        {/* Grid + editor + lista de compras */}
        <section className="grid lg:grid-cols-[2.1fr,1.1fr] gap-6">
          {/* Coluna esquerda: grade + editor */}
          <div className="space-y-4">
            {/* Grade semanal */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                      Dia
                    </th>
                    {MEAL_TYPES.map((m) => (
                      <th
                        key={m.key}
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-500"
                      >
                        {m.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DIAS_LABEL.map((diaLabel, diaIndex) => (
                    <tr
                      key={diaIndex}
                      className="border-t border-gray-200/60 dark:border-gray-800/60"
                    >
                      <td className="px-3 py-2 text-xs font-semibold text-gray-500">
                        {diaLabel}
                      </td>
                      {MEAL_TYPES.map((m) => {
                        const slot = getSlot(diaIndex, m.key);
                        const hasData = slot.titulo.trim().length > 0;

                        return (
                          <td key={m.key} className="px-2 py-2 align-top">
                            <button
                              onClick={() => abrirEdicao(diaIndex, m.key)}
                              className={`w-full h-full text-left rounded-xl border text-xs p-2 transition ${
                                hasData
                                  ? "border-emerald-500/60 bg-emerald-500/5 hover:bg-emerald-500/10"
                                  : "border-dashed border-gray-400/40 bg-gray-900/5 hover:bg-gray-900/10"
                              }`}
                            >
                              {hasData ? (
                                <>
                                  <div className="flex items-center justify-between gap-1 mb-1">
                                    <span className="font-semibold line-clamp-1">
                                      {slot.titulo}
                                    </span>
                                    <Edit3 className="w-3 h-3 opacity-70" />
                                  </div>
                                  {slot.calorias && (
                                    <p className="text-[11px] text-emerald-400">
                                      {slot.calorias} kcal
                                    </p>
                                  )}
                                  {slot.ingredientesTexto && (
                                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                                      {slot.ingredientesTexto.split(/\r?\n/)[0]}
                                      {slot.ingredientesTexto.split(/\r?\n/)
                                        .length > 1 && " + ..."}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Plus className="w-3 h-3" />
                                  <span>Adicionar</span>
                                </div>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Editor da refeição selecionada */}
            {editing && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/70 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                      Editando refeição
                    </p>
                    <p className="text-sm font-semibold">
                      {DIAS_LABEL[editing.dia]} •{" "}
                      {
                        MEAL_TYPES.find((m) => m.key === editing.refeicao_tipo)
                          ?.label
                      }
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(null)}
                    className="text-xs"
                  >
                    Fechar
                  </Button>
                </div>

                {(() => {
                  const slot = getSlot(editing.dia, editing.refeicao_tipo);
                  return (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">
                            Nome da refeição
                          </label>
                          <Input
                            value={slot.titulo}
                            onChange={(e) =>
                              atualizarSlot(
                                editing.dia,
                                editing.refeicao_tipo,
                                "titulo",
                                e.target.value
                              )
                            }
                            placeholder="Ex: Frango grelhado com salada"
                            className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">
                            Calorias (opcional)
                          </label>
                          <Input
                            type="number"
                            value={slot.calorias}
                            onChange={(e) =>
                              atualizarSlot(
                                editing.dia,
                                editing.refeicao_tipo,
                                "calorias",
                                e.target.value
                              )
                            }
                            placeholder="Ex: 450"
                            className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">
                            Observações / modo de preparo (opcional)
                          </label>
                          <Textarea
                            rows={3}
                            value={slot.descricao}
                            onChange={(e) =>
                              atualizarSlot(
                                editing.dia,
                                editing.refeicao_tipo,
                                "descricao",
                                e.target.value
                              )
                            }
                            placeholder="Ex: grelhar o frango com pouco óleo, temperar com limão..."
                            className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">
                          Ingredientes (um por linha)
                        </label>
                        <Textarea
                          rows={9}
                          value={slot.ingredientesTexto}
                          onChange={(e) =>
                            atualizarSlot(
                              editing.dia,
                              editing.refeicao_tipo,
                              "ingredientesTexto",
                              e.target.value
                            )
                          }
                          placeholder={
                            "Ex:\n150g peito de frango\n100g alface\n50g tomate\nazeite de oliva"
                          }
                          className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                          Esses ingredientes serão usados para gerar sua lista de
                          compras da semana.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Botão salvar */}
            <div className="flex justify-end">
              <Button
                onClick={salvarSemana}
                disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar plano da semana"
                )}
              </Button>
            </div>
          </div>

          {/* Coluna direita: lista de compras */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/70 p-4 h-full flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-semibold">
                    Lista de compras da semana
                  </h2>
                </div>
                <span className="text-[11px] text-gray-500">
                  {listaCompras.length} itens
                </span>
              </div>

              {listaCompras.length === 0 ? (
                <p className="text-xs text-gray-500">
                  Adicione ingredientes nas refeições para ver sua lista de
                  compras aqui.
                </p>
              ) : (
                <ul className="space-y-1 text-xs max-h-[380px] overflow-auto pr-1">
                  {listaCompras.map((item) => (
                    <li
                      key={item.nome}
                      className="flex items-center justify-between rounded-lg bg-gray-900/5 dark:bg-gray-900 px-2 py-1"
                    >
                      <span className="capitalize">{item.nome}</span>
                      {item.qtd > 1 && (
                        <span className="text-[11px] text-gray-500">
                          {item.qtd}x
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              <p className="text-[11px] text-gray-500 mt-3">
                No futuro, a IA vai gerar esse plano automaticamente com base
                nas suas preferências, metas e restrições alimentares. 💚
              </p>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
