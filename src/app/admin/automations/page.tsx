'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Mail, Zap } from 'lucide-react';
import { ErrorBoundary } from '@/components/admin/ErrorBoundary';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  template: {
    subject: string;
    body: string;
  };
  active: boolean;
  executionCount: number;
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/automations');
      const data = await res.json();
      setAutomations(data.automations || []);
    } catch (error) {
      console.error('Erro ao carregar automações:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (id: string) => {
    try {
      await fetch(`/api/admin/automations/${id}/toggle`, {
        method: 'POST',
      });
      loadAutomations();
    } catch (error) {
      alert('Erro ao alterar automação');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BE4B7]"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Automações</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Configure e-mails automáticos e notificações
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#7BE4B7] text-white rounded-xl hover:bg-[#6BD4A7] transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Nova Automação
          </button>
        </div>

        {/* Automations List */}
        <div className="space-y-4">
          {automations.map((automation) => (
            <div key={automation.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-3 rounded-xl ${automation.active ? 'bg-[#7BE4B7]' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    {automation.action === 'email' ? (
                      <Mail className="w-6 h-6 text-white" />
                    ) : (
                      <Zap className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {automation.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Gatilho: {automation.trigger} • Executado {automation.executionCount} vezes
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={automation.active}
                    onChange={() => toggleAutomation(automation.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7BE4B7]/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#7BE4B7]"></div>
                </label>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Assunto: {automation.template.subject}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {automation.template.body}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <Edit className="w-4 h-4" />
                  Editar Template
                </button>
                <button className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholders Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Placeholders Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <code className="text-sm text-[#7BE4B7]">{'{{user_name}}'}</code>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Nome do usuário</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <code className="text-sm text-[#7BE4B7]">{'{{user_email}}'}</code>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">E-mail do usuário</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <code className="text-sm text-[#7BE4B7]">{'{{plan_name}}'}</code>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Nome do plano</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <code className="text-sm text-[#7BE4B7]">{'{{renewal_date}}'}</code>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Data de renovação</p>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
