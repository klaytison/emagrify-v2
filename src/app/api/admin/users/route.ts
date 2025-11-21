// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, name, goal, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("API /admin/users error:", err);
    return NextResponse.json({ error: "Erro ao carregar usuários" }, { status: 500 });
  }
}
