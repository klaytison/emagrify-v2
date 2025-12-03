import { createRouteHandlerSupabaseClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await createRouteHandlerSupabaseClient();

  const hoje = new Date();
  const semana = Number(
    Intl.DateTimeFormat("en", { week: "numeric" }).format(hoje)
  );
  const ano = hoje.getFullYear();

  const { data: desafio } = await supabase
    .from("desafios")
    .select(
      `*, missoes:desafios_missoes(*), usuario:desafios_usuario(*)`
    )
    .eq("semana", semana)
    .eq("ano", ano)
    .maybeSingle();

  return Response.json({ desafio });
}
