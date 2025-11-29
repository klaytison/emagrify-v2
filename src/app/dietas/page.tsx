// src/app/dietas/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UtensilsCrossed, Sparkles, Loader2 } from "lucide-react";

export default function DietasPage() {
  const [objetivo, setObjetivo] = useState("");
  const [sexo, setSexo] = useState<"feminino" | "masculino" | "outro" | "">("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [nivelAtividade, setNivelAtividade] = useState("");
  const [refeicoesPorDia, setRefeicoesPorDia] = useState("3");
  const [restricoes, setRestricoes] = useState("");
  const [preferencias, setPreferencias] = useState("");
  const [rotina, setRotina] = useState("");

  const [planoGerado, setPlanoGerado] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function gerarPlano() {
    setErro("");
    setPlanoGerado("");

    if (!objetivo || !peso || !altura) {
      setErro("Preencha pelo menos objetivo, peso e altura.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/dietas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objetivo,
          sexo,
          idade,
          peso,
          altura,
          nivelAtividade,
          refeicoesPorDia,
          restricoes,
          preferencias,
          rotina,
        }),
      });

      if (!res.ok) {
        setErro("Não consegui gerar o plano agora. Tente novamente.");
        return;
      }

      const data = await res.json();
      setPlanoGerado(data.plano || "");
    } catch (e) {
      console.error(e);
      setErro("Erro de conexão. Tente de novo em alguns instantes.");
    } finally {
      setLoading(false);
    }
  }

  // Quebra as seções "###"
  const secoes =
    planoGerado
      ?.split("###")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dietas Personalizadas com IA</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conte como você é e o que precisa. A IA monta um dia de alimentação
              sob medida para o seu objetivo.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-8">
          {/* FORMULÁRIO */}
          <section className="space-y-5">
            <div className="bg-gray-100 dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 space-y-4">
              {/* Objetivo */}
              <div>
                <label className="text-sm font-semibold">Objetivo principal</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: emagrecer 8kg, ganhar massa, definir..."
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                />
              </div>

              {/* Linha sexo + idade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Sexo</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={sexo}
                    onChange={(e) =>
                      setSexo(e.target.value as "feminino" | "masculino" | "outro" | "")
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">Idade</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Anos"
                  />
                </div>
              </div>

              {/* Peso / Altura */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Peso (kg)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Altura (cm)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                  />
                </div>
              </div>

              {/* Atividade / Refeições */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">
                    Nível de atividade
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={nivelAtividade}
                    onChange={(e) => setNivelAtividade(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="sedentária">Sedentária</option>
                    <option value="leve">Leve</option>
                    <option value="moderada">Moderada</option>
                    <option value="intensa">Intensa</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold">
                    Refeições por dia
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={refeicoesPorDia}
                    onChange={(e) => setRefeicoesPorDia(e.target.value)}
                  />
                </div>
              </div>

              {/* Restrições / preferências / rotina */}
              <div>
                <label className="text-sm font-semibold">
                  Restrições / alergias
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm min-h-[60px]"
                  value={restricoes}
                  onChange={(e) => setRestricoes(e.target.value)}
                  placeholder="Ex: não como glúten, intolerância à lactose, não como porco..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Preferências e aversões
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm min-h-[60px]"
                  value={preferencias}
                  onChange={(e) => setPreferencias(e.target.value)}
                  placeholder="Ex: amo café da manhã doce, odeio ovo, gosto de arroz e feijão..."
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Como é sua rotina no dia a dia?
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm min-h-[60px]"
                  value={rotina}
                  onChange={(e) => setRotina(e.target.value)}
                  placeholder="Trabalho, horários, se almoça fora, se come muito tarde, etc."
                />
              </div>
            </div>

            {erro && (
              <p className="text-sm text-red-400 font-medium">{erro}</p>
            )}

            <Button
              onClick={gerarPlano}
              disabled={loading}
              className="w-full py-3 text-base bg-emerald-500 hover:bg-emerald-600 font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando plano com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar plano com IA
                </>
              )}
            </Button>
          </section>

          {/* RESULTADO */}
          <section className="bg-gray-100 dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 min-h-[260px]">
            {!planoGerado && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm">
                <Sparkles className="w-8 h-8 mb-3 text-emerald-400" />
                <p>
                  Preencha seus dados ao lado e clique{" "}
                  <span className="font-semibold">“Gerar plano com IA”</span>.
                </p>
                <p>Vou montar um dia completo de alimentação só pra você.</p>
              </div>
            )}

            {planoGerado && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert max-w-none text-sm"
              >
                {secoes.map((secao, idx) => {
                  const [titulo, ...resto] = secao.split("\n");
                  const conteudo = resto.join("\n").trim();

                  return (
                    <div key={idx} className="mb-5">
                      <h3 className="text-base font-semibold text-emerald-400 mb-1">
                        {titulo}
                      </h3>
                      <p className="whitespace-pre-line text-gray-200">
                        {conteudo}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
