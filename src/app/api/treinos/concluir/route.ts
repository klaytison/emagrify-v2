import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { treino_id, user_id } = await req.json();

    if (!treino_id) {
      return NextResponse.json(
        { error: "ID do treino é obrigatório." },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // Registrar conclusão
    const { error } = await supabase.from("treinos_concluidos").insert({
      treino_id,
      user_id,
    });

    if (error) {
      console.error("Erro ao registrar conclusão:", error);
      return NextResponse.json(
        { error: "Erro ao registrar conclusão do treino." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro inesperado no servidor." },
      { status: 500 }
    );
  }
}
