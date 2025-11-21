import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, tipo, nivel } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  const treino = {
    aquecimento: ["5 min de caminhada leve", "Alongamento dinâmico"],
    exercicios: [
      { nome: "Agachamento", series: 3, reps: 12 },
      { nome: "Flexão de braço", series: 3, reps: 10 },
      { nome: "Prancha", series: 3, tempoSegundos: 30 },
    ],
    finalizacao: ["Alongamento leve de pernas e costas"],
  };

  const { data, error } = await supabase
    .from("workouts")
    .insert([{ user_id: userId, tipo: tipo ?? "academia", nivel: nivel ?? "iniciante", treino }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ workout: data });
}

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const tipo = searchParams.get("tipo"); // opcional: casa / academia

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  let query = supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  const { data, error } = await query.limit(1).single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ workout: data });
}
