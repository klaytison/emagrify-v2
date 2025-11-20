'use client';

import { useState } from 'react';
import { Save, Globe, Mail, Palette, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Emagrify',
    siteUrl: 'https://emagrify.com',
    supportEmail: 'suporte@emagrify.com',
    language: 'pt-BR',
    autoRenewal: true,
    stripeKey: '',
    paypalKey: '',
    mercadopagoKey: '',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Configurações</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Configure as opções do sistema
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white rounded-xl hover:shadow-lg transition-all">
          <Save className="w-5 h-5" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#7BE4B7] rounded-lg">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Configurações Gerais</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              URL do Site
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Idioma
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#6ECBF5] rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Configurações de Email</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email de Suporte
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Modo Mock:</strong> Configurações SMTP estão simuladas para desenvolvimento.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Integrations */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#FF7A00] rounded-lg">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Integrações de Pagamento</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Stripe API Key (Test)
            </label>
            <input
              type="password"
              value={settings.stripeKey}
              onChange={(e) => setSettings({ ...settings, stripeKey: e.target.value })}
              placeholder="sk_test_..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              PayPal Client ID (Test)
            </label>
            <input
              type="password"
              value={settings.paypalKey}
              onChange={(e) => setSettings({ ...settings, paypalKey: e.target.value })}
              placeholder="AY..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              MercadoPago Access Token (Test)
            </label>
            <input
              type="password"
              value={settings.mercadopagoKey}
              onChange={(e) => setSettings({ ...settings, mercadopagoKey: e.target.value })}
              placeholder="TEST-..."
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Modo Mock:</strong> As integrações estão simuladas. Configure as chaves reais para produção.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#7BE4B7] rounded-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assinaturas</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">Renovação Automática</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Renovar assinaturas automaticamente no vencimento
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoRenewal}
              onChange={(e) => setSettings({ ...settings, autoRenewal: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7BE4B7]/20 dark:peer-focus:ring-[#7BE4B7]/40 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#7BE4B7]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
