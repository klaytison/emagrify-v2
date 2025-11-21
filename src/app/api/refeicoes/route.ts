import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ meals: data });
}

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, diaSemana, refeicoes } = await req.json();

  if (!userId || !diaSemana) {
    return NextResponse.json(
      { error: "userId e diaSemana são obrigatórios." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("meal_plans")
    .upsert(
      [
        {
          user_id: userId,
          dia_semana: diaSemana,
          refeicoes,
        },
      ],
      { onConflict: "user_id,dia_semana" }
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ mealPlan: data });
}
