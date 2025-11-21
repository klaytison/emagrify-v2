import { NextResponse } from "next/server";
import { createServerSupabase } from "../../_supabaseServer";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const body = await req.json();
  const { userId, objetivo, preferencias, restricoes } = body;

  // Aqui você pode chamar IA depois. Por enquanto, gera um plano simples:
  const plano = {
    cafe: "Ovos mexidos + 1 fatia de pão integral + café sem açúcar",
    lanche_manha: "1 fruta (maçã ou banana)",
    almoco: "Arroz integral + frango grelhado + salada",
    lanche_tarde: "Iogurte natural + aveia",
    jantar: "Sopa de legumes com proteína",
  };

  const { data, error } = await supabase.from("diet_plans").insert([
    {
      user_id: userId,
      objetivo,
      preferencias,
      restricoes,
      plano,
    },
  ]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ plan: data });
}
