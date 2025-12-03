import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Buscar desafios ativos
    const { data, error } = await supabase
      .from("desafios")
      .select("*")
      .eq("ativo", true)
      .order("criado_em", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ desafios: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Erro interno", detalhes: String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();

  try {
    const { data, error } = await supabase.from("desafios").insert(body).select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ criado: data[0] });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Erro interno", detalhes: String(e) },
      { status: 500 }
    );
  }
}
