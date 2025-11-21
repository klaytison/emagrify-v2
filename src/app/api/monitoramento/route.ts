import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, peso, humor, medidas, notas } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("daily_tracking")
    .insert([
      {
        user_id: userId,
        data: new Date().toISOString().slice(0, 10),
        peso: peso ?? null,
        humor: humor ?? null,
        medidas: medidas ?? null,
        notas: notas ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tracking: data });
}

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("daily_tracking")
    .select("*")
    .eq("user_id", userId)
    .order("data", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}
