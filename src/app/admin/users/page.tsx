"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users");

        const json = await res.json();

        if (json.users) {
          setUsers(json.users);
        }
      } catch (err) {
        console.error("Erro:", err);
      }

      setLoading(false);
    }

    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Usuários</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 bg-white rounded-xl shadow border"
            >
              <p className="font-bold text-lg">{u.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                ID: {u.id}
              </p>
              <p className="text-sm text-gray-500">
                Criado em:{" "}
                {u.created_at
                  ? new Date(u.created_at).toLocaleString()
                  : "Desconhecido"}
              </p>
              <p className="text-green-600 font-semibold mt-2">Ativo</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
