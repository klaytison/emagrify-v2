import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const body = await req.json();
    const { treino_id } = body;

    if (!treino_id) {
      return NextResponse.json(
        { error: "ID do treino é obrigatório." },
        { status: 400 }
      );
    }

    // Verifica usuário logado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // Criar registro de conclusão
    const { error } = await supabase.from("treinos_concluidos").insert({
      treino_id,
      user_id: session.user.id,
    });

    if (error) {
      console.error("Erro ao registrar conclusão:", error);
      return NextResponse.json(
        { error: "Erro ao registrar conclusão do treino." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro inesperado no servidor." },
      { status: 500 }
    );
  }
}
