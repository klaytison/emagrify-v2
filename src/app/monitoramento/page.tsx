"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  TrendingDown,
  Ruler,
  Smile,
  CalendarDays,
  Droplet,
  Flame,
} from "lucide-react";

type MonitoramentoRow = {
  id: string;
  user_id: string | null;
  dia: string;
  peso_kg: number | null;
  cintura_cm: number | null;
  quadril_cm: number | null;
  peito_cm: number | null;
  gordura_pct: number | null;
  passos: number | null;
  calorias_in: number | null;
  calorias_out: number | null;
  humor: string | null;
  notas: string | null;
  criado_em: string;
};

const hojeISO = () => new Date().toISOString().slice(0, 10);

export default function MonitoramentoPage() {
  const { supabase, session, loading: loadingSession } = useSupabase();

  const [diaSelecionado, setDiaSelecionado] = useState<string>(hojeISO());
  const [registro, setRegistro] = useState<MonitoramentoRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Campos do formulário
  const [peso, setPeso] = useState("");
  const [cintura, setCintura] = useState("");
  const [quadril, setQuadril] = useState("");
  const [peito, setPeito] = useState("");
  const [gordura, setGordura] = useState("");
  const [passos, setPassos] = useState("");
  const [calIn, setCalIn] = useState("");
  const [calOut, setCalOut] = useState("");
  const [humor, setHumor] = useState("");
  const [notas, setNotas] = useState("");

  // Carregar registro de um dia
  async function carregarRegistro(dia: string) {
    try {
      setLoading(true);
      setErro(null);
      setSucesso(null);

      const { data, error } = await supabase
        .from("monitoramento_diario")
        .select("*")
        .eq("dia", dia)
        .maybeSingle();

      if (error) {
        console.error(error);
        setErro("Erro ao carregar dados do dia.");
        return;
      }

      setRegistro(data as MonitoramentoRow | null);

      if (data) {
        setPeso(data.peso_kg?.toString() ?? "");
        setCintura(data.cintura_cm?.toString() ?? "");
        setQuadril(data.quadril_cm?.toString() ?? "");
        setPeito(data.peito_cm?.toString() ?? "");
        setGordura(data.gordura_pct?.toString() ?? "");
        setPassos(data.passos?.toString() ?? "");
        setCalIn(data.calorias_in?.toString() ?? "");
        setCalOut(data.calorias_out?.toString() ?? "");
        setHumor(data.humor ?? "");
        setNotas(data.notas ?? "");
      } else {
        // Limpar se não existir registro
        setPeso("");
        setCintura("");
        setQuadril("");
        setPeito("");
        setGordura("");
        setPassos("");
        setCalIn("");
        setCalOut("");
        setHumor("");
        setNotas("");
      }
    } finally {
      setLoading(false);
    }
  }

  // Primeiro carregamento
  useEffect(() => {
    if (!loadingSession && session?.user) {
      carregarRegistro(diaSelecionado);
    }
  }, [loadingSession, session, diaSelecionado]);

  // Salvar / atualizar registro
  async function salvarRegistro() {
    if (!session?.user) {
      setErro("Você precisa estar logada para salvar seu progresso.");
      return;
    }

    setErro(null);
    setSucesso(null);
    setSaving(true);

    try {
      const payload = {
        dia: diaSelecionado,
        peso_kg: peso ? Number(peso) : null,
        cintura_cm: cintura ? Number(cintura) : null,
        quadril_cm: quadril ? Number(quadril) : null,
        peito_cm: peito ? Number(peito) : null,
        gordura_pct: gordura ? Number(gordura) : null,
        passos: passos ? Number(passos) : null,
        calorias_in: calIn ? Number(calIn) : null,
        calorias_out: calOut ? Number(calOut) : null,
        humor: humor || null,
        notas: notas || null,
      };

      const { data, error } = await supabase
        .from("monitoramento_diario")
        .upsert(payload, {
          onConflict: "user_id,dia",
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error(error);
        setErro("Erro ao salvar dados do dia.");
        return;
      }

      setRegistro(data as MonitoramentoRow);
      setSucesso("Progresso salvo com sucesso ✨");
    } finally {
      setSaving(false);
    }
  }

  const deslogada = !loadingSession && !session?.user;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Cabeçalho */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 text-orange-400 px-3 py-1 text-xs font-semibold">
              <Activity className="w-3 h-3" />
              Monitoramento diário
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Seu progresso, dia após dia
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Registre peso, medidas, passos, calorias e humor em poucos segundos.
              O Emagrify usa esses dados para ajustar planos, desafios e treinos
              adaptados (e no futuro, a IA vai te orientar ainda mais).
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CalendarDays className="w-4 h-4" />
              Dia do registro
            </label>
            <Input
              type="date"
              value={diaSelecionado}
              onChange={(e) => setDiaSelecionado(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
            />
            <p className="text-[11px] text-gray-500 dark:text-gray-500">
              Você pode voltar em dias anteriores para revisar ou ajustar dados.
            </p>
          </div>
        </section>

        {/* Alertas */}
        {erro && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {sucesso}
          </div>
        )}
        {deslogada && (
          <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
            Você não está logada. Entre na sua conta para registrar e salvar seu
            progresso diário.
          </div>
        )}

        {/* Cards principais */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Peso & gordura
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Peso (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">% Gordura</label>
                <Input
                  type="number"
                  step="0.1"
                  value={gordura}
                  onChange={(e) => setGordura(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Medidas
              </span>
              <Ruler className="w-4 h-4 text-sky-400" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Cintura</label>
                <Input
                  type="number"
                  value={cintura}
                  onChange={(e) => setCintura(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Quadril</label>
                <Input
                  type="number"
                  value={quadril}
                  onChange={(e) => setQuadril(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Peito</label>
                <Input
                  type="number"
                  value={peito}
                  onChange={(e) => setPeito(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Atividade & calorias
              </span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Passos</label>
                <Input
                  type="number"
                  value={passos}
                  onChange={(e) => setPassos(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Calorias in</label>
                <Input
                  type="number"
                  value={calIn}
                  onChange={(e) => setCalIn(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Calorias out</label>
                <Input
                  type="number"
                  value={calOut}
                  onChange={(e) => setCalOut(e.target.value)}
                  className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Humor + notas */}
        <section className="grid md:grid-cols-[1.2fr,1.8fr] gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold">Como você se sentiu hoje?</span>
            </div>
            <Input
              placeholder="Ex: Motivada, cansada, com dor de cabeça, mais confiante…"
              value={humor}
              onChange={(e) => setHumor(e.target.value)}
              className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
            />
            <p className="text-[11px] text-gray-500">
              Isso ajuda a identificar gatilhos de compulsão, TPM, estresse, etc.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/70 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-semibold">Anotações do dia</span>
            </div>
            <Textarea
              rows={3}
              placeholder="Ex: Dormi pouco, pulei o treino, comi fora, menstruação começou, fiz caminhada extra…"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="bg-gray-900/5 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
            />
          </div>
        </section>

        {/* Botão salvar */}
        <section className="flex justify-end pt-2">
          <Button
            disabled={saving || deslogada}
            onClick={salvarRegistro}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 font-semibold"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando…
              </span>
            ) : (
              "Salvar progresso de hoje"
            )}
          </Button>
        </section>
      </main>
    </div>
  );
}
