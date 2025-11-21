import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pergunta } = await req.json();

  if (!pergunta) {
    return NextResponse.json(
      { error: "Pergunta é obrigatória." },
      { status: 400 }
    );
  }

  // Aqui você integra com OpenAI depois.
  // Por enquanto, é uma resposta simples:
  const resposta =
    "O suporte com IA ainda está sendo configurado. " +
    "Em breve você receberá respostas personalizadas sobre treino, dieta e motivação.";

  return NextResponse.json({ resposta });
}

