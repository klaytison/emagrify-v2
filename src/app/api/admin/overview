// src/app/api/admin/overview/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const [usersCount, activeSubs, paymentsSum, workoutsCount] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabaseAdmin
        .from("payments")
        .select("amount")
        .gte("created_at", new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()),
      supabaseAdmin
        .from("workouts")
        .select("*", { count: "exact", head: true }),
    ]);

    const totalRevenue =
      paymentsSum.data?.reduce((acc: number, p: any) => acc + (p.amount ?? 0), 0) ?? 0;

    return NextResponse.json({
      users: usersCount.count ?? 0,
      activeSubscriptions: activeSubs.count ?? 0,
      workouts: workoutsCount.count ?? 0,
      revenueLast30Days: totalRevenue,
    });
  } catch (err) {
    console.error("API /admin/overview error:", err);
    return NextResponse.json({ error: "Erro ao carregar overview" }, { status: 500 });
  }
}
