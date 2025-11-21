import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ goals: data });
}

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, tipo, alvo, unidade, prazo } = await req.json();

  const { data, error } = await supabase.from("goals").insert([
    { user_id: userId, tipo, alvo, unidade, prazo },
  ]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ goal: data });
}
