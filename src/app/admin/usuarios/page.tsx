'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Users as UsersIcon, 
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  Trash2,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, [busca]);

  async function carregarUsuarios() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busca) params.set('busca', busca);

      const res = await fetch(`/api/admin/usuarios?${params}`);
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deletarUsuario(id: string, email: string) {
    if (!confirm(`Tem certeza que deseja deletar o usuário ${email}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await fetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' });
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Usuários
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie todos os usuários do sistema
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
          <UsersIcon className="w-5 h-5" />
          <span className="font-semibold">{usuarios.length} usuários</span>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por email, nome ou ID..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Carregando...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="col-span-full p-12 text-center">
            <UsersIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Nenhum usuário encontrado</p>
          </div>
        ) : (
          usuarios.map((usuario) => {
            const assinaturasAtivas = usuario.assinaturas?.filter((a: any) => a.status === 'ativa').length || 0;
            
            return (
              <div
                key={usuario.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {/* Avatar e Nome */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {usuario.nome?.[0]?.toUpperCase() || usuario.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                      {usuario.nome || 'Sem nome'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {usuario.email}
                    </p>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CreditCard className="w-4 h-4" />
                      <span>Assinaturas</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {assinaturasAtivas} ativa{assinaturasAtivas !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span>Total gasto</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      R$ {usuario.total_gasto?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Cadastro</span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link
                    href={`/admin/usuarios/${usuario.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </Link>
                  <button
                    onClick={() => deletarUsuario(usuario.id, usuario.email)}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
