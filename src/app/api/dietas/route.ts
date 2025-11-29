import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Criar cliente do Supabase usando a NOVA lib
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const body = await req.json();

    // === GERAÇÃO IA ===
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.8,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "Você é uma nutricionista experiente e prática."
        },
        {
          role: "user",
          content: JSON.stringify(body)
        }
      ],
    });

    const textoGerado =
      completion.choices[0]?.message?.content || "Não consegui gerar agora.";

    // === SALVAR NO BANCO ===
    const { error } = await supabase.from("dietas_geradas").insert({
      user_id: session.user.id,
      dados: body,
      plano_texto: textoGerado,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Erro ao salvar no banco" }, { status: 500 });
    }

    return NextResponse.json({ plano: textoGerado });

  } catch (e) {
    console.error("Erro interno:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
