// src/app/admin/page.tsx
"use client";

import { useAdminOverview, useAdminList } from "@/hooks/useAdminData";
import {
  Activity,
  CreditCard,
  Users,
  BarChart3,
  TrendingUp,
  Dumbbell,
} from "lucide-react";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminPage() {
  const { data: overview, loading: loadingOverview } = useAdminOverview();
  const { data: users, loading: loadingUsers } = useAdminList<any>("/api/admin/users");
  const { data: subs, loading: loadingSubs } = useAdminList<any>("/api/admin/subscriptions");
  const { data: payments, loading: loadingPayments } = useAdminList<any>("/api/admin/payments");
  const { data: progress, loading: loadingProgress } = useAdminList<any>("/api/admin/progress");

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Título */}
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-sm text-gray-400">
            Visão geral do Emagrify – usuários, assinaturas, pagamentos e progresso.
          </p>
        </header>

        {/* Cards de overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <OverviewCard
            icon={<Users className="w-5 h-5 text-emerald-400" />}
            label="Usuários"
            value={
              loadingOverview
                ? "Carregando..."
                : (overview?.users ?? 0).toLocaleString("pt-BR")
            }
          />
          <OverviewCard
            icon={<Activity className="w-5 h-5 text-sky-400" />}
            label="Assinaturas ativas"
            value={
              loadingOverview
                ? "Carregando..."
                : (overview?.activeSubscriptions ?? 0).toLocaleString("pt-BR")
            }
          />
          <OverviewCard
            icon={<Dumbbell className="w-5 h-5 text-violet-400" />}
            label="Treinos cadastrados"
            value={
              loadingOverview
                ? "Carregando..."
                : (overview?.workouts ?? 0).toLocaleString("pt-BR")
            }
          />
          <OverviewCard
            icon={<CreditCard className="w-5 h-5 text-amber-400" />}
            label="Receita (30 dias)"
            value={
              loadingOverview
                ? "Carregando..."
                : formatCurrency(overview?.revenueLast30Days ?? 0)
            }
          />
        </section>

        {/* Tabelas */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Usuários */}
          <AdminCard title="Últimos usuários" subtitle="Até 50 mais recentes">
            {loadingUsers ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : (
              <Table
                headers={["Nome", "Email", "Objetivo", "Criado em"]}
                rows={users.map((u) => [
                  u.name ?? "-",
                  u.email ?? "-",
                  u.goal ?? "-",
                  new Date(u.created_at).toLocaleDateString("pt-BR"),
                ])}
              />
            )}
          </AdminCard>

          {/* Assinaturas */}
          <AdminCard title="Assinaturas" subtitle="Últimas assinaturas criadas">
            {loadingSubs ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : (
              <Table
                headers={["Plano", "Status", "Preço", "Período", "Criado em"]}
                rows={subs.map((s) => [
                  s.plan_name ?? "-",
                  s.status ?? "-",
                  s.price != null ? formatCurrency(s.price) : "-",
                  s.period ?? "-",
                  new Date(s.created_at).toLocaleDateString("pt-BR"),
                ])}
              />
            )}
          </AdminCard>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          {/* Pagamentos */}
          <AdminCard title="Pagamentos" subtitle="Últimos 50 pagamentos">
            {loadingPayments ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : (
              <Table
                headers={["Valor", "Status", "Gateway", "Criado em"]}
                rows={payments.map((p) => [
                  p.amount != null ? formatCurrency(p.amount) : "-",
                  p.status ?? "-",
                  p.provider ?? "-",
                  new Date(p.created_at).toLocaleDateString("pt-BR"),
                ])}
              />
            )}
          </AdminCard>

          {/* Progresso */}
          <AdminCard
            title="Progresso recente"
            subtitle="Peso, gordura e calorias registradas"
          >
            {loadingProgress ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : (
              <Table
                headers={["Usuário", "Peso (kg)", "% Gordura", "Calorias", "Data"]}
                rows={progress.map((p) => [
                  p.user_id ?? "-",
                  p.weight ?? "-",
                  p.body_fat ?? "-",
                  p.calories ?? "-",
                  new Date(p.created_at).toLocaleDateString("pt-BR"),
                ])}
              />
            )}
          </AdminCard>
        </section>
      </div>
    </main>
  );
}

function OverviewCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
          {icon}
        </span>
        <BarChart3 className="w-4 h-4 text-gray-600" />
      </div>
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function AdminCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <TrendingUp className="w-4 h-4 text-gray-600" />
      </div>
      <div className="border-t border-gray-800 pt-3">{children}</div>
    </div>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number | null | undefined)[][];
}) {
  if (!rows.length) {
    return <p className="text-sm text-gray-500">Nenhum dado encontrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
            {headers.map((h) => (
              <th key={h} className="pb-2 pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-800/40">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4">
                  {cell ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
