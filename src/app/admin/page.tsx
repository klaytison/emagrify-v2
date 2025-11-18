import { getDashboardStats, getTransacoes } from '@/lib/actions/admin';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const transacoesRecentes = (await getTransacoes()).slice(0, 10);

  const cards = [
    {
      title: 'Faturamento Mês Atual',
      value: `R$ ${stats.totalMesAtual.toFixed(2)}`,
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Faturamento Ano',
      value: `R$ ${stats.totalAno.toFixed(2)}`,
      icon: TrendingUp,
      trend: '+23.1%',
      trendUp: true,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Total Geral',
      value: `R$ ${stats.totalGeral.toFixed(2)}`,
      icon: Calendar,
      trend: 'Desde o início',
      trendUp: true,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Assinaturas Ativas',
      value: stats.assinaturasAtivas.toString(),
      icon: CreditCard,
      trend: `${stats.usuariosAtivos} usuários`,
      trendUp: true,
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Visão geral do sistema de assinaturas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {card.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {card.trendUp ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${card.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Faturamento Mensal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Faturamento Mensal
        </h3>
        <div className="space-y-4">
          {stats.faturamentoMensal.slice(-6).map((item) => {
            const maxValor = Math.max(...stats.faturamentoMensal.map(i => i.valor));
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
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
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

      {/* Transações Recentes */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Transações Recentes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
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
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {transacoesRecentes.map((transacao) => (
                <tr
                  key={transacao.id}
                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
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
                  <td className="py-3 px-4 text-sm text-right text-slate-600 dark:text-slate-400">
                    {new Date(transacao.data).toLocaleDateString('pt-BR')}
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
