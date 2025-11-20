'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function DashboardPage() {
  const supabase = getSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        // Lista os usuários do Supabase Auth (página 1, 100 usuários)
        const { data, error } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 100
        });

        if (error) {
          console.error("Erro ao buscar usuários:", error);
        } else {
          setTotalUsers(data.users.length);
        }

      } catch (err) {
        console.error("Erro no dashboard:", err);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-[#F4F4F4]">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold">Total de usuários</h2>

          {loading ? (
            <p className="text-gray-500 mt-2">Carregando...</p>
          ) : (
            <p className="text-4xl font-bold text-green-600 mt-2">
              {totalUsers}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
