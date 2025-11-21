// src/app/api/admin/progress/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("progress")
      .select("id, user_id, weight, body_fat, calories, steps, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("API /admin/progress error:", err);
    return NextResponse.json(
      { error: "Erro ao carregar progresso" },
      { status: 500 }
    );
  }
}
