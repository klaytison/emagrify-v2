'use client';

import { useState } from 'react';
import { Search, Download, RefreshCw, DollarSign } from 'lucide-react';

interface Payment {
  id: string;
  user: string;
  email: string;
  amount: number;
  method: 'card' | 'pix' | 'boleto';
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  date: string;
  transactionId: string;
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: '1',
    user: 'João Silva',
    email: 'joao@example.com',
    amount: 97.00,
    method: 'card',
    status: 'paid',
    date: new Date().toISOString(),
    transactionId: 'TXN001',
  },
  {
    id: '2',
    user: 'Maria Santos',
    email: 'maria@example.com',
    amount: 97.00,
    method: 'pix',
    status: 'paid',
    date: new Date(Date.now() - 3600000).toISOString(),
    transactionId: 'TXN002',
  },
  {
    id: '3',
    user: 'Pedro Oliveira',
    email: 'pedro@example.com',
    amount: 97.00,
    method: 'boleto',
    status: 'pending',
    date: new Date(Date.now() - 7200000).toISOString(),
    transactionId: 'TXN003',
  },
  {
    id: '4',
    user: 'Ana Costa',
    email: 'ana@example.com',
    amount: 47.00,
    method: 'card',
    status: 'failed',
    date: new Date(Date.now() - 10800000).toISOString(),
    transactionId: 'TXN004',
  },
];

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      card: 'Cartão',
      pix: 'PIX',
      boleto: 'Boleto',
    };
    return labels[method] || method;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Pago',
      pending: 'Pendente',
      failed: 'Falhou',
      refunded: 'Reembolsado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pagamentos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Histórico de transações e pagamentos
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
          <Download className="w-5 h-5" />
          <span>Exportar</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Total Recebido
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 45.890
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Pendente
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 2.340
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Falhados
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 1.120
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Reembolsados
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 450
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por usuário, email ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
          >
            <option value="all">Todos os métodos</option>
            <option value="card">Cartão</option>
            <option value="pix">PIX</option>
            <option value="boleto">Boleto</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
          >
            <option value="all">Todos os status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="failed">Falhou</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  ID Transação
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Usuário
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Valor
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Método
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Data
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-6 text-sm font-mono text-slate-600 dark:text-slate-400">
                    {payment.transactionId}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{payment.user}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{payment.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-900 dark:text-white">
                    R$ {payment.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {getMethodLabel(payment.method)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : payment.status === 'failed'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {getStatusLabel(payment.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(payment.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-4 px-6">
                    {payment.status === 'failed' && (
                      <button className="flex items-center gap-2 px-3 py-1 text-sm text-[#7BE4B7] hover:bg-[#7BE4B7]/10 rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        <span>Reprocessar</span>
                      </button>
                    )}
                    {payment.status === 'paid' && (
                      <button className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <span>Reembolsar</span>
                      </button>
                    )}
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
