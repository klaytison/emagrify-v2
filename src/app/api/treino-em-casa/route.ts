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
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .eq("tipo", "casa")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ workouts: data });
}
