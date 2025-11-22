import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("treinos_favoritos")
    .select("treino_id, created_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ favorites: data });
}

export async function POST(req: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { treino_id } = body;

  if (!treino_id) {
    return NextResponse.json(
      { error: "treino_id é obrigatório" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("treinos_favoritos")
    .insert({ user_id: user.id, treino_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { treino_id } = body;

  if (!treino_id) {
    return NextResponse.json(
      { error: "treino_id é obrigatório" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("treinos_favoritos")
    .delete()
    .eq("user_id", user.id)
    .eq("treino_id", treino_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
