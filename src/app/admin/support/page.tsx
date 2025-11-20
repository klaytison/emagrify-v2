'use client';

import { useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Ticket {
  id: string;
  user: string;
  email: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdate: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    user: 'João Silva',
    email: 'joao@example.com',
    subject: 'Problema com pagamento',
    status: 'open',
    priority: 'high',
    createdAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '2',
    user: 'Maria Santos',
    email: 'maria@example.com',
    subject: 'Dúvida sobre plano',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    lastUpdate: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '3',
    user: 'Pedro Oliveira',
    email: 'pedro@example.com',
    subject: 'Cancelamento de assinatura',
    status: 'resolved',
    priority: 'low',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastUpdate: new Date(Date.now() - 43200000).toISOString(),
  },
];

export default function SupportPage() {
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTickets = tickets.filter(ticket => 
    statusFilter === 'all' || ticket.status === statusFilter
  );

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: 'Aberto',
      'in-progress': 'Em Progresso',
      resolved: 'Resolvido',
      closed: 'Fechado',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
    };
    return labels[priority] || priority;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Suporte</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gerencie tickets e atendimentos
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Abertos
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Em Progresso
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Resolvidos
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">45</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tempo Médio
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">2.5h</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
        >
          <option value="all">Todos os status</option>
          <option value="open">Aberto</option>
          <option value="in-progress">Em Progresso</option>
          <option value="resolved">Resolvido</option>
          <option value="closed">Fechado</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{ticket.subject}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'open'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : ticket.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : ticket.status === 'resolved'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'high'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : ticket.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {getPriorityLabel(ticket.priority)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>{ticket.user}</span>
                  <span>•</span>
                  <span>{ticket.email}</span>
                  <span>•</span>
                  <span>Criado em {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>Atualizado {new Date(ticket.lastUpdate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
