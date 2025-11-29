"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Loader2, Dumbbell, ChevronRight, ChevronLeft } from "lucide-react";

export default function TreinosPage() {
  const { supabase } = useSupabase();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    objetivo: "",
    nivel: "",
    idade: "",
    altura: "",
    peso: "",
    energia: "",
    dores: "",
    preferencias: "",
    restricoes: "",
    regioesFoco: "",
  });

  function update(k: string, v: string) {
    setForm((old) => ({ ...old, [k]: v }));
  }

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

    window.location.href = `/treinos/${data.id}`;
  }

  // CAMPO REUTILIZÁVEL
  const Campo = ({ label, value, onChange, placeholder }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-900/60 border border-gray-700 p-3 rounded-xl outline-none focus:border-emerald-400 transition"
      />
    </div>
  );

  // CARD
  const Card = ({ children }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-gray-800 px-6 py-8 rounded-2xl w-full max-w-xl mx-auto flex flex-col gap-6"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center gap-3 mb-10">
          <Dumbbell className="w-7 h-7 text-emerald-400" />
          <h1 className="text-3xl font-bold">Treino Adaptado com IA</h1>
        </div>

        {/* PASSO 1 */}
        {step === 1 && (
          <Card>
            <h2 className="text-xl font-semibold">Sobre seus Objetivos</h2>

            <Campo
              label="Objetivo"
              value={form.objetivo}
              placeholder="Ex: perder peso, hipertrofia..."
              onChange={(v: any) => update("objetivo", v)}
            />

            <Campo
              label="Nível atual"
              value={form.nivel}
              placeholder="Iniciante, intermediário, avançado"
              onChange={(v: any) => update("nivel", v)}
            />

            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-emerald-500 hover:bg-emerald-600 w-full py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
            >
              Próximo <ChevronRight />
            </button>
          </Card>
        )}

        {/* PASSO 2 */}
        {step === 2 && (
          <Card>
            <h2 className="text-xl font-semibold">Sobre Você</h2>

            <Campo
              label="Idade"
              value={form.idade}
              placeholder="Sua idade"
              onChange={(v: any) => update("idade", v)}
            />

            <Campo
              label="Altura (cm)"
              value={form.altura}
              placeholder="Ex: 175"
              onChange={(v: any) => update("altura", v)}
            />

            <Campo
              label="Peso (kg)"
              value={form.peso}
              placeholder="Ex: 80"
              onChange={(v: any) => update("peso", v)}
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
          </Card>
        )}

        {/* PASSO 3 */}
        {step === 3 && (
          <Card>
            <h2 className="text-xl font-semibold">Preferências e Limitações</h2>

            <Campo
              label="Energia / disposição"
              value={form.energia}
              placeholder="Alta, média, baixa..."
              onChange={(v: any) => update("energia", v)}
            />

            <Campo
              label="Dores / limitações"
              value={form.dores}
              placeholder="Ex: joelho, lombar, nenhum..."
              onChange={(v: any) => update("dores", v)}
            />

            <Campo
              label="Preferências"
              value={form.preferencias}
              placeholder="Ex: pesos livres, funcional..."
              onChange={(v: any) => update("preferencias", v)}
            />

            <Campo
              label="Restrições"
              value={form.restricoes}
              placeholder="Ex: sem impacto, sem cardio..."
              onChange={(v: any) => update("restricoes", v)}
            />

            <Campo
              label="Regiões de foco"
              value={form.regioesFoco}
              placeholder="Ex: glúteos, abdômen, costas..."
              onChange={(v: any) => update("regioesFoco", v)}
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
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Gerar Treino <ChevronRight />
                  </>
                )}
              </button>
            </div>
          </Card>
        )}

      </main>
    </div>
  );
}
