'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Gift,
  X,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function AssinaturasPage() {
  const [assinaturas, setAssinaturas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState({ status: '', plano: '', busca: '' });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'criar' | 'doar' | null>(null);

  useEffect(() => {
    carregarAssinaturas();
  }, [filtro]);

  async function carregarAssinaturas() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtro.status) params.set('status', filtro.status);
      if (filtro.plano) params.set('plano', filtro.plano);
      if (filtro.busca) params.set('busca', filtro.busca);

      const res = await fetch(`/api/admin/assinaturas?${params}`);
      const data = await res.json();
      setAssinaturas(data);
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function cancelarAssinatura(id: string) {
    if (!confirm('Tem certeza que deseja cancelar esta assinatura?')) return;

    try {
      await fetch(`/api/admin/assinaturas/${id}/cancelar`, { method: 'POST' });
      carregarAssinaturas();
    } catch (error) {
      console.error('Erro ao cancelar:', error);
    }
  }

  async function estenderAssinatura(id: string) {
    const meses = prompt('Quantos meses deseja adicionar?');
    if (!meses || isNaN(Number(meses))) return;

    try {
      await fetch(`/api/admin/assinaturas/${id}/estender`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meses: Number(meses) }),
      });
      carregarAssinaturas();
    } catch (error) {
      console.error('Erro ao estender:', error);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativa':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expirada':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelada':
        return <X className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expirada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelada':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Assinaturas
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie todas as assinaturas do sistema
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal('doar')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Gift className="w-5 h-5" />
            Doar Assinatura
          </button>
          <button
            onClick={() => setShowModal('criar')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nova Assinatura
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por email ou nome..."
              value={filtro.busca}
              onChange={(e) => setFiltro({ ...filtro, busca: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filtro.status}
            onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="ativa">Ativa</option>
            <option value="expirada">Expirada</option>
            <option value="cancelada">Cancelada</option>
            <option value="suspensa">Suspensa</option>
          </select>

          <select
            value={filtro.plano}
            onChange={(e) => setFiltro({ ...filtro, plano: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os planos</option>
            <option value="Básico">Básico</option>
            <option value="Premium">Premium</option>
            <option value="Anual">Anual</option>
          </select>
        </div>
      </div>

      {/* Lista de Assinaturas */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Carregando...</p>
          </div>
        ) : assinaturas.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Nenhuma assinatura encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
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
                    Validade
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Valor
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {assinaturas.map((assinatura) => (
                  <tr
                    key={assinatura.id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {assinatura.nome || 'Sem nome'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {assinatura.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {assinatura.plano}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(assinatura.status)}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assinatura.status)}`}>
                          {assinatura.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        {assinatura.dias_restantes} dias
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        até {new Date(assinatura.data_fim).toLocaleDateString('pt-BR')}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        R$ {Number(assinatura.valor_mensal).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        /mês
                      </p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => estenderAssinatura(assinatura.id)}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          Estender
                        </button>
                        {assinatura.status === 'ativa' && (
                          <button
                            onClick={() => cancelarAssinatura(assinatura.id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
