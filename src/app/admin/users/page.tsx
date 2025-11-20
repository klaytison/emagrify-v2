'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function UsersPage() {
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });

      if (error) {
        console.error("Erro ao buscar usuários:", error);
      } else {
        setUsers(data.users);
      }

      setLoading(false);
    }

    loadUsers();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Usuários</h1>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Criado em:</strong> {new Date(user.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
