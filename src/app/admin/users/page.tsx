'use client';

import { useState } from 'react';
import { Search, Filter, UserPlus, MoreVertical, Lock, Unlock, Eye } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'canceled' | 'pending';
  createdAt: string;
  nextRenewal: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    plan: 'Premium',
    status: 'active',
    createdAt: '2024-01-15',
    nextRenewal: '2024-02-15',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    plan: 'Basic',
    status: 'active',
    createdAt: '2024-01-20',
    nextRenewal: '2024-02-20',
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    plan: 'Premium',
    status: 'pending',
    createdAt: '2024-01-25',
    nextRenewal: '2024-02-25',
  },
];

export default function UsersPage() {
  const [users] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Usuários</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie todos os usuários da plataforma
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
          <UserPlus className="w-5 h-5" />
          <span>Adicionar Usuário</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="canceled">Cancelado</option>
            <option value="pending">Pendente</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Usuário
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Plano
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Data de Criação
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Próxima Renovação
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-[#7BE4B7]/20 text-[#7BE4B7]">
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : user.status === 'canceled'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : user.status === 'canceled' ? 'Cancelado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(user.nextRenewal).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Lock className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
