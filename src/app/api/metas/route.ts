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
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ goals: data });
}

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, tipo, alvo, unidade, prazo } = await req.json();

  if (!userId || !tipo || !alvo || !unidade) {
    return NextResponse.json(
      { error: "userId, tipo, alvo e unidade são obrigatórios." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("goals")
    .insert([
      {
        user_id: userId,
        tipo,
        alvo,
        unidade,
        prazo: prazo ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ goal: data });
}
