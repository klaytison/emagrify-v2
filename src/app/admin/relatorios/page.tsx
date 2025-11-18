'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Filter
} from 'lucide-react';

export default function RelatoriosPage() {
  const [relatorio, setRelatorio] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    tipo: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const [relatorioRes, rankingRes, transacoesRes] = await Promise.all([
        fetch('/api/admin/relatorios'),
        fetch('/api/admin/relatorios/ranking'),
        fetch('/api/admin/transacoes'),
      ]);

      const relatorioData = await relatorioRes.json();
      const rankingData = await rankingRes.json();
      const transacoesData = await transacoesRes.json();

      setRelatorio(relatorioData);
      setRanking(rankingData);
      setTransacoes(transacoesData);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  }

  async function exportarCSV(tipo: 'assinaturas' | 'transacoes' | 'usuarios') {
    try {
      const res = await fetch(`/api/admin/exportar?tipo=${tipo}`);
      const csv = await res.text();
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tipo}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar dados');
    }
  }

  async function filtrarTransacoes() {
    try {
      const params = new URLSearchParams();
      if (filtros.dataInicio) params.set('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.set('dataFim', filtros.dataFim);
      if (filtros.tipo) params.set('tipo', filtros.tipo);

      const res = await fetch(`/api/admin/transacoes?${params}`);
      const data = await res.json();
      setTransacoes(data);
    } catch (error) {
      console.error('Erro ao filtrar:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Relatórios Financeiros
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Análise completa de faturamento e transações
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportarCSV('assinaturas')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Exportar Assinaturas
          </button>
          <button
            onClick={() => exportarCSV('transacoes')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Exportar Transações
          </button>
        </div>
      </div>

      {/* Filtros de Data */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtrar Transações por Período
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="assinatura_comprada">Comprada</option>
            <option value="assinatura_renovada">Renovada</option>
            <option value="assinatura_cancelada">Cancelada</option>
            <option value="assinatura_doada">Doada</option>
            <option value="ajuste_manual">Ajuste Manual</option>
          </select>
          <button
            onClick={filtrarTransacoes}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Ranking de Usuários */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Top 10 Usuários que Mais Gastaram
        </h3>
        <div className="space-y-3">
          {ranking.map((usuario, index) => (
            <div
              key={usuario.id}
              className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                'bg-gradient-to-br from-blue-400 to-blue-600'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {usuario.nome || 'Sem nome'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {usuario.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  R$ {usuario.total_gasto?.toFixed(2)}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {usuario.assinaturas?.length || 0} assinatura(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Transações Filtradas */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Transações ({transacoes.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Data
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tipo
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Descrição
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {transacoes.slice(0, 50).map((transacao) => (
                <tr
                  key={transacao.id}
                  className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(transacao.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">
                    {transacao.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {transacao.tipo.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    {transacao.descricao}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-right text-slate-900 dark:text-white">
                    R$ {Number(transacao.valor).toFixed(2)}
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
