// src/app/api/admin/subscriptions/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("id, user_id, status, plan_name, price, period, renew_at, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("API /admin/subscriptions error:", err);
    return NextResponse.json(
      { error: "Erro ao carregar assinaturas" },
      { status: 500 }
    );
  }
}
