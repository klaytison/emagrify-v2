import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// === UTIL: Descobrir semana atual ===
function semanaAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();

  // Número da semana (ISO)
  const primeiraQuinta = new Date(hoje.getFullYear(), 0, 4);
  const diff = hoje.getTime() - primeiraQuinta.getTime();
  const umaSemana = 7 * 24 * 60 * 60 * 1000;
  const semana = Math.ceil((diff / umaSemana) + 1);

  return `${ano}-${semana}`;
}

// === GET: retorna o desafio da semana ===
export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const semana = semanaAtual();

  const { data, error } = await supabase
    .from("desafios_semanais")
    .select("*")
    .eq("user_id", userId)
    .eq("semana", semana)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar desafio." }, { status: 500 });
  }

  return NextResponse.json({ desafio: data });
}

// === POST: atualizar progresso ou criar desafio ===
export async function POST(req: Request) {
  const body = await req.json();
  const userId = body.userId;

  if (!userId) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const semana = semanaAtual();

  // Se ainda não existir um desafio para esta semana, cria um padrão
  const { data: existente } = await supabase
    .from("desafios_semanais")
    .select("*")
    .eq("user_id", userId)
    .eq("semana", semana)
    .maybeSingle();

  if (!existente) {
    const novoDesafio = {
      user_id: userId,
      semana,
      titulo: "Desafio da semana 💪",
      descricao: "Complete pequenas tarefas para manter o foco e seguir evoluindo.",
      progresso: [false, false, false, false, false, false, false],
    };

    const { data, error } = await supabase
      .from("desafios_semanais")
      .insert(novoDesafio)
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Erro ao criar desafio." }, { status: 500 });
    }

    return NextResponse.json({ desafio: data });
  }

  // Atualiza o progresso existente
  const progresso = body.progresso;

  const { data, error } = await supabase
    .from("desafios_semanais")
    .update({ progresso })
    .eq("id", existente.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar progresso." }, { status: 500 });
  }

  return NextResponse.json({ desafio: data });
}

