"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { Loader2, Dumbbell } from "lucide-react";

export default function TreinosPage() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState("");

  // -----------------------------
  // QUIZ – CAMPOS
  // -----------------------------
  const [form, setForm] = useState({
    objetivoPrincipal: "",
    nivelTreino: "",
    ambiente: "",
    diasPorSemana: "",
    minutosPorTreino: "",
    sexo: "",
    idade: "",
    altura: "",
    peso: "",
    condicoes: "",
    tipoCorpo: "",
    energia: "",
    preferenciasTreino: "",
    restricoes: "",
    focoRegioes: "",
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // -----------------------------
  // ENVIAR PARA API
  // -----------------------------
  async function gerarTreino() {
    setErro("");
    setResultado("");
    setLoading(true);

    try {
      const res = await fetch("/api/treinos-adaptados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro desconhecido.");
      } else {
        setResultado(data.plano); // texto completo
      }
    } catch (err) {
      setErro("Erro ao gerar treino.");
    }

    setLoading(false);
  }

  // -----------------------------
  // COMPONENTE
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* TÍTULO */}
        <div className="flex items-center gap-3 mb-8">
          <Dumbbell className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-bold">
            Treino Adaptado com IA
          </h1>
        </div>

        {/* FORM */}
        <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl mb-10">
          <h2 className="text-lg font-semibold mb-4">
            Responda o Quiz para gerar um treino perfeito para você:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Objetivo */}
            <input
              name="objetivoPrincipal"
              placeholder="Objetivo principal"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            />

            {/* Nível */}
            <select
              name="nivelTreino"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            >
              <option value="">Nível de treino</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>

            {/* Ambiente */}
            <select
              name="ambiente"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            >
              <option value="">Ambiente de treino</option>
              <option value="academia">Academia</option>
              <option value="casa-com-equip">Casa (com equipamentos)</option>
              <option value="casa-sem-equip">Casa (sem equipamentos)</option>
            </select>

            <input
              name="diasPorSemana"
              placeholder="Dias de treino por semana"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            />

            <input
              name="minutosPorTreino"
              placeholder="Minutos por treino"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            />

            {/* Dados pessoais */}
            <input
              name="sexo"
              placeholder="Sexo"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            />
            <input
              name="idade"
              placeholder="Idade"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            />
            <input
              name="altura"
              placeholder="Altura (cm)"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            />
            <input
              name="peso"
              placeholder="Peso (kg)"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg"
            />

            <input
              name="tipoCorpo"
              placeholder="Tipo de corpo (ectomorfo, endomorfo...)"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg md:col-span-2"
            />

            <input
              name="energia"
              placeholder="Energia / nível de disposição"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg md:col-span-2"
            />

            <input
              name="condicoes"
              placeholder="Dores / lesões / limitações"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg md:col-span-2"
            />

            <input
              name="preferenciasTreino"
              placeholder="Preferências (ex: pesos livres, funcional...)"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg md:col-span-2"
            />

            <input
              name="restricoes"
              placeholder="Restrições (ex: não quero exercícios de impacto)"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg md:col-span-2"
            />

            <input
              name="focoRegioes"
              placeholder="Regiões de foco (ex: glúteos, abdômen...)"
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 p-3 rounded-lg md:col-span-2"
            />
          </div>

          {/* ERRO */}
          {erro && (
            <p className="text-red-400 text-sm mt-4">{erro}</p>
          )}

          {/* BOTÃO GERAR */}
          <button
            onClick={gerarTreino}
            disabled={loading}
            className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Dumbbell className="w-5 h-5" /> Gerar Treino com IA
              </>
            )}
          </button>
        </div>

        {/* RESULTADO */}
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl whitespace-pre-line prose prose-invert max-w-none"
          >
            {resultado}
          </motion.div>
        )}
      </main>
    </div>
  );
}
