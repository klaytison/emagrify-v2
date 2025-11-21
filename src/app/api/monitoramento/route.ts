import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, peso, humor, medidas, notas } = await req.json();

  const { data, error } = await supabase.from("daily_tracking").insert([
    {
      user_id: userId,
      data: new Date().toISOString().slice(0, 10),
      peso,
      humor,
      medidas,
      notas,
    },
  ]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ tracking: data });
}

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data, error } = await supabase
    .from("daily_tracking")
    .select("*")
    .eq("user_id", userId)
    .order("data", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ entries: data });
}
