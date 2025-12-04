import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, desafio_id, missao_id } = body;

    if (!user_id || !desafio_id || !missao_id) {
      return NextResponse.json(
        { error: "Dados inválidos. Envie user_id, desafio_id e missao_id." },
        { status: 400 }
      );
    }

    // 🔐 Conecta usando SERVICE_ROLE (necessário para atualizar tabelas protegidas)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1️⃣ Verifica se missão existe
    const { data: missao, error: missaoErr } = await supabase
      .from("desafios_missoes")
      .select("*")
      .eq("id", missao_id)
      .eq("desafio_id", desafio_id)
      .maybeSingle();

    if (missaoErr || !missao) {
      return NextResponse.json(
        { error: "Missão não encontrada", details: missaoErr },
        { status: 404 }
      );
    }

    // 2️⃣ Busca status do usuário
    const { data: userStatus, error: userStatusErr } = await supabase
      .from("desafios_usuario")
      .select("*")
      .eq("user_id", user_id)
      .eq("desafio_id", desafio_id)
      .maybeSingle();

    if (userStatusErr) {
      return NextResponse.json(
        { error: "Erro ao consultar progresso do usuário", details: userStatusErr },
        { status: 500 }
      );
    }

    const xpAtual = userStatus?.xp_atual ?? 0;
    const novoXP = xpAtual + (missao.recompensa_xp ?? 0);

    // 3️⃣ Marca missão como concluída (UPsert)
    const { error: statusInsertErr } = await supabase
      .from("desafios_missoes_status")
      .upsert({
        user_id,
        desafio_id,
        missao_id,
        concluida: true,
        concluida_em: new Date(),
      });

    if (statusInsertErr) {
      return NextResponse.json(
        { error: "Erro ao registrar conclusão da missão", details: statusInsertErr },
        { status: 500 }
      );
    }

    // 4️⃣ Atualiza XP do usuário no desafio
    const { error: updateErr } = await supabase
      .from("desafios_usuario")
      .update({
        xp_atual: novoXP,
        atualizado_em: new Date(),
      })
      .eq("user_id", user_id)
      .eq("desafio_id", desafio_id);

    if (updateErr) {
      return NextResponse.json(
        { error: "Erro ao atualizar XP do usuário", details: updateErr },
        { status: 500 }
      );
    }

    // 5️⃣ Verifica quantas missões foram concluídas
    const { data: todasConcluidas } = await supabase
      .from("desafios_missoes_status")
      .select("*")
      .eq("user_id", user_id)
      .eq("desafio_id", desafio_id)
      .eq("concluida", true);

    const { data: missoesDesafio } = await supabase
      .from("desafios_missoes")
      .select("*")
      .eq("desafio_id", desafio_id);

    const concluidas = todasConcluidas?.length ?? 0;
    const total = missoesDesafio?.length ?? 0;
    const completouTudo = concluidas >= total;

    // 6️⃣ Se concluiu tudo, atualiza na tabela usuário
    if (completouTudo) {
      await supabase
        .from("desafios_usuario")
        .update({
          completou_tudo: true,
          atualizado_em: new Date(),
        })
        .eq("user_id", user_id)
        .eq("desafio_id", desafio_id);
    }

    return NextResponse.json({
      success: true,
      xpGanhos: missao.recompensa_xp,
      xpTotal: novoXP,
      completouTudo,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno do servidor", details: String(err) },
      { status: 500 }
    );
  }
}
