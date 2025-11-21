import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, objetivo, preferencias, restricoes } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  console.log("USER RECEBIDO NA API:", userId);

  // Aqui depois você troca por chamada de IA, se quiser
  const plano = {
    cafe: "Ovos mexidos + pão integral + café sem açúcar",
    lanche_manha: "1 fruta (banana ou maçã)",
    almoco: "Arroz integral + frango grelhado + salada",
    lanche_tarde: "Iogurte natural com aveia",
    jantar: "Sopa de legumes + proteína magra",
  };

  const { data, error } = await supabase
    .from("diet_plans")
    .insert([
      {
        user_id: userId,
        objetivo: objetivo ?? null,
        preferencias: preferencias ?? null,
        restricoes: restricoes ?? null,
        plano,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: data });
}

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("diet_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: data });
}
