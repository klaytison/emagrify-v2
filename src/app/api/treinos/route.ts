import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("treinos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ treinos: data });
}

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  const { titulo, nivel, foco, descricao, plano } = body;

  if (!titulo || !nivel || !foco || !plano) {
    return NextResponse.json(
      { error: "Dados incompletos para criar o treino." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("treinos")
    .insert({
      titulo,
      nivel,
      foco,
      descricao: descricao || "",
      plano,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ treino: data });
}
