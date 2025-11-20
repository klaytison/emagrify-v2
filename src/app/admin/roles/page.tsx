'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { ErrorBoundary } from '@/components/admin/ErrorBoundary';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
}

const availablePermissions = [
  { id: 'view_dashboard', label: 'Visualizar Dashboard' },
  { id: 'view_users', label: 'Visualizar Usuários' },
  { id: 'edit_users', label: 'Editar Usuários' },
  { id: 'view_subscriptions', label: 'Visualizar Assinaturas' },
  { id: 'manage_subscriptions', label: 'Gerenciar Assinaturas' },
  { id: 'view_financial', label: 'Visualizar Financeiro' },
  { id: 'manage_financial', label: 'Gerenciar Financeiro' },
  { id: 'manage_content', label: 'Gerenciar Conteúdo' },
  { id: 'manage_coupons', label: 'Gerenciar Cupons' },
  { id: 'manage_automations', label: 'Gerenciar Automações' },
  { id: 'view_logs', label: 'Visualizar Logs' },
  { id: 'manage_settings', label: 'Gerenciar Configurações' },
  { id: 'manage_roles', label: 'Gerenciar Permissões' },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/roles');
      const data = await res.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Permissões e Cargos</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Gerencie cargos e permissões de acesso
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#7BE4B7] text-white rounded-xl hover:bg-[#6BD4A7] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Cargo
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#7BE4B7] rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {role.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {role.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Permissões ({role.permissions.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.slice(0, 5).map((permission) => {
                    const perm = availablePermissions.find(p => p.id === permission);
                    return (
                      <span
                        key={permission}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full"
                      >
                        {perm?.label || permission}
                      </span>
                    );
                  })}
                  {role.permissions.length > 5 && (
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full">
                      +{role.permissions.length - 5} mais
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {role.usersCount} usuários com este cargo
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingRole(role)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Available Permissions Reference */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Permissões Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePermissions.map((permission) => (
              <div key={permission.id} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <Shield className="w-4 h-4 text-[#7BE4B7]" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {permission.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
