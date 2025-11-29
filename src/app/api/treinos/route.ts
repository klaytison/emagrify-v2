// src/app/api/treinos/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      objetivoPrincipal,
      nivelTreino,
      ambiente,
      diasPorSemana,
      minutosPorTreino,
      sexo,
      idade,
      altura,
      peso,
      condicoes,
      tipoCorpo,
      energia,
      preferenciasTreino,
      restricoes,
      focoRegioes,
    } = body;

    // 🔎 Validação mínima (só para não chamar IA com tudo vazio)
    if (!objetivoPrincipal || !diasPorSemana || !minutosPorTreino) {
      return NextResponse.json(
        {
          error:
            "Preencha pelo menos objetivo principal, dias por semana e minutos por treino.",
        },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system" as const,
        content:
          "Você é um personal trainer experiente, direto e cuidadoso. " +
          "Crie treinos realistas, seguros, em português do Brasil, " +
          "pensando em pessoas comuns (não atletas). Sempre respeite lesões, limitações e nível de condicionamento. " +
          "Explique em linguagem simples como se estivesse orientando um aluno.",
      },
      {
        role: "user" as const,
        content: `
Quero um TREINO ADAPTADO completo baseado nesses dados:

Objetivo principal: ${objetivoPrincipal || "não informado"}
Nível de treino: ${nivelTreino || "não informado"}
Ambiente de treino: ${ambiente || "não informado"}
Dias por semana disponíveis: ${diasPorSemana || "não informado"}
Minutos por treino: ${minutosPorTreino || "não informado"}

Sexo: ${sexo || "não informado"}
Idade: ${idade || "não informada"}
Altura: ${altura || "não informada"} cm
Peso: ${peso || "não informado"} kg
Tipo de corpo: ${tipoCorpo || "não informado"}
Nível de energia/disposição: ${energia || "não informado"}

Condições físicas, dores ou lesões: ${condicoes || "nenhuma informada"}
Restrições ou exercícios proibidos: ${restricoes || "não informado"}
Preferências de treino: ${preferenciasTreino || "não informado"}
Regiões de foco (se houver): ${focoRegioes || "não informado"}

Regras do plano:
- Crie um PLANO SEMANAL de treino (ex: Segunda, Terça, etc.), respeitando o número de dias informado.
- Cada dia deve ter:
  - Aquecimento rápido
  - Parte principal (exercícios, séries e repetições)
  - Observações de intensidade, pausa, carga e execução
- Use exercícios condizentes com o AMBIENTE:
  - Se for "casa sem equipamentos": foque em peso do corpo
  - Se for "casa com equip": use halteres, elástico, etc quando fizer sentido
  - Se for "academia": use máquinas e pesos livres de forma equilibrada
- Se houver lesão ou dor, NÃO use exercícios que normalmente pioram essa região. Sugira alternativas.
- Ajuste volume e intensidade conforme nível: iniciante, intermediário ou avançado.
- Adapte a duração aproximada para caber nos minutos por treino.

FORMATO DE RESPOSTA (importantíssimo):
Use títulos com "###" para separar as seções:

### Resumo do plano
(um parágrafo curto explicando a lógica do treino)

### Divisão semanal
(lista dos dias e foco, ex: Segunda - Corpo todo, Terça - Descanso ativo, etc.)

### Treinos detalhados
(para cada dia DE TREINO, mostrar:
- Dia (ex: Segunda-feira)
- Aquecimento
- Exercícios (nome, séries, repetições, descanso e, quando útil, sugestões de carga)
- Dicas rápidas de execução)

### Alongamento e recuperação
(sugestão geral de alongamentos pós-treino ou em dias de descanso)

### Observações importantes
(coloque alertas de segurança, sinais para reduzir intensidade e lembrete
que deve procurar um profissional presencial se sentir dor diferente de cansaço)

Não use linguagem técnica difícil. Fale como um personal conversando direto com o aluno.
`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.8,
      max_tokens: 1200,
    });

    const textoGerado =
      completion.choices[0]?.message?.content ||
      "Não consegui montar o treino agora. Tente novamente em alguns instantes.";

    return NextResponse.json({ plano: textoGerado });
  } catch (error) {
    console.error("Erro na rota /api/treinos-adaptados:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar treino." },
      { status: 500 }
    );
  }
}
