// src/app/api/desafios/concluir/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "../../_supabaseServer";

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { userId, challengeId } = await req.json();

  if (!userId || !challengeId) {
    return NextResponse.json(
      { error: "userId e challengeId são obrigatórios." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("challenge_progress")
    .upsert(
      [
        {
          user_id: userId,
          challenge_id: challengeId,
          concluido: true,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id,challenge_id" }
    )
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}
