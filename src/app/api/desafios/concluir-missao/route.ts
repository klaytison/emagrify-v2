import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // ⬅️ Agora a API realmente lê o que o front-end envia
    const { user_id, desafio_id, missao_id } = await req.json();

    if (!user_id || !desafio_id || !missao_id) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    // 1️⃣ Buscar informações da missão
    const { data: missao, error: missaoErr } = await supabase
      .from("desafios_missoes")
      .select("*")
      .eq("id", missao_id)
      .single();

    if (missaoErr || !missao) {
      return NextResponse.json({ error: "Missão não encontrada" }, { status: 404 });
    }

    // 2️⃣ Atualizar XP do usuário
    const { data: userStatus, error: statusErr } = await supabase
      .from("desafios_usuario")
      .select("*")
      .eq("user_id", user_id)
      .eq("desafio_id", desafio_id)
      .maybeSingle();

    if (statusErr) {
      return NextResponse.json({ error: "Erro ao carregar status" }, { status: 500 });
    }

    const xpAtual = userStatus?.xp_atual ?? 0;
    const novoXP = xpAtual + missao.recompensa_xp;

    const { error: updateErr } = await supabase
      .from("desafios_usuario")
      .update({ xp_atual: novoXP })
      .eq("user_id", user_id)
      .eq("desafio_id", desafio_id);

    if (updateErr) {
      return NextResponse.json({ error: "Erro ao atualizar XP" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      xp_ganho: missao.recompensa_xp,
      xp_total: novoXP,
    });
  } catch (err) {
    console.error("API concluir-missao ERROR:", err);
    return NextResponse.json(
      { error: "Erro interno", details: err },
      { status: 500 }
    );
  }
}
