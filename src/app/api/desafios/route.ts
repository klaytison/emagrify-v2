// src/app/api/desafios/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
  }

  const { data: desafios, error: errDesafios } = await supabase
    .from("challenges")
    .select("*")
    .order("created_at", { ascending: true });

  if (errDesafios) {
    console.error(errDesafios);
    return NextResponse.json({ error: errDesafios.message }, { status: 500 });
  }

  const { data: progresso, error: errProg } = await supabase
    .from("challenge_progress")
    .select("*")
    .eq("user_id", userId);

  if (errProg) {
    console.error(errProg);
    return NextResponse.json({ error: errProg.message }, { status: 500 });
  }

  return NextResponse.json({ desafios, progresso });
}
