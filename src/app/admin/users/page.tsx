"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

type SupabaseUser = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    role?: "admin" | "user";
    suspended?: boolean;
  };
};

export default function UsersPage() {
  const supabase = getSupabaseClient();

  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Carrega lista de usuários
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();

        if (data.users) {
          setUsers(data.users);
        }
      } catch (e) {
        console.error(e);
        alert("Erro ao carregar usuários.");
      }
      setLoading(false);
    }

    loadUsers();
  }, []);

  function updateUserInState(updated: SupabaseUser) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
  }

  function removeUserFromState(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  // Alternar admin <-> user
  async function toggleAdmin(user: SupabaseUser) {
    if (!user.id) return;
    const currentRole = user.user_metadata?.role || "user";
    const newRole = currentRole === "admin" ? "user" : "admin";

    if (
      !confirm(
        `Tem certeza que quer tornar este usuário "${newRole}"?`
      )
    )
      return;

    setBusyId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert(data.error || "Erro ao atualizar papel.");
      } else {
        updateUserInState(data.user);
      }
    } finally {
      setBusyId(null);
    }
  }

  // Suspender / reativar (flag em metadata)
  async function toggleSuspended(user: SupabaseUser) {
    if (!user.id) return;

    const isSuspended = !!user.user_metadata?.suspended;
    const actionLabel = isSuspended ? "reativar" : "suspender";

    if (
      !confirm(
        `Tem certeza que deseja ${actionLabel} este usuário?`
      )
    )
      return;

    setBusyId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: !isSuspended }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert(data.error || "Erro ao atualizar status.");
      } else {
        updateUserInState(data.user);
      }
    } finally {
      setBusyId(null);
    }
  }

  // Resetar senha (envia email de recuperação)
  async function resetPassword(user: SupabaseUser) {
    if (!user.email) {
      alert("Usuário sem e-mail.");
      return;
    }

    if (
      !confirm(
        `Enviar e-mail de redefinição de senha para ${user.email}?`
      )
    )
      return;

    setBusyId(user.id);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        user.email
      );
      if (error) {
        console.error(error);
        alert("Erro ao enviar e-mail de redefinição.");
      } else {
        alert("E-mail de redefinição enviado (se o email estiver ativo).");
      }
    } finally {
      setBusyId(null);
    }
  }

  // Deletar usuário
  async function deleteUser(user: SupabaseUser) {
    if (!user.id || !user.email) return;

    if (
      !confirm(
        `Tem certeza ABSOLUTA que deseja EXCLUIR o usuário ${user.email}? Esta ação não pode ser desfeita.`
      )
    )
      return;

    setBusyId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        alert(data.error || "Erro ao deletar usuário.");
      } else {
        removeUserFromState(user.id);
      }
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-white">
        <h1 className="text-3xl font-bold mb-4">Usuários</h1>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Usuários</h1>

      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {users.map((user) => {
            const meta = user.user_metadata || {};
            const email = user.email || "sem e-mail";
            const createdAt = user.created_at
              ? new Date(user.created_at).toLocaleString("pt-BR")
              : "desconhecido";
            const role = meta.role || "user";
            const isSuspended = !!meta.suspended;

            return (
              <div
                key={user.id}
                className="bg-white text-slate-900 rounded-xl shadow p-4 flex flex-col gap-3"
              >
                <div>
                  <p className="font-semibold">{email}</p>
                  <p className="text-xs text-slate-500 break-all mt-1">
                    ID: {user.id}
                  </p>
                  <p className="text-xs text-slate-500">
                    Criado em: {createdAt}
                  </p>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Papel: {role === "admin" ? "Admin" : "Usuário"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full border ${
                      isSuspended
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-green-50 text-green-700 border-green-200"
                    }`}
                  >
                    {isSuspended ? "Suspenso" : "Ativo"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs mt-1">
                  <button
                    onClick={() => toggleAdmin(user)}
                    disabled={busyId === user.id}
                    className="px-3 py-1 rounded-full bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
                  >
                    {user.user_metadata?.role === "admin"
                      ? "Tornar usuário comum"
                      : "Tornar admin"}
                  </button>

                  <button
                    onClick={() => toggleSuspended(user)}
                    disabled={busyId === user.id}
                    className="px-3 py-1 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {isSuspended ? "Reativar" : "Suspender"}
                  </button>

                  <button
                    onClick={() => resetPassword(user)}
                    disabled={busyId === user.id}
                    className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    Resetar senha
                  </button>

                  <button
                    onClick={() => deleteUser(user)}
                    disabled={busyId === user.id}
                    className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
