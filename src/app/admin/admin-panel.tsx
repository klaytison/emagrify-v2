'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  Search,
  Plus,
  Edit,
  X,
  Check,
  Calendar,
  TrendingUp,
  FileText,
  Download
} from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [assinaturas, setAssinaturas] = useState<any[]>([]);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadStats();
    loadUsuarios();
    loadAssinaturas();
    loadTransacoes();
    loadLogs();
  }, []);

  const loadStats = async () => {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setStats(data);
  };

  const loadUsuarios = async () => {
    const res = await fetch(`/api/admin/usuarios${searchTerm ? `?search=${searchTerm}` : ''}`);
    const data = await res.json();
    setUsuarios(data);
  };

  const loadAssinaturas = async () => {
    const res = await fetch('/api/admin/assinaturas');
    const data = await res.json();
    setAssinaturas(data);
  };

  const loadTransacoes = async () => {
    const res = await fetch('/api/admin/transacoes');
    const data = await res.json();
    setTransacoes(data);
  };

  const loadLogs = async () => {
    const res = await fetch('/api/admin/logs');
    const data = await res.json();
    setLogs(data);
  };

  const handleCreateAssinatura = async (formData: any) => {
    setLoading(true);
    try {
      await fetch('/api/admin/assinaturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      await loadAssinaturas();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssinatura = async (id: string, action: string, data: any) => {
    setLoading(true);
    try {
      await fetch('/api/admin/assinaturas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, data })
      });
      await loadAssinaturas();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csv = [
      ['Data', 'Email', 'Tipo', 'Descrição', 'Valor'],
      ...transacoes.map(t => [
        new Date(t.data).toLocaleDateString('pt-BR'),
        t.profiles?.email || '',
        t.tipo,
        t.descricao,
        t.valor
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'assinaturas', label: 'Assinaturas', icon: CreditCard },
    { id: 'transacoes', label: 'Transações', icon: DollarSign },
    { id: 'logs', label: 'Logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie usuários, assinaturas e transações
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Geral"
                value={`R$ ${stats.totalGeral.toFixed(2)}`}
                icon={DollarSign}
                color="from-green-500 to-emerald-600"
              />
              <StatCard
                title="Mês Atual"
                value={`R$ ${stats.totalMesAtual.toFixed(2)}`}
                icon={Calendar}
                color="from-blue-500 to-cyan-600"
              />
              <StatCard
                title="Ano Atual"
                value={`R$ ${stats.totalAno.toFixed(2)}`}
                icon={TrendingUp}
                color="from-purple-500 to-pink-600"
              />
              <StatCard
                title="Assinaturas Ativas"
                value={stats.assinaturasAtivas}
                icon={CreditCard}
                color="from-orange-500 to-red-600"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Faturamento Mensal
              </h3>
              <div className="space-y-4">
                {stats.faturamentoMensal.slice(-6).map((item: any) => {
                  const maxValor = Math.max(...stats.faturamentoMensal.map((i: any) => i.valor));
                  const percentage = (item.valor / maxValor) * 100;
                  const mesNome = new Date(item.mes + '-01').toLocaleDateString('pt-BR', { 
                    month: 'long', 
                    year: 'numeric' 
                  });

                  return (
                    <div key={item.mes} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {mesNome}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          R$ {item.valor.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Usuários Tab */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por email, nome ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && loadUsuarios()}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <button
                onClick={loadUsuarios}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Buscar
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Nome</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Assinaturas</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((user) => (
                      <tr key={user.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-4 px-6 text-sm text-slate-900 dark:text-white">{user.email}</td>
                        <td className="py-4 px-6 text-sm text-slate-900 dark:text-white">{user.nome || '-'}</td>
                        <td className="py-4 px-6 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {user.assinaturas?.length || 0} assinatura(s)
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Assinaturas Tab */}
        {activeTab === 'assinaturas' && (
          <div className="space-y-6">
            <button
              onClick={() => {
                setModalType('create');
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              Nova Assinatura
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Usuário</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Início</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Fim</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Meses</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assinaturas.map((assinatura) => {
                      const diasRestantes = Math.ceil((new Date(assinatura.data_fim).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={assinatura.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="py-4 px-6 text-sm text-slate-900 dark:text-white">
                            {assinatura.profiles?.email || 'N/A'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              assinatura.status === 'ativa' 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {assinatura.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                            {new Date(assinatura.data_inicio).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                            {new Date(assinatura.data_fim).toLocaleDateString('pt-BR')}
                            <span className="block text-xs text-slate-500">
                              {diasRestantes > 0 ? `${diasRestantes} dias restantes` : 'Expirada'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-900 dark:text-white">
                            {assinatura.meses_pagos || 0}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateAssinatura(assinatura.id, 'estender', { meses: 1 })}
                                className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                title="Estender 1 mês"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              {assinatura.status === 'ativa' ? (
                                <button
                                  onClick={() => handleUpdateAssinatura(assinatura.id, 'cancelar', {})}
                                  className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateAssinatura(assinatura.id, 'ativar', {})}
                                  className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                                  title="Ativar"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transações Tab */}
        {activeTab === 'transacoes' && (
          <div className="space-y-6">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Data</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoes.map((transacao) => (
                      <tr key={transacao.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(transacao.data).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-900 dark:text-white">
                          {transacao.profiles?.email || 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {transacao.tipo}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                          {transacao.descricao}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-right text-slate-900 dark:text-white">
                          R$ {Number(transacao.valor).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Data</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Admin</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Ação</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-900 dark:text-white">
                        {log.admin_email}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          {log.acao}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                        {JSON.stringify(log.detalhes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal para criar assinatura */}
      {showModal && modalType === 'create' && (
        <CreateAssinaturaModal
          usuarios={usuarios}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateAssinatura}
          loading={loading}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function CreateAssinaturaModal({ usuarios, onClose, onSubmit, loading }: any) {
  const [formData, setFormData] = useState({
    user_id: '',
    meses: 1,
    tipo: 'doacao_admin'
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Nova Assinatura
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Usuário
            </label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">Selecione um usuário</option>
              {usuarios.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.email} - {user.nome || 'Sem nome'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Meses
            </label>
            <input
              type="number"
              min="1"
              value={formData.meses}
              onChange={(e) => setFormData({ ...formData, meses: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSubmit(formData)}
              disabled={loading || !formData.user_id}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
