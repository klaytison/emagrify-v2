import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

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

    const messages = [
      {
        role: "system",
        content:
          "Você é uma nutricionista experiente, direta e prática. Crie planos alimentares simples e realistas."
      },
      {
        role: "user",
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
Rotina: ${rotina}
Acorda: ${acorda}
Dorme: ${dorme}
Preferência de sabor: ${preferenciaSabor}
Come de madrugada: ${madrugada}
Estresse: ${estresse}
Cafeína: ${cafeina}
Treino: ${treino}
Horas sentado: ${horasSentado}
Orçamento diário: R$${orcamento}

Monte um plano alimentar completo para 1 dia.
Use títulos com ###.
`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.8,
      max_tokens: 1000,
    });

    const textoGerado =
      completion.choices[0]?.message?.content ||
      "Não consegui gerar o plano agora.";

    // 🟢 SALVANDO NA COLUNA CORRETA
    const { error: insertError } = await supabase.from("dietas_geradas").insert({
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
      plano_texto: textoGerado, // ✔ AGORA ESTÁ CORRETO
    });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: "Erro ao salvar no banco." },
        { status: 500 }
      );
    }

    return NextResponse.json({ plano: textoGerado });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar plano." },
      { status: 500 }
    );
  }
}
