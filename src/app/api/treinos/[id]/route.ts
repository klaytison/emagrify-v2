import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const treinoId = params.id;

  const { data, error } = await supabase
    .from("treinos")
    .select("*")
    .eq("id", treinoId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Treino não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ plan: data });
}
