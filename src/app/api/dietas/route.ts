// src/app/api/dietas/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      objetivo,
      sexo,
      idade,
      peso,
      altura,
      nivelAtividade,
      refeicoesPorDia,
      restricoes,
      preferencias,
      rotina,
    } = body;

    const messages = [
      {
        role: "system" as const,
        content:
          "Você é uma nutricionista experiente, direta e prática. " +
          "Crie planos alimentares simples, realistas, em português do Brasil, " +
          "sempre deixando claro que é uma sugestão e não substitui acompanhamento profissional.",
      },
      {
        role: "user" as const,
        content: `
Dados da pessoa:
- Objetivo: ${objetivo || "não informado"}
- Sexo: ${sexo || "não informado"}
- Idade: ${idade || "não informada"}
- Peso: ${peso || "não informado"} kg
- Altura: ${altura || "não informada"} cm
- Nível de atividade: ${nivelAtividade || "não informado"}
- Nº de refeições por dia: ${refeicoesPorDia || "não informado"}
- Restrições: ${restricoes || "nenhuma"}
- Preferências: ${preferencias || "não informado"}
- Rotina do dia a dia: ${rotina || "não informado"}

Crie UM PLANO alimentar para 1 dia, com base nesses dados.

Regras:
- Use títulos com "###" para seções (Resumo, Distribuição de Calorias, Refeições do dia, Observações).
- Liste as refeições assim: Café da manhã, Lanche da manhã, Almoço, Lanche da tarde, Jantar, Ceia (se fizer sentido).
- Em cada refeição, traga:
  - Opções de alimentos em linguagem simples
  - Porções aproximadas (ex: 2 colheres de sopa, 1 unidade média, etc.)
- Adapte quantidade de refeições ao número informado.
- Se houver restrições ou preferências, respeite SEMPRE.
- Traga 2 ou 3 sugestões de substituições simples para o dia.
- No final, escreva um aviso curto: 
  "Essa sugestão não substitui acompanhamento profissional com nutricionista."
        `,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.8,
      max_tokens: 900,
    });

    const texto =
      completion.choices[0]?.message?.content ||
      "Não consegui gerar o plano agora. Tente novamente em alguns instantes.";

    return NextResponse.json({ plano: texto });
  } catch (error: any) {
    console.error("Erro na rota /api/dietas:", error);
    return NextResponse.json(
      { error: "Erro ao gerar plano com IA." },
      { status: 500 }
    );
  }
}
