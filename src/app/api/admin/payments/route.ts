// src/app/api/admin/payments/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("id, user_id, amount, status, provider, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("API /admin/payments error:", err);
    return NextResponse.json({ error: "Erro ao carregar pagamentos" }, { status: 500 });
  }
}
