"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UtensilsCrossed, Sparkles, Loader2, History } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DietasPage() {
  const router = useRouter();

  // CAMPOS BÁSICOS
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

  // NOVOS CAMPOS AVANÇADOS
  const [acorda, setAcorda] = useState("");
  const [dorme, setDorme] = useState("");
  const [preferenciaSabor, setPreferenciaSabor] = useState("");
  const [madrugada, setMadrugada] = useState("");
  const [estresse, setEstresse] = useState("");
  const [cafeina, setCafeina] = useState("");
  const [treino, setTreino] = useState("");
  const [horasSentado, setHorasSentado] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [objetivoSecundario, setObjetivoSecundario] = useState("");

  // RESULTADO / STATUS
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
          acorda,
          dorme,
          preferenciaSabor,
          madrugada,
          estresse,
          cafeina,
          treino,
          horasSentado,
          orcamento,
          objetivoSecundario,
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

  const secoes =
    planoGerado
      ?.split("###")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Header />

      {/* BOTÃO HISTÓRICO */}
      <div className="w-full flex justify-end px-4 mt-4">
        <button
          onClick={() => router.push("/dietas/historico")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
        >
          <History className="w-4 h-4" />
          Histórico de Dietas
        </button>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* TÍTULO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dietas Personalizadas com IA</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Responda tudo e receba um plano totalmente personalizado.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-8">
          {/* FORMULÁRIO */}
          <section className="space-y-6">
            <div className="bg-gray-100 dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 space-y-4">

              {/* CAMPO OBJETIVO */}
              <div>
                <label className="text-sm font-semibold">Objetivo principal</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: emagrecer 8kg, ganhar massa..."
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                />
              </div>

              {/* SEXO + IDADE */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Sexo</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as any)}
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
                  />
                </div>
              </div>

              {/* PESO / ALTURA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Peso (kg)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Altura (cm)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                  />
                </div>
              </div>

              {/* ATIVIDADE + REFEIÇÕES */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Nível de atividade</label>
                  <select
                    className="mt-1 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
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
                  <label className="text-sm font-semibold">Refeições por dia</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    className="mt-1 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                    value={refeicoesPorDia}
                    onChange={(e) => setRefeicoesPorDia(e.target.value)}
                  />
                </div>
              </div>

              {/* RESTRIÇÕES */}
              <div>
                <label className="text-sm font-semibold">Restrições / Alergias</label>
                <textarea
                  className="mt-1 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm min-h-[60px]"
                  value={restricoes}
                  onChange={(e) => setRestricoes(e.target.value)}
                />
              </div>

              {/* PREFERÊNCIAS */}
              <div>
                <label className="text-sm font-semibold">Preferências e aversões</label>
                <textarea
                  className="mt-1 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm min-h-[60px]"
                  value={preferencias}
                  onChange={(e) => setPreferencias(e.target.value)}
                />
              </div>

              {/* ROTINA */}
              <div>
                <label className="text-sm font-semibold">Como é sua rotina?</label>
                <textarea
                  className="mt-1 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm min-h-[60px]"
                  value={rotina}
                  onChange={(e) => setRotina(e.target.value)}
                />
              </div>

              {/* CAMPOS AVANÇADOS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Horário que acorda</label>
                  <input
                    type="time"
                    value={acorda}
                    onChange={(e) => setAcorda(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Horário que dorme</label>
                  <input
                    type="time"
                    value={dorme}
                    onChange={(e) => setDorme(e.target.value)}
                    className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* PREFERÊNCIA DE SABOR */}
              <div>
                <label className="text-sm font-semibold">Você prefere doce ou salgado?</label>
                <select
                  value={preferenciaSabor}
                  onChange={(e) => setPreferenciaSabor(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="doce">Doce</option>
                  <option value="salgado">Salgado</option>
                </select>
              </div>

              {/* MADRUGADA */}
              <div>
                <label className="text-sm font-semibold">Come de madrugada?</label>
                <select
                  value={madrugada}
                  onChange={(e) => setMadrugada(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="não">Não</option>
                </select>
              </div>

              {/* ESTRESSE */}
              <div>
                <label className="text-sm font-semibold">Nível de estresse</label>
                <select
                  value={estresse}
                  onChange={(e) => setEstresse(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="baixo">Baixo</option>
                  <option value="médio">Médio</option>
                  <option value="alto">Alto</option>
                </select>
              </div>

              {/* CAFEÍNA */}
              <div>
                <label className="text-sm font-semibold">Consumo de cafeína</label>
                <input
                  type="text"
                  placeholder="Ex: 2 cafés ao dia"
                  value={cafeina}
                  onChange={(e) => setCafeina(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                />
              </div>

              {/* TREINO */}
              <div>
                <label className="text-sm font-semibold">Faz treino atualmente?</label>
                <select
                  value={treino}
                  onChange={(e) => setTreino(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="não">Não</option>
                </select>
              </div>

              {/* HORAS SENTADO */}
              <div>
                <label className="text-sm font-semibold">Horas por dia sentado</label>
                <input
                  type="number"
                  value={horasSentado}
                  onChange={(e) => setHorasSentado(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                />
              </div>

              {/* ORÇAMENTO */}
              <div>
                <label className="text-sm font-semibold">Orçamento diário (R$)</label>
                <input
                  type="number"
                  value={orcamento}
                  onChange={(e) => setOrcamento(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                />
              </div>

              {/* OBJETIVO SECUNDÁRIO */}
              <div>
                <label className="text-sm font-semibold">Objetivo secundário</label>
                <input
                  type="text"
                  placeholder="Ex: mais energia, humor, disposição..."
                  value={objetivoSecundario}
                  onChange={(e) => setObjetivoSecundario(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-white dark:bg-gray-950 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {erro && <p className="text-sm text-red-400 font-medium">{erro}</p>}

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
                <p>Preencha os dados e clique em "Gerar plano com IA".</p>
                <p>Vou montar um dia completo perfeito para você.</p>
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
