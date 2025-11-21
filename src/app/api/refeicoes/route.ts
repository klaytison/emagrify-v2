import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ meals: data });
}

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, diaSemana, refeicoes } = await req.json();

  const { data, error } = await supabase
    .from("meal_plans")
    .upsert([
      { user_id: userId, dia_semana: diaSemana, refeicoes },
    ]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ mealPlan: data });
}
