import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // -------------------------------
    // 1) Supabase (sessão do usuário)
    // -------------------------------
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // -------------------------------
    // 2) Dados enviados pelo front
    // -------------------------------
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
      acorda,
      dorme,
      preferenciaSabor,
      madrugada,
      estresse,
      cafeina,
      treino,
      horasSentado,
      orcamento,
      objetivoSecundario,
    } = body;

    // -------------------------------
    // 3) Prompt para IA  
    // -------------------------------
    const messages = [
      {
        role: "system" as const,
        content:
          "Você é uma nutricionista experiente, direta e prática. " +
          "Crie planos alimentares simples, realistas, em português do Brasil, " +
          "e bem personalizados. Sempre deixe claro que é uma sugestão.",
      },
      {
        role: "user" as const,
        content: `
Dados completos da pessoa:

Objetivo principal: ${objetivo}
Objetivo secundário: ${objetivoSecundario}

Sexo: ${sexo}
Idade: ${idade}
Peso: ${peso} kg  
Altura: ${altura} cm  
Nível de atividade: ${nivelAtividade}

Refeições por dia: ${refeicoesPorDia}
Restrições: ${restricoes}
Preferências: ${preferencias}
Rotina geral: ${rotina}

Horário que acorda: ${acorda}
Horário que dorme: ${dorme}

Preferência de sabor: ${preferenciaSabor}
Come de madrugada? ${madrugada}

Nível de estresse: ${estresse}
Consumo de cafeína: ${cafeina}
Rotina de treino: ${treino}
Horas sentado: ${horasSentado}
Orçamento diário: R$${orcamento}

Crie um plano ALIMENTAR COMPLETO de 1 dia, seguindo as regras:

### Regras obrigatórias:
- Use títulos com "###"
- Divida em seções: Resumo, Perfil nutricional, Refeições do dia, Substituições, Observações
- Adapte totalmente ao estilo de vida e horários
- Ajuste refeições conforme número informado
- Sempre respeite preferências e restrições
- Ofereça substituições simples
- Linguagem simples e direta
- No final coloque:
  "Essa sugestão não substitui acompanhamento nutricional profissional."
`,
      },
    ];

    // -------------------------------
    // 4) Chamada à IA
    // -------------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.8,
      max_tokens: 1000,
    });

    const textoGerado =
      completion.choices[0]?.message?.content ||
      "Não consegui gerar o plano agora. Tente novamente.";

    // -------------------------------
    // 5) Salvar no Supabase
    // -------------------------------
    await supabase.from("dietas_geradas").insert({
      user_id: session.user.id,
      dados: {
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
        acorda,
        dorme,
        preferenciaSabor,
        madrugada,
        estresse,
        cafeina,
        treino,
        horasSentado,
        orcamento,
        objetivoSecundario,
      },
      plano: textoGerado,
    });

    // -------------------------------
    // 6) Retorno
    // -------------------------------
    return NextResponse.json({
      plano: textoGerado,
    });
  } catch (error) {
    console.error("Erro na rota /api/dietas:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar plano." },
      { status: 500 }
    );
  }
}
