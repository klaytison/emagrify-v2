import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.rpc("ranking_semanal");

  if (error) {
    console.error("Erro ao carregar ranking:", error);
    return NextResponse.json({ error: "Erro ao carregar ranking" }, { status: 500 });
  }

  return NextResponse.json({ ranking: data });
}
