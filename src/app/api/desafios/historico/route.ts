import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("desafios_semanais")
    .select("*")
    .eq("user_id", user.id)
    .order("semana", { ascending: false }); // semanas mais recentes primeiro

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao carregar histórico" },
      { status: 500 }
    );
  }

  return NextResponse.json({ historico: data });
}
