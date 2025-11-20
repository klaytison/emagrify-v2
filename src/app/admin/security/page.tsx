'use client';

import { useState } from 'react';
import { Shield, AlertTriangle, Download, Lock } from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  source: string;
}

interface SuspiciousLogin {
  id: string;
  ip: string;
  location: string;
  attempts: number;
  lastAttempt: string;
  blocked: boolean;
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    type: 'error',
    message: 'Failed payment attempt for user #1234',
    timestamp: new Date().toISOString(),
    source: 'payment-service',
  },
  {
    id: '2',
    type: 'warning',
    message: 'High memory usage detected',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'system',
  },
  {
    id: '3',
    type: 'info',
    message: 'Backup completed successfully',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    source: 'backup-service',
  },
];

const MOCK_SUSPICIOUS: SuspiciousLogin[] = [
  {
    id: '1',
    ip: '192.168.1.100',
    location: 'São Paulo, BR',
    attempts: 5,
    lastAttempt: new Date().toISOString(),
    blocked: false,
  },
  {
    id: '2',
    ip: '10.0.0.50',
    location: 'Rio de Janeiro, BR',
    attempts: 12,
    lastAttempt: new Date(Date.now() - 3600000).toISOString(),
    blocked: true,
  },
];

export default function SecurityPage() {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const [suspicious] = useState<SuspiciousLogin[]>(MOCK_SUSPICIOUS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Segurança</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Logs, segurança e backups
          </p>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status do Sistema
            </span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">Seguro</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              IPs Bloqueados
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Último Backup
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Hoje, 03:00</p>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Logs do Sistema</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#7BE4B7] dark:hover:text-[#7BE4B7] border border-slate-200 dark:border-slate-700 rounded-xl hover:border-[#7BE4B7] transition-all">
            <Download className="w-4 h-4" />
            <span>Exportar Logs</span>
          </button>
        </div>
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div className={`p-2 rounded-lg ${
                log.type === 'error' 
                  ? 'bg-red-100 dark:bg-red-900/20'
                  : log.type === 'warning'
                  ? 'bg-yellow-100 dark:bg-yellow-900/20'
                  : 'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  log.type === 'error' 
                    ? 'text-red-600 dark:text-red-400'
                    : log.type === 'warning'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.type === 'error' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : log.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {log.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">{log.source}</span>
                </div>
                <p className="text-sm text-slate-900 dark:text-white mb-1">{log.message}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suspicious Logins */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Logins Suspeitos</h2>
        <div className="space-y-3">
          {suspicious.map((login) => (
            <div key={login.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  login.blocked 
                    ? 'bg-red-100 dark:bg-red-900/20'
                    : 'bg-yellow-100 dark:bg-yellow-900/20'
                }`}>
                  <Lock className={`w-5 h-5 ${
                    login.blocked 
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{login.ip}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {login.location} • {login.attempts} tentativas
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Última tentativa: {new Date(login.lastAttempt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-xl font-medium transition-all ${
                login.blocked
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
              }`}>
                {login.blocked ? 'Desbloquear' : 'Bloquear'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Backup */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Backup</h2>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Backup Automático</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Último backup: Hoje às 03:00 • Próximo: Amanhã às 03:00
            </p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
            Fazer Backup Agora
          </button>
        </div>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Modo Mock:</strong> Backups estão simulados. Configure storage real para produção.
          </p>
        </div>
      </div>
    </div>
  );
}
