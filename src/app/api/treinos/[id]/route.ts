import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: { id: string } }) {
  try {
    const supabase = createClient();

    const { id } = ctx.params;

    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ plan: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao carregar treino." },
      { status: 500 }
    );
  }
}
