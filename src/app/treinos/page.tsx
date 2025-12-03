"use client";

import { useState } from "react";
import HeaderMenu from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Loader2, Dumbbell, ChevronRight, ChevronLeft } from "lucide-react";

import Campo from "@/components/treinos/Campo";
import CardTreino from "@/components/treinos/CardTreino";

export default function TreinosPage() {
  const { supabase } = useSupabase();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    objetivo: "",
    nivel: "",
    ambiente: "",
    tempoDisponivel: "",
    idade: "",
    altura: "",
    peso: "",
    experiencia: "",
    frequenciaSemanal: "",
    energia: "",
    dores: "",
    preferencias: "",
    restricoes: "",
    regioesFoco: "",
    equipamentos: "",
    objetivoSecundario: "",
  });

  function update(k: string, v: string) {
    setForm((old) => ({ ...old, [k]: v }));
  }

  // =======================
  // GERAR TREINO
  // =======================
  async function gerarTreino() {
    setErro("");
    setLoading(true);

    const { data, error } = await supabase.functions.invoke("treinos", {
      body: form,
    });

    setLoading(false);

    if (error || !data) {
      console.error(error);
      setErro("Não consegui gerar seu treino. Tente novamente.");
      return;
    }

    let resposta;
    try {
      resposta = JSON.parse(data);
    } catch (e) {
      console.error("Erro ao parsear retorno:", data);
      setErro("Retorno inválido do servidor.");
      return;
    }

    if (!resposta?.id) {
      console.error("Sem ID no retorno:", resposta);
      setErro("Não consegui gerar seu treino.");
      return;
    }

    window.location.href = `/treinos/${resposta.id}`;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <HeaderMenu />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-10">
          <Dumbbell className="w-7 h-7 text-emerald-400" />
          <h1 className="text-3xl font-bold">Treino Adaptado com IA</h1>
        </div>

        {/* =======================
            STEP 1 — OBJETIVOS
        ======================= */}
        {step === 1 && (
          <CardTreino>
            <h2 className="text-xl font-semibold">Sobre seus Objetivos</h2>

            <Campo
              label="Objetivo principal"
              value={form.objetivo}
              placeholder="Perder peso, hipertrofia, condicionamento..."
              onChange={(v) => update("objetivo", v)}
            />

            <Campo
              label="Nível atual"
              value={form.nivel}
              placeholder="Iniciante, intermediário, avançado"
              onChange={(v) => update("nivel", v)}
            />

            <Campo
              label="Onde você treina?"
              value={form.ambiente}
              placeholder="Casa, academia, ambos"
              onChange={(v) => update("ambiente", v)}
            />

            <Campo
              label="Tempo disponível por treino (minutos)"
              value={form.tempoDisponivel}
              placeholder="Ex: 20, 30, 45..."
              onChange={(v) => update("tempoDisponivel", v)}
            />

            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-emerald-500 hover:bg-emerald-600 w-full py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
            >
              Próximo <ChevronRight />
            </button>
          </CardTreino>
        )}

        {/* =======================
            STEP 2 — DADOS CORPORAIS
        ======================= */}
        {step === 2 && (
          <CardTreino>
            <h2 className="text-xl font-semibold">Sobre Você</h2>

            <Campo label="Idade" value={form.idade} placeholder="Sua idade" onChange={(v) => update("idade", v)} />

            <Campo label="Altura (cm)" value={form.altura} placeholder="Ex: 165" onChange={(v) => update("altura", v)} />

            <Campo label="Peso (kg)" value={form.peso} placeholder="Ex: 70" onChange={(v) => update("peso", v)} />

            <Campo
              label="Experiência com exercícios"
              value={form.experiencia}
              placeholder="0 = nunca treinou, 5 = muito experiente"
              onChange={(v) => update("experiencia", v)}
            />

            <Campo
              label="Quantos dias por semana quer treinar?"
              value={form.frequenciaSemanal}
              placeholder="Ex: 2, 3, 4, 5..."
              onChange={(v) => update("frequenciaSemanal", v)}
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-xl flex gap-2 items-center"
              >
                <ChevronLeft /> Voltar
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-emerald-500 hover:bg-emerald-600 py-3 px-4 rounded-xl flex gap-2 items-center"
              >
                Próximo <ChevronRight />
              </button>
            </div>
          </CardTreino>
        )}

        {/* =======================
            STEP 3 — PREFERÊNCIAS
        ======================= */}
        {step === 3 && (
          <CardTreino>
            <h2 className="text-xl font-semibold">Preferências e Limitações</h2>

            <Campo label="Energia / disposição" value={form.energia} placeholder="Alta, média, baixa" onChange={(v) => update("energia", v)} />

            <Campo label="Dores / limitações" value={form.dores} placeholder="Joelho, coluna, nenhum..." onChange={(v) => update("dores", v)} />

            <Campo
              label="Preferências de treino"
              value={form.preferencias}
              placeholder="Funcional, musculação, HIIT..."
              onChange={(v) => update("preferencias", v)}
            />

            <Campo
              label="Restrições"
              value={form.restricoes}
              placeholder="Sem impacto, sem corrida..."
              onChange={(v) => update("restricoes", v)}
            />

            <Campo
              label="Regiões de foco"
              value={form.regioesFoco}
              placeholder="Glúteos, abdômen, costas..."
              onChange={(v) => update("regioesFoco", v)}
            />

            <Campo
              label="Equipamentos disponíveis"
              value={form.equipamentos}
              placeholder="Nenhum, halteres, elástico, banco..."
              onChange={(v) => update("equipamentos", v)}
            />

            <Campo
              label="Objetivo secundário (opcional)"
              value={form.objetivoSecundario}
              placeholder="Ex: ganhar resistência, melhorar postura..."
              onChange={(v) => update("objetivoSecundario", v)}
            />

            {erro && <p className="text-red-400 text-sm mt-2">{erro}</p>}

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded-xl flex gap-2 items-center"
              >
                <ChevronLeft /> Voltar
              </button>

              <button
                type="button"
                onClick={gerarTreino}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 py-3 px-4 rounded-xl flex gap-2 items-center disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Gerar Treino <ChevronRight /></>}
              </button>
            </div>
          </CardTreino>
        )}
      </main>
    </div>
  );
}
