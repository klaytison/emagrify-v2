import { SupabaseClient } from "@supabase/supabase-js";

export async function adicionarXP(supabase: SupabaseClient, userId: string, xpGanho: number) {
  // Buscar dados atuais
  const { data, error } = await supabase
    .from("gamificacao")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return;

  const xpTotal = data.xp + xpGanho;
  const novoNivel = Math.floor(xpTotal / 100) + 1;

  const medalhas = new Set(data.medalhas || []);

  // Liberar medalhas automaticamente
  if (novoNivel >= 5) medalhas.add("Iniciante dedicado");
  if (novoNivel >= 10) medalhas.add("Constante");
  if (novoNivel >= 20) medalhas.add("Disciplina Suprema");

  // Atualizar
  await supabase
    .from("gamificacao")
    .update({
      xp: xpTotal,
      nivel: novoNivel,
      medalhas: Array.from(medalhas),
      atualizado_em: new Date(),
    })
    .eq("user_id", userId);
}
