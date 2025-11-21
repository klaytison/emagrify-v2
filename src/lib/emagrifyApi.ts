// src/lib/emagrifyApi.ts
import { supabaseClient } from "./supabaseClient";
const supabase = supabaseClient();

// Tipos simples (você pode refinar depois, se quiser)
export interface ProgressRow {
  id: number;
  user_id: string;
  day: string;
  weight_kg: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  chest_cm: number | null;
  body_fat_pct: number | null;
  steps: number | null;
  calories_in: number | null;
  calories_out: number | null;
  mood: string | null;
  notes: string | null;
  created_at: string;
}

export interface MacrosTargetsRow {
  id: number;
  user_id: string;
  calories_target: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  updated_at: string;
}

export interface WorkoutRow {
  id: number;
  user_id: string;
  day: string;
  title: string | null;
  focus: string | null;
  location: string | null;
  difficulty: string | null;
  duration_min: number | null;
  calories_burned: number | null;
  plan_json: any | null;
  created_at: string;
}

export interface MealRow {
  id: number;
  user_id: string;
  day: string;
  meal_type: string | null;
  title: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  source: string | null;
  created_at: string;
}

export interface WaterRow {
  id: number;
  user_id: string;
  day: string;
  ml: number;
  created_at: string;
}

export interface WeeklyReportRow {
  id: number;
  user_id: string;
  week_start: string;
  weight_start_kg: number | null;
  weight_end_kg: number | null;
  diff_kg: number | null;
  calories_avg: number | null;
  steps_avg: number | null;
  notes: string | null;
  created_at: string;
}

export interface AiSupportMessageRow {
  id: number;
  user_id: string;
  role: "user" | "assistant" | "system";
  message: string;
  created_at: string;
}

/* ===========================================================
   HELPERS
   =========================================================== */

export const getTodayISO = () => new Date().toISOString().slice(0, 10);

export const getWeekStartISO = () => {
  const d = new Date();
  const day = d.getDay(); // 0 = domingo
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // começar na segunda
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
};

/* ===========================================================
   PROGRESSO DIÁRIO
   =========================================================== */

export async function getLastProgress(): Promise<ProgressRow | null> {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .order("day", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar último progresso:", error);
    throw error;
  }
  return data;
}

export async function getProgressByDay(day: string): Promise<ProgressRow | null> {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("day", day)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar progresso por dia:", error);
    throw error;
  }
  return data;
}

export async function upsertProgressForDay(input: {
  day: string;
  weight_kg?: number;
  waist_cm?: number;
  hip_cm?: number;
  chest_cm?: number;
  body_fat_pct?: number;
  steps?: number;
  calories_in?: number;
  calories_out?: number;
  mood?: string;
  notes?: string;
}) {
  // upsert baseado em day + user_id (via RLS, supabase preenche user_id)
  const { data, error } = await supabase.from("progress").upsert(
    {
      ...input,
    },
    {
      onConflict: "user_id,day",
    }
  );
  if (error) {
    console.error("Erro ao salvar progresso:", error);
    throw error;
  }
  return data;
}

/* ===========================================================
   MACROS
   =========================================================== */

export async function getMacrosTarget(): Promise<MacrosTargetsRow | null> {
  const { data, error } = await supabase
    .from("macros_targets")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar macros:", error);
    throw error;
  }
  return data;
}

export async function upsertMacrosTarget(input: {
  calories_target: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}) {
  const { data, error } = await supabase
    .from("macros_targets")
    .upsert(
      {
        ...input,
      },
      { onConflict: "user_id" }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error("Erro ao salvar macros:", error);
    throw error;
  }
  return data;
}

/* ===========================================================
   ÁGUA
   =========================================================== */

export async function getTodayWater(): Promise<WaterRow | null> {
  const today = getTodayISO();
  const { data, error } = await supabase
    .from("water_intake")
    .select("*")
    .eq("day", today)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar água de hoje:", error);
    throw error;
  }
  return data;
}

export async function addWater(ml: number) {
  const today = getTodayISO();
  const { data, error } = await supabase
    .from("water_intake")
    .insert({ day: today, ml })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Erro ao adicionar água:", error);
    throw error;
  }
  return data;
}

/* ===========================================================
   TREINOS E REFEIÇÕES DE HOJE
   =========================================================== */

export async function getTodayWorkouts(): Promise<WorkoutRow[]> {
  const today = getTodayISO();
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("day", today)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar treinos de hoje:", error);
    throw error;
  }
  return data || [];
}

export async function addWorkoutToday(input: {
  title: string;
  focus?: string;
  location?: string;
  difficulty?: string;
  duration_min?: number;
  calories_burned?: number;
  plan_json?: any;
}) {
  const today = getTodayISO();
  const { data, error } = await supabase
    .from("workouts")
    .insert({ day: today, ...input })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Erro ao criar treino:", error);
    throw error;
  }
  return data;
}

export async function getTodayMeals(): Promise<MealRow[]> {
  const today = getTodayISO();
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("day", today)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar refeições:", error);
    throw error;
  }
  return data || [];
}

export async function addMealToday(input: {
  meal_type: string;
  title: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  source?: string;
}) {
  const today = getTodayISO();
  const { data, error } = await supabase
    .from("meals")
    .insert({ day: today, ...input })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Erro ao adicionar refeição:", error);
    throw error;
  }
  return data;
}

/* ===========================================================
   RELATÓRIO SEMANAL (SIMPLIFICADO)
   =========================================================== */

export async function getLastWeeklyReport(): Promise<WeeklyReportRow | null> {
  const { data, error } = await supabase
    .from("weekly_reports")
    .select("*")
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar relatório semanal:", error);
    throw error;
  }
  return data;
}

/**
 * Gera um relatório semanal simples baseado nos últimos 7 dias de "progress".
 * (Tudo feito no front, só grava o resumo na tabela)
 */
export async function generateWeeklyReportFromProgress() {
  const weekStart = getWeekStartISO();

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .gte("day", weekStart)
    .order("day", { ascending: true });

  if (error) {
    console.error("Erro ao buscar progressos da semana:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Nenhum dado de progresso nesta semana para gerar relatório.");
  }

  const weights = data.map((d) => d.weight_kg).filter(Boolean) as number[];
  const steps = data.map((d) => d.steps || 0);
  const calories = data.map((d) => d.calories_in || 0);

  const weight_start_kg = data[0].weight_kg ?? null;
  const weight_end_kg = data[data.length - 1].weight_kg ?? null;
  const diff_kg =
    weight_start_kg !== null && weight_end_kg !== null
      ? Number((weight_end_kg - weight_start_kg).toFixed(2))
      : null;

  const steps_avg =
    steps.length > 0 ? Math.round(steps.reduce((a, b) => a + b, 0) / steps.length) : null;

  const calories_avg =
    calories.length > 0
      ? Math.round(calories.reduce((a, b) => a + b, 0) / calories.length)
      : null;

  const { data: report, error: insertError } = await supabase
    .from("weekly_reports")
    .upsert(
      {
        week_start,
        weight_start_kg,
        weight_end_kg,
        diff_kg,
        steps_avg,
        calories_avg,
        notes: "Relatório gerado automaticamente a partir dos dados de progresso.",
      },
      { onConflict: "user_id,week_start" }
    )
    .select()
    .maybeSingle();

  if (insertError) {
    console.error("Erro ao salvar relatório semanal:", insertError);
    throw insertError;
  }

  return report;
}

/* ===========================================================
   MINI CHAT DE SUPORTE COM IA (SÓ PERSISTÊNCIA)
   =========================================================== */

export async function getChatHistory(limit = 30): Promise<AiSupportMessageRow[]> {
  const { data, error } = await supabase
    .from("ai_support_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Erro ao carregar histórico de chat:", error);
    throw error;
  }
  return (data || []).reverse();
}

export async function addUserChatMessage(message: string) {
  const { data, error } = await supabase
    .from("ai_support_messages")
    .insert({ role: "user", message })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Erro ao salvar mensagem do usuário:", error);
    throw error;
  }
  return data;
}

export async function addAssistantChatMessage(message: string) {
  const { data, error } = await supabase
    .from("ai_support_messages")
    .insert({ role: "assistant", message })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Erro ao salvar resposta da IA:", error);
    throw error;
  }
  return data;
}
