import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ plans: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao carregar treinos." },
      { status: 500 }
    );
  }
}
