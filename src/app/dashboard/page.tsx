// src/app/dashboard/page.tsx
"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { useAiChat } from "@/hooks/useAiChat";
import { getTodayISO } from "@/lib/emagrifyApi";

export default function DashboardPage() {
  const {
    loading,
    error,
    lastProgress,
    macros,
    waterToday,
    workoutsToday,
    mealsToday,
    weeklyReport,
    generateWeekReport,
  } = useDashboardData();

  const { messages, loading: chatLoading, sending, error: chatError, sendUserMessage } =
    useAiChat();

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("message") as HTMLInputElement;
    const value = input.value;
    input.value = "";
    await sendUserMessage(value);
  };

  const today = getTodayISO();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard Emagrify</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral do seu dia, semana e ferramentas inteligentes.
          </p>
        </header>

        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Linha 1: Progresso + Macros + Água */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h2 className="font-semibold mb-2 text-lg">Último Progresso</h2>
            {loading && !lastProgress ? (
              <p className="text-sm text-gray-500">Carregando…</p>
            ) : lastProgress ? (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Data:</span> {lastProgress.day}
                </p>
                {lastProgress.weight_kg && (
                  <p>
                    <span className="font-medium">Peso:</span> {lastProgress.weight_kg} kg
                  </p>
                )}
                {lastProgress.body_fat_pct && (
                  <p>
                    <span className="font-medium">% Gordura:</span>{" "}
                    {lastProgress.body_fat_pct}%
                  </p>
                )}
                {lastProgress.steps && (
                  <p>
                    <span className="font-medium">Passos:</span> {lastProgress.steps}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhum progresso cadastrado ainda. Registre seu peso e medidas hoje.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h2 className="font-semibold mb-2 text-lg">Meta de Macros</h2>
            {macros ? (
              <ul className="text-sm space-y-1">
                <li>
                  <span className="font-medium">Calorias:</span>{" "}
                  {macros.calories_target ?? "-"} kcal
                </li>
                <li>
                  <span className="font-medium">Proteínas:</span>{" "}
                  {macros.protein_g ?? "-"} g
                </li>
                <li>
                  <span className="font-medium">Carboidratos:</span>{" "}
                  {macros.carbs_g ?? "-"} g
                </li>
                <li>
                  <span className="font-medium">Gorduras:</span>{" "}
                  {macros.fat_g ?? "-"} g
                </li>
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Defina sua meta de macros na calculadora para ver aqui.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h2 className="font-semibold mb-2 text-lg">Água de hoje</h2>
            {waterToday ? (
              <p className="text-sm">
                Você já registrou{" "}
                <span className="font-semibold">{waterToday.ml} ml</span> hoje.
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhum registro de água hoje ({today}). Use a mini calculadora na página
                inicial para se guiar.
              </p>
            )}
          </div>
        </section>

        {/* Linha 2: Treinos / Refeições / Relatório semanal */}
        <section className="grid lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h2 className="font-semibold mb-3 text-lg">Treinos de hoje</h2>
            {workoutsToday.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhum treino salvo para hoje. Você pode criar um treino pela área de
                treinos.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {workoutsToday.map((w) => (
                  <li key={w.id} className="border-b border-gray-200/40 pb-1">
                    <p className="font-medium">{w.title}</p>
                    <p className="text-gray-500">
                      {w.focus || "—"} • {w.duration_min ?? "--"} min
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h2 className="font-semibold mb-3 text-lg">Refeições de hoje</h2>
            {mealsToday.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma refeição registrada hoje. Use a função de refeições para registrar.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {mealsToday.map((m) => (
                  <li key={m.id} className="border-b border-gray-200/40 pb-1">
                    <p className="font-medium">
                      {m.meal_type}: {m.title}
                    </p>
                    <p className="text-gray-500">
                      {m.calories ?? "--"} kcal • P: {m.protein_g ?? "--"}g • C:{" "}
                      {m.carbs_g ?? "--"}g • G: {m.fat_g ?? "--"}g
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg">Relatório semanal</h2>
              <button
                onClick={() => generateWeekReport()}
                className="text-xs px-3 py-1 rounded-full bg-[#7BE4B7] text-white hover:bg-[#62cfa2] transition"
              >
                Gerar semana
              </button>
            </div>
            {weeklyReport ? (
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Semana:</span>{" "}
                  {weeklyReport.week_start}
                </p>
                <p>
                  <span className="font-medium">Peso inicial:</span>{" "}
                  {weeklyReport.weight_start_kg ?? "--"} kg
                </p>
                <p>
                  <span className="font-medium">Peso final:</span>{" "}
                  {weeklyReport.weight_end_kg ?? "--"} kg
                </p>
                <p>
                  <span className="font-medium">Diferença:</span>{" "}
                  {weeklyReport.diff_kg ?? "--"} kg
                </p>
                <p>
                  <span className="font-medium">Calorias médias:</span>{" "}
                  {weeklyReport.calories_avg ?? "--"} kcal
                </p>
                <p>
                  <span className="font-medium">Passos médios:</span>{" "}
                  {weeklyReport.steps_avg ?? "--"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Nenhum relatório salvo ainda. Clique em “Gerar semana”.
              </p>
            )}
          </div>
        </section>

        {/* Linha 3: Mini Chat IA */}
        <section className="grid lg:grid-cols-[2fr,1fr] gap-4">
          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm flex flex-col max-h-[420px]">
            <h2 className="font-semibold mb-2 text-lg">Mini Chat de Suporte com IA</h2>
            {chatError && (
              <p className="text-xs text-red-400 mb-2">Erro: {chatError}</p>
            )}

            <div className="flex-1 overflow-y-auto border border-gray-200/40 dark:border-gray-700 rounded-lg p-3 mb-3 bg-gray-50 dark:bg-gray-900 text-sm space-y-2">
              {chatLoading ? (
                <p className="text-gray-500">Carregando chat…</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-500">
                  Nenhuma mensagem ainda. Pergunte algo sobre treino, dieta ou
                  motivação!
                </p>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                        m.role === "user"
                          ? "bg-[#7BE4B7] text-gray-900"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <p className="text-xs mb-1 opacity-70">
                        {m.role === "user" ? "Você" : "IA Emagrify"}
                      </p>
                      <p className="text-sm whitespace-pre-line">{m.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
              <input
                name="message"
                placeholder="Digite sua dúvida…"
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
              />
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-2 rounded-lg bg-[#6ECBF5] text-white text-sm font-semibold hover:bg-[#57b5de] disabled:opacity-60"
              >
                {sending ? "Enviando…" : "Enviar"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm text-sm space-y-2">
            <h2 className="font-semibold mb-2 text-lg">Como usar este painel</h2>
            <p className="text-gray-600 dark:text-gray-400">
              • Use o <strong>progresso diário</strong> para registrar peso, medidas e
              passos.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              • Defina sua <strong>meta de macros</strong> na calculadora (que já está
              ligada na tabela <code>macros_targets</code>).
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              • Registre treinos e refeições para ver aqui na visão geral.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              • Gere o <strong>relatório semanal</strong> sempre que quiser entender se
              está indo na direção certa.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              • Use o <strong>mini chat IA</strong> como um apoio rápido; depois você
              pode plugAR sua própria API de IA lá.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
