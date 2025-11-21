import { NextResponse } from "next/server";
import { createServerSupabase } from "../_supabaseServer";

export async function GET(req: Request) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data: desafios } = await supabase.from("challenges").select("*");

  const { data: progresso } = await supabase
    .from("challenge_progress")
    .select("*")
    .eq("user_id", userId);

  return NextResponse.json({ desafios, progresso });
}
