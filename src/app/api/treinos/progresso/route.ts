import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const body = await req.json();

    const { workout_plan_id, completed, calories_burned } = body;

    // Pega o usuário logado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json(
        { error: "Não autenticado." },
        { status: 401 }
      );

    const { data, error } = await supabase
      .from("user_workouts")
      .insert({
        user_id: user.id,
        workout_plan_id,
        completed,
        calories_burned,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ saved: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao registrar progresso." },
      { status: 500 }
    );
  }
}
