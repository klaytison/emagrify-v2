'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';

type SupabaseUser = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function UsersPage() {
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();

        if (res.ok && data.users) {
          setUsers(data.users);
        } else {
          setError(data.error || 'Não foi possível carregar os usuários.');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar usuários.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.toLowerCase();
    return users.filter((user) => {
      const name = user.user_metadata?.full_name || '';
      const email = user.email || '';
      return (
        name.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Usuários</h1>
            <p className="text-sm text-slate-500 mt-1">
              Gerencie os usuários cadastrados pela autenticação do Supabase.
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
        </div>

        {loading && (
          <div className="bg-white p-6 rounded-xl shadow text-sm text-slate-500">
            Carregando usuários...
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredUsers.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow text-sm text-slate-500">
                Nenhum usuário encontrado.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsers.map((user) => {
                  const name =
                    user.user_metadata?.full_name ||
                    user.email?.split('@')[0] ||
                    'Usuário sem nome';

                  const email = user.email || 'sem e-mail';
                  const createdAt = user.created_at
                    ? new Date(user.created_at).toLocaleDateString('pt-BR')
                    : 'Data desconhecida';

                  const initial = name.charAt(0).toUpperCase();

                  return (
                    <div
                      key={user.id}
                      className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#7BE4B7] flex items-center justify-center text-white font-bold text-lg">
                          {initial}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {email}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                          Ativo
                        </span>
                        <span>Criado em {createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
