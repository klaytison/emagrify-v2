import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();

  const { user_id, desafio_id, missao_id } = body;

  if (!user_id || !desafio_id || !missao_id) {
    return NextResponse.json(
      { error: "Dados incompletos para concluir missão." },
      { status: 400 }
    );
  }

  // buscar dados da missão
  const { data: missao, error: errMissao } = await supabase
    .from("desafios_missoes")
    .select("*")
    .eq("id", missao_id)
    .maybeSingle();

  if (errMissao || !missao) {
    return NextResponse.json({ error: "Missão não encontrada." });
  }

  // buscar status do usuário no desafio
  const { data: userStatus } = await supabase
    .from("desafios_usuario")
    .select("*")
    .eq("user_id", user_id)
    .eq("desafio_id", desafio_id)
    .maybeSingle();

  if (!userStatus) {
    return NextResponse.json({
      error: "Usuário não está vinculado ao desafio.",
    });
  }

  const novoXP = userStatus.xp_atual + missao.recompensa_xp;

  // atualizar XP
  await supabase
    .from("desafios_usuario")
    .update({
      xp_atual: novoXP,
      atualizado_em: new Date().toISOString(),
    })
    .eq("user_id", user_id)
    .eq("desafio_id", desafio_id);

  // verificar obrigatórias
  const { data: missoes } = await supabase
    .from("desafios_missoes")
    .select("*")
    .eq("desafio_id", desafio_id);

  const obrigatorias = missoes.filter((m) => m.obrigatoria);
  const concluidasObrig = obrigatorias.length - 1; // atual concluída

  const completouObrig = concluidasObrig + 1 === obrigatorias.length;

  // verificar todas as missões
  const total = missoes.length;
  const concluidas = total - 1;

  const completouTudo = concluidas + 1 === total;

  // atualizar status gerais
  await supabase
    .from("desafios_usuario")
    .update({
      completou_treinos_obrigatorios: completouObrig,
      completou_tudo: completouTudo,
    })
    .eq("user_id", user_id)
    .eq("desafio_id", desafio_id);

  return NextResponse.json({
    ok: true,
    xpAtual: novoXP,
    completouObrig,
    completouTudo,
  });
}
