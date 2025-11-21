import { NextResponse } from "next/server";
import { createServerSupabase } from "../../_supabaseServer";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, challengeId } = await req.json();

  const { data, error } = await supabase.from("challenge_progress").upsert([
    {
      user_id: userId,
      challenge_id: challengeId,
      concluido: true,
      updated_at: new Date().toISOString(),
    },
  ]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ progress: data });
}
