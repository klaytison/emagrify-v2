"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  CheckCircle2,
  Activity,
  UtensilsCrossed,
  Dumbbell,
  Brain,
  CalendarClock,
  LineChart,
  Droplet,
  Calculator,
  Trophy,
  Target,
  ClipboardList,
  Flame,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Aba selecionada na seção de funções avançadas
  const [activeToolTab, setActiveToolTab] = useState<
    "planejamento" | "monitoramento" | "nutricao" | "mentalidade"
  >("planejamento");

  // Mini calculadora de água diária
  const [waterWeight, setWaterWeight] = useState<string>("");
  const [waterResult, setWaterResult] = useState<string>("");

  const handleWaterCalc = () => {
    const peso = Number(waterWeight.replace(",", "."));
    if (!peso || peso <= 0) {
      setWaterResult("Informe um peso válido em kg.");
      return;
    }
    // Regra simples: 35 ml por kg
    const ml = peso * 35;
    const litros = ml / 1000;
    setWaterResult(
      `Recomendação aproximada: ${litros.toFixed(
        2
      )} L de água por dia (ajuste conforme orientação profissional).`
    );
  };

  // Mini calculadora de IMC
  const [imcWeight, setImcWeight] = useState<string>("");
  const [imcHeight, setImcHeight] = useState<string>("");
  const [imcResult, setImcResult] = useState<string>("");

  const handleImcCalc = () => {
    const peso = Number(imcWeight.replace(",", "."));
    const alturaCm = Number(imcHeight.replace(",", "."));

    if (!peso || !alturaCm || peso <= 0 || alturaCm <= 0) {
      setImcResult("Preencha peso e altura corretamente.");
      return;
    }

    const alturaM = alturaCm / 100;
    const imc = peso / (alturaM * alturaM);

    let categoria = "";
    if (imc < 18.5) categoria = "Abaixo do peso";
    else if (imc < 25) categoria = "Peso normal";
    else if (imc < 30) categoria = "Sobrepeso";
    else if (imc < 35) categoria = "Obesidade grau I";
    else if (imc < 40) categoria = "Obesidade grau II";
    else categoria = "Obesidade grau III";

    setImcResult(`Seu IMC é ${imc.toFixed(1)} (${categoria}).`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* === HERO SECTION === */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-[#7BE4B7]/10 via-white dark:via-gray-900 to-[#6ECBF5]/10">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          {/* Texto principal */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-gray-800/60 px-4 py-1 text-xs font-semibold text-[#2A2A2A] dark:text-gray-100 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
              Plataforma inteligente de emagrecimento e ganho de massa
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2A2A2A] dark:text-white leading-tight">
              Transforme seu corpo e sua{" "}
              <span className="text-[#7BE4B7]">vida</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Dietas personalizadas com IA, treinos adaptados, acompanhamento diário
              e ferramentas profissionais para você sair do efeito sanfona de vez.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white text-base md:text-lg px-8 shadow-lg hover:opacity-90"
                onClick={() => (window.location.href = "/checkout")}
              >
                Começar Agora
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#7BE4B7] text-[#2A2A2A] dark:text-white hover:bg-[#7BE4B7]/10"
                onClick={() => {
                  const el = document.getElementById("premium");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ver plano completo
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <div className="font-semibold text-[#2A2A2A] dark:text-white">
                  50k+
                </div>
                <div>Usuários ativos</div>
              </div>
              <div>
                <div className="font-semibold text-[#FF7A00]">15 kg</div>
                <div>Média de perda de peso</div>
              </div>
              <div>
                <div className="font-semibold text-[#6ECBF5]">4.9 ★</div>
                <div>Avaliação média</div>
              </div>
            </div>
          </div>

          {/* Bloco de destaques rápidos */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7BE4B7]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#6ECBF5]/25 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="rounded-3xl bg-white dark:bg-gray-800/90 shadow-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-8 h-8 text-[#7BE4B7]" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Seu plano hoje
                    </p>
                    <p className="font-semibold text-[#2A2A2A] dark:text-white">
                      Foco em emagrecimento saudável
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl bg-[#7BE4B7]/10 p-3">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Calorias alvo
                    </p>
                    <p className="font-bold text-[#2A2A2A] dark:text-white">
                      1.650 kcal
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#6ECBF5]/10 p-3">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Passos/dia
                    </p>
                    <p className="font-bold text-[#2A2A2A] dark:text-white">
                      8.000
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FF7A00]/10 p-3">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">
                      Sessões
                    </p>
                    <p className="font-bold text-[#2A2A2A] dark:text-white">
                      4x/sem
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini calculadora de água */}
              <div className="rounded-3xl bg-white/80 dark:bg-gray-800/90 shadow-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4">
                <Droplet className="w-8 h-8 text-[#6ECBF5]" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Mini calculadora de água
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Seu peso (kg)"
                      value={waterWeight}
                      onChange={(e) => setWaterWeight(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
                    />
                    <Button
                      size="sm"
                      className="bg-[#6ECBF5] hover:bg-[#6ECBF5]/90 text-white"
                      onClick={handleWaterCalc}
                    >
                      Calcular
                    </Button>
                  </div>
                  {waterResult && (
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      {waterResult}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SEÇÃO PREMIUM — PLANO PRINCIPAL === */}
      <section
        id="premium"
        className="relative py-24 bg-gradient-to-br from-white via-[#F4F4F4] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#7BE4B7]/20 to-[#6ECBF5]/20 blur-3xl opacity-40 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2A2A2A] dark:text-white leading-tight">
              Comece sua transformação hoje
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Junte-se a mais de <span className="font-bold">50.000 pessoas</span> que já
              transformaram suas vidas com o Emagrify.
            </p>
          </div>

          {/* CARD PREMIUM */}
          <div className="relative max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-10 text-center animate-fadeSlideUp">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/40 dark:bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-6">
                <span className="inline-block bg-[#FF7A00]/10 text-[#FF7A00] font-bold text-sm px-4 py-1 rounded-full">
                  Plano mais escolhido ⭐
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-[#2A2A2A] dark:text-white">
                Assinatura Mensal
              </h3>

              <div className="mt-6 mb-2 flex items-center justify-center gap-3">
                <span className="line-through text-gray-500 dark:text-gray-400 text-lg">
                  R$ 125
                </span>
                <span className="bg-[#FF7A00] text-white text-xs px-3 py-1 rounded-full">
                  24% OFF
                </span>
              </div>

              <div className="text-6xl font-bold text-[#2A2A2A] dark:text-white">
                R$ 95
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 text-sm">
                por 30 dias • Cancelamento a qualquer momento
              </p>

              <button
                onClick={() => (window.location.href = "/checkout")}
                className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white shadow-lg hover:opacity-90 transition-all"
              >
                Assinar Agora
              </button>

              {/* Benefícios */}
              <ul className="mt-10 space-y-3 text-left">
                {[
                  "Dietas personalizadas com IA com base no seu objetivo e rotina",
                  "Treinos adaptados (em casa ou na academia) e atualizados semanalmente",
                  "Monitoramento diário de peso, medidas e fotos de progresso",
                  "Receitas internacionais saudáveis e simples de preparar",
                  "Sistema de desafios, metas e lembretes inteligentes",
                  "Acesso completo a todas as ferramentas e atualizações futuras",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="mt-1 w-5 h-5 bg-[#7BE4B7] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* === RESULTADOS REAIS COM IMAGENS === */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#7BE4B7]/20 text-[#2A2A2A] dark:text-white px-4 py-1 rounded-full text-sm font-semibold">
              Resultados Reais
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 text-[#2A2A2A] dark:text-white">
              Pessoas como você já transformaram suas vidas
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Saúde, confiança e autoestima renovadas — veja alguns exemplos de transformações
              possíveis com consistência e o plano certo.
            </p>
          </div>

          {/* GRID DE FOTOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CARD 1 */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
              <img
                src="/results/woman1.webp"
                alt="Transformação 1"
                className="w-full h-72 object-cover"
              />
            </div>

            {/* CARD 2 */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
              <img
                src="/results/woman2.webp"
                alt="Transformação 2"
                className="w-full h-72 object-cover"
              />
            </div>

            {/* CARD 3 */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800">
              <img
                src="/results/woman3.webp"
                alt="Transformação 3"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Resultados reais variam de pessoa para pessoa. O mais importante é construir hábitos
            consistentes — e nós te damos as ferramentas para isso.
          </p>
        </div>
      </section>

      {/* === FUNCIONALIDADES PRINCIPAIS + EXTRAS (9 CARDS) === */}
      <section className="py-20 bg-[#F4F4F4] dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A2A2A] dark:text-white mb-3">
              Funcionalidades
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Ferramentas inteligentes feitas para transformar sua rotina, do planejamento à
              execução.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Dietas personalizadas */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7BE4B7]/15 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-[#7BE4B7]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Dietas Personalizadas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Planos alimentares gerados com IA de acordo com seu objetivo, preferências e
                rotina, com substituições inteligentes.
              </p>
            </div>

            {/* Treinos adaptados */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6ECBF5]/15 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-[#6ECBF5]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Treinos adaptados
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Treinos para casa ou academia, atualizados semanalmente e ajustados ao seu nível
                (iniciante, intermediário ou avançado).
              </p>
            </div>

            {/* Monitoramento diário */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7A00]/15 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Monitoramento diário
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Registre peso, medidas, fotos e humor e acompanhe sua evolução com gráficos claros
                e metas semanais.
              </p>
            </div>

            {/* Calculadora de IMC (funcional) */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6ECBF5]/15 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#6ECBF5]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Calculadora de IMC
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Descubra rapidamente se seu peso está dentro da faixa considerada saudável.
              </p>

              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Peso (kg)"
                    value={imcWeight}
                    onChange={(e) => setImcWeight(e.target.value)}
                    className="w-1/2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#7BE4B7]"
                  />
                  <input
                    type="number"
                    placeholder="Altura (cm)"
                    value={imcHeight}
                    onChange={(e) => setImcHeight(e.target.value)}
                    className="w-1/2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#7BE4B7]"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full bg-[#7BE4B7] hover:bg-[#7BE4B7]/90 text-white text-xs"
                  onClick={handleImcCalc}
                >
                  Calcular IMC
                </Button>
                {imcResult && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    {imcResult}
                  </p>
                )}
              </div>
            </div>

            {/* Desafios e gamificação */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7A00]/15 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Desafios semanais
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Missões simples e pontuação de progresso para você se manter motivada sem
                pressão excessiva.
              </p>
            </div>

            {/* Planejador de refeições */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7BE4B7]/15 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#7BE4B7]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Planejador de refeições
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Visualize suas refeições da semana e reduza decisões cansativas no dia a dia.
              </p>
            </div>

            {/* Treino em casa */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6ECBF5]/15 flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#6ECBF5]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Treino em casa
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Rotinas otimizadas para treinar com pouco espaço e, se quiser, sem equipamentos.
              </p>
            </div>

            {/* Metas inteligentes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7A00]/15 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Metas inteligentes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Defina objetivos realistas e receba sugestões de micro-metas semanais para não
                desistir.
              </p>
            </div>

            {/* Suporte com IA */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7BE4B7]/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#7BE4B7]" />
              </div>
              <h3 className="font-bold text-lg text-[#2A2A2A] dark:text-white">
                Suporte com IA
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Perguntas rápidas sobre treino, dieta e motivação, com respostas instantâneas
                para te guiar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === FERRAMENTAS AVANÇADAS – ABAS INTERATIVAS === */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[2fr,1.2fr] gap-10 items-start">
            {/* Conteúdo com abas */}
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "planejamento", label: "Planejamento" },
                  { id: "monitoramento", label: "Monitoramento" },
                  { id: "nutricao", label: "Nutrição" },
                  { id: "mentalidade", label: "Mentalidade" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveToolTab(tab.id as typeof activeToolTab)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      activeToolTab === tab.id
                        ? "bg-[#7BE4B7] text-white border-[#7BE4B7]"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Conteúdo de cada aba */}
              {activeToolTab === "planejamento" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#2A2A2A] dark:text:white">
                    Planejamento completo em poucos cliques
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Organize sua semana com clareza: treinos, refeições e metas de sono em um
                    só lugar, com lembretes inteligentes.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#7BE4B7]" />
                      Planejador semanal de treinos com sugestão automática de dias.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#7BE4B7]" />
                      Agenda de refeições com pré-visualização de macros.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#7BE4B7]" />
                      Metas de passos, água e sono configuráveis.
                    </li>
                  </ul>
                </div>
              )}

              {activeToolTab === "monitoramento" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#2A2A2A] dark:text-white">
                    Acompanhe sua evolução com dados reais
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Visualize seu progresso de forma clara, sem se perder em números soltos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <LineChart className="w-4 h-4 mt-0.5 text-[#6ECBF5]" />
                      Gráficos de peso, medidas e percentual de gordura ao longo das semanas.
                    </li>
                    <li className="flex items-start gap-2">
                      <CalendarClock className="w-4 h-4 mt-0.5 text-[#6ECBF5]" />
                      Linha do tempo com conquistas importantes para manter a motivação.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#7BE4B7]" />
                      Resumo semanal automático com pontos fortes e o que melhorar.
                    </li>
                  </ul>
                </div>
              )}

              {activeToolTab === "nutricao" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#2A2A2A] dark:text-white">
                    Nutrição simples, gostosa e eficiente
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Nada de dietas mirabolantes: você aprende a comer bem, com equilíbrio, sem
                    medo de carboidratos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <UtensilsCrossed className="w-4 h-4 mt-0.5 text-[#FF7A00]" />
                      Biblioteca de receitas saudáveis, rápidas e baratas.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#7BE4B7]" />
                      Sugestões de substituições em cada refeição.
                    </li>
                    <li className="flex items-start gap-2">
                      <Droplet className="w-4 h-4 mt-0.5 text-[#6ECBF5]" />
                      Lembretes de hidratação e equilíbrio de fibras, proteínas e gorduras.
                    </li>
                  </ul>
                </div>
              )}

              {activeToolTab === "mentalidade" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#2A2A2A] dark:text-white">
                    Mentalidade forte para não desistir no meio
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Emagrecer vai além de comer menos: você precisa aprender a lidar com
                    ansiedade, compulsão e gatilhos.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 mt-0.5 text-[#7BE4B7]" />
                      Trilhas de áudios e textos sobre mindset e disciplina.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#7BE4B7]" />
                      Ferramentas para registrar emoções e gatilhos de compulsão.
                    </li>
                    <li className="flex items-start gap-2">
                      <CalendarClock className="w-4 h-4 mt-0.5 text-[#6ECBF5]" />
                      Desafios semanais focados em consistência, não em perfeição.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Mini card “ferramenta em ação” */}
            <div className="bg-[#F4F4F4] dark:bg-gray-800 rounded-3xl p-6 shadow-lg space-y-4">
              <h3 className="text-lg font-semibold text-[#2A2A2A] dark:text-white">
                Tudo isso em um painel simples de usar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Você não precisa ser “fitness” para começar. A interface foi pensada para quem
                está recomeçando do zero, com passo a passo guiado.
              </p>

              <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
                  <span>Painel único com visão geral do seu dia.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
                  <span>Compatível com modo claro e escuro.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
                  <span>Acesso em qualquer dispositivo com internet.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#2A2A2A] dark:bg-gray-950 text-white py-10 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} Emagrify — Todos os direitos reservados.
        </div>
      </footer>

      {/* === CONTACT DIALOG === */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2A2A2A] dark:text-white">
              Entre em Contato
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Email: emagrify@gmail.com
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* === ESTILOS GLOBAIS (ANIMAÇÕES SUAVES) === */}
      <style jsx global>{`
        html,
        body {
          scroll-behavior: smooth;
        }

        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.8s ease forwards;
        }

        h1,
        h2,
        h3 {
          transition: color 0.3s ease;
        }

        h1:hover,
        h2:hover,
        h3:hover {
          color: #6ecbf5;
        }

        a,
        button {
          transition: 0.25s ease-in-out;
        }
      `}</style>
    </div>
  );
}
