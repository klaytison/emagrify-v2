"use client";
export const dynamic = "force-dynamic";

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
  HeartPulse,
  Moon,
  Sun,
  Scan,
  Ghost,
  Pocket,
  Badge,
} from "lucide-react";

export default function Home() {
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Aba da seção avançada
  const [activeToolTab, setActiveToolTab] = useState<
    "planejamento" | "monitoramento" | "nutricao" | "mentalidade"
  >("planejamento");

  // Mini calculadora de água
  const [waterWeight, setWaterWeight] = useState<string>("");
  const [waterResult, setWaterResult] = useState<string>("");

  const handleWaterCalc = () => {
    const peso = Number(waterWeight.replace(",", "."));
    if (!peso || peso <= 0) {
      setWaterResult("Informe um peso válido em kg.");
      return;
    }
    const ml = peso * 35;
    const litros = ml / 1000;
    setWaterResult(`Recomendação: ${litros.toFixed(2)} L/dia`);
  };

  // Mini calculadora IMC
  const [imcWeight, setImcWeight] = useState<string>("");
  const [imcHeight, setImcHeight] = useState<string>("");
  const [imcResult, setImcResult] = useState<string>("");

  const handleImcCalc = () => {
    const peso = Number(imcWeight.replace(",", "."));
    const alturaCm = Number(imcHeight.replace(",", "."));
    if (!peso || !alturaCm || peso <= 0 || alturaCm <= 0) {
      setImcResult("Preencha peso e altura.");
      return;
    }
    const alturaM = alturaCm / 100;
    const imc = peso / (alturaM * alturaM);
    let categoria =
      imc < 18.5
        ? "Abaixo do peso"
        : imc < 25
        ? "Normal"
        : imc < 30
        ? "Sobrepeso"
        : "Obesidade";
    setImcResult(`IMC: ${imc.toFixed(1)} (${categoria})`);
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
              Plataforma inteligente de emagrecimento
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2A2A2A] dark:text-white leading-tight">
              Transforme seu corpo e sua{" "}
              <span className="text-[#7BE4B7]">vida</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Dietas com IA, treinos adaptados, monitoramento completo e novas funcionalidades evoluídas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white px-8 shadow-lg hover:opacity-90"
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
          </div>

          {/* Bloco lateral */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7BE4B7]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#6ECBF5]/25 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-4">
              {/* Card mini-infos */}
              <div className="rounded-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-8 h-8 text-[#7BE4B7]" />
                  <div>
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                      Hoje
                    </p>
                    <p className="font-semibold text-[#2A2A2A] dark:text-white">
                      Foco total
                    </p>
                  </div>
                </div>
              </div>

              {/* Calculadora água */}
              <div className="rounded-3xl bg-white/80 dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4">
                <Droplet className="w-8 h-8 text-[#6ECBF5]" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Água por dia
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Peso (kg)"
                      value={waterWeight}
                      onChange={(e) => setWaterWeight(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm"
                    />
                    <Button
                      size="sm"
                      className="bg-[#6ECBF5] text-white"
                      onClick={handleWaterCalc}
                    >
                      OK
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

      {/* === PREMIUM === */}
      <section
        id="premium"
        className="relative py-24 bg-gradient-to-br from-white via-[#F4F4F4] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2A2A2A] dark:text-white">
              Comece sua transformação hoje
            </h2>
          </div>

          <div className="relative max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
            <span className="inline-block bg-[#FF7A00]/10 text-[#FF7A00] font-bold text-sm px-4 py-1 rounded-full">
              Plano mais escolhido ⭐
            </span>

            <h3 className="text-3xl font-extrabold mt-6 text-[#2A2A2A] dark:text-white">
              Assinatura Mensal
            </h3>

            <div className="text-6xl font-bold mt-6 text-[#2A2A2A] dark:text-white">
              R$ 95
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              por 30 dias • sem compromisso
            </p>

            <button
              onClick={() => (window.location.href = "/checkout")}
              className="w-full mt-8 py-4 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl text-lg shadow-lg"
            >
              Assinar Agora
            </button>
          </div>
        </div>
      </section>

      {/* === RESULTADOS === */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#7BE4B7]/20 px-4 py-1 rounded-full text-sm font-semibold">
              Resultados Reais
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] dark:text-white mt-4">
              Transformações de verdade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <img src="/results/woman1.webp" className="rounded-2xl shadow-lg" />
            <img src="/results/woman2.webp" className="rounded-2xl shadow-lg" />
            <img src="/results/woman3.webp" className="rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>
      {/* === FUNCIONALIDADES === */}
      <section className="py-20 bg-[#F4F4F4] dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A2A2A] dark:text-white">
              Funcionalidades
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* DIETAS */}
            <CardLink icon={UtensilsCrossed} color="#7BE4B7" title="Dietas Personalizadas" desc="Planos completos feitos com IA." link="/dietas" />

            {/* TREINOS ADAPTADOS */}
            <CardLink icon={Dumbbell} color="#6ECBF5" title="Treinos Adaptados" desc="Para casa ou academia." link="/treinos" />

            {/* MONITORAMENTO */}
            <CardLink icon={Activity} color="#FF7A00" title="Monitoramento Diário" desc="Peso, medidas e humor." link="/monitoramento" />

            {/* CALCULADORA IMC */}
            <ImcCard
              imcWeight={imcWeight}
              setImcWeight={setImcWeight}
              imcHeight={imcHeight}
              setImcHeight={setImcHeight}
              imcResult={imcResult}
              handleImcCalc={handleImcCalc}
            />

            {/* DESAFIOS */}
            <CardLink icon={Trophy} color="#FF7A00" title="Desafios Semanais" desc="Complete missões e ganhe pontos." link="/desafios" />

            {/* PLANEJADOR DE REFEIÇÕES */}
            <CardLink icon={ClipboardList} color="#7BE4B7" title="Planejador de Refeições" desc="Organize sua semana." link="/refeicoes" />

            {/* ❌ REMOVIDO — TREINO EM CASA */}

            {/* METAS */}
            <CardLink icon={Target} color="#FF7A00" title="Metas Inteligentes" desc="Crie metas e micro metas." link="/metas" />

            {/* SUPORTE IA */}
            <CardLink icon={Sparkles} color="#7BE4B7" title="Suporte com IA" desc="Respostas instantâneas." link="/suporte-ia" />

            {/* === 9 NOVAS FUNCIONALIDADES === */}

            <CardLink icon={Scan} color="#6ECBF5" title="Evolução Visual do Corpo" desc="Silhueta automática com IA." link="/evolucao-visual" />

            <CardLink icon={HeartPulse} color="#FF4D6D" title="Sinais do Corpo" desc="A IA explica seus sintomas." link="/sinais-corpo" />

            <CardLink icon={Sun} color="#FFD93D" title="Ritual da Manhã" desc="Respiração, frase e micro meta." link="/ritual-manha" />

            <CardLink icon={Moon} color="#7F5AF0" title="Ritual da Noite" desc="Reflexão e preparação." link="/ritual-noite" />

            <CardLink icon={Ghost} color="#00D1B2" title="Meta Fantasma" desc="A IA cria metas automáticas." link="/meta-fantasma" />

            <CardLink icon={Brain} color="#FDA7DC" title="Sistema de Temperamento" desc="Tipo emocional, mensagens e ajustes." link="/temperamento" />

            <CardLink icon={CalendarClock} color="#6ECBF5" title="Linha do Tempo Saudável" desc="Sua evolução completa." link="/linha-do-tempo" />

            <CardLink icon={Flame} color="#FF6B6B" title="Modo Zen" desc="Respiração e animações relaxantes." link="/modo-zen" />

            <CardLink icon={Pocket} color="#7BE4B7" title="Cofre de Recompensas" desc="Ganhe moedas e desbloqueie temas." link="/cofre" />

            <CardLink icon={Badge} color="#F7CE68" title="Avatar Motivacional" desc="Mascote que evolui com você." link="/avatar" />

          </div>
        </div>
      </section>
      {/* === ABAS AVANÇADAS === */}
      <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ferramentas Avançadas</h2>

          {/* Abas */}
          <div className="flex gap-3 mb-8">
            {["planejamento", "monitoramento", "nutricao", "mentalidade"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveToolTab(tab as typeof activeToolTab)
                  }
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                    activeToolTab === tab
                      ? "bg-[#7BE4B7] text-white border-[#7BE4B7]"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          <div className="text-gray-700 dark:text-gray-300 text-sm max-w-xl">
            {activeToolTab === "planejamento" && (
              <p>Organize sua rotina com treinos, refeições e metas.</p>
            )}
            {activeToolTab === "monitoramento" && (
              <p>Veja seu progresso semanal com gráficos inteligentes.</p>
            )}
            {activeToolTab === "nutricao" && (
              <p>Tenha controle alimentar com sugestões da IA.</p>
            )}
            {activeToolTab === "mentalidade" && (
              <p>Construa disciplina e reduza ansiedade com gatilhos positivos.</p>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2A2A2A] dark:bg-gray-950 text-white py-10 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} Emagrify — Todos os direitos reservados.
        </div>
      </footer>

      {/* CONTATO */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Contato</DialogTitle>
            <DialogDescription>Email: emagrify@gmail.com</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* COMPONENTES AUXILIARES */}
    </div>
  );
}

/* === CARD LINK COMPONENT === */
function CardLink({ icon: Icon, color, title, desc, link }: any) {
  return (
    <div
      onClick={() => (window.location.href = link)}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="font-bold mt-3">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  );
}

/* === IMC CARD COMPONENT === */
function ImcCard(props: any) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
      <div className="w-10 h-10 rounded-full bg-[#6ECBF5]/15 flex items-center justify-center">
        <Calculator className="w-5 h-5 text-[#6ECBF5]" />
      </div>

      <h3 className="font-bold text-lg mt-3">Calculadora de IMC</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Descubra rapidamente seu índice.
      </p>

      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Peso (kg)"
            value={props.imcWeight}
            onChange={(e) => props.setImcWeight(e.target.value)}
            className="w-1/2 rounded-lg border px-3 py-1.5 text-xs"
          />
          <input
            type="number"
            placeholder="Altura (cm)"
            value={props.imcHeight}
            onChange={(e) => props.setImcHeight(e.target.value)}
            className="w-1/2 rounded-lg border px-3 py-1.5 text-xs"
          />
        </div>

        <Button
          size="sm"
          className="w-full bg-[#7BE4B7] text-white"
          onClick={props.handleImcCalc}
        >
          Calcular IMC
        </Button>

        {props.imcResult && (
          <p className="text-xs mt-1">{props.imcResult}</p>
        )}
      </div>
    </div>
  );
}
