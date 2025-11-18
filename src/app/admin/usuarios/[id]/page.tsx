import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { 
  Mail, 
  Calendar, 
  CreditCard, 
  DollarSign,
  Clock,
  Activity,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default async function UsuarioDetalhesPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createServerClient();

  // Buscar dados do usuário
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const usuario = users?.find(u => u.id === params.id);

  if (!usuario) {
    notFound();
  }

  // Buscar perfil
  const { data: perfil } = await supabase
    .from('usuarios_perfil')
    .select('*')
    .eq('user_id', params.id)
    .single();

  // Buscar assinaturas
  const { data: assinaturas } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('user_id', params.id)
    .order('data_inicio', { ascending: false });

  // Buscar transações
  const { data: transacoes } = await supabase
    .from('transacoes_assinatura')
    .select('*')
    .eq('user_id', params.id)
    .order('data', { ascending: false });

  // Buscar histórico de ações
  const { data: historico } = await supabase
    .from('historico_acao')
    .select('*')
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })
    .limit(20);

  const totalGasto = transacoes?.reduce((sum, t) => {
    if (t.tipo === 'assinatura_comprada' || t.tipo === 'assinatura_renovada') {
      return sum + Number(t.valor);
    }
    return sum;
  }, 0) || 0;

  const assinaturasAtivas = assinaturas?.filter(a => a.status === 'ativa').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/usuarios"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Detalhes do Usuário
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Informações completas e histórico
          </p>
        </div>
      </div>

      {/* Informações do Usuário */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
            {perfil?.nome?.[0]?.toUpperCase() || usuario.email[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {perfil?.nome || 'Sem nome'}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-slate-600 dark:text-slate-400">
              <Mail className="w-4 h-4" />
              <span>{usuario.email}</span>
            </div>
            {perfil?.bio && (
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                {perfil.bio}
              </p>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
              <CreditCard className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {assinaturasAtivas}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Assinaturas Ativas
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              R$ {totalGasto.toFixed(2)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Gasto
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {historico?.length || 0}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ações Registradas
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Date(usuario.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Membro desde
            </p>
          </div>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Assinaturas
        </h3>
        {assinaturas && assinaturas.length > 0 ? (
          <div className="space-y-3">
            {assinaturas.map((assinatura) => (
              <div
                key={assinatura.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {assinatura.plano}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(assinatura.data_inicio).toLocaleDateString('pt-BR')} até{' '}
                    {new Date(assinatura.data_fim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    assinatura.status === 'ativa'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {assinatura.status}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    R$ {Number(assinatura.valor_mensal).toFixed(2)}/mês
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-600 dark:text-slate-400 py-8">
            Nenhuma assinatura encontrada
          </p>
        )}
      </div>

      {/* Transações */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Histórico de Transações
        </h3>
        {transacoes && transacoes.length > 0 ? (
          <div className="space-y-3">
            {transacoes.map((transacao) => (
              <div
                key={transacao.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {transacao.descricao}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(transacao.data).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(transacao.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    R$ {Number(transacao.valor).toFixed(2)}
                  </p>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {transacao.tipo.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-600 dark:text-slate-400 py-8">
            Nenhuma transação encontrada
          </p>
        )}
      </div>

      {/* Histórico de Ações */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Histórico de Ações no Site
        </h3>
        {historico && historico.length > 0 ? (
          <div className="space-y-2">
            {historico.map((acao) => (
              <div
                key={acao.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {acao.descricao}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {acao.tipo}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  {new Date(acao.created_at).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(acao.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-600 dark:text-slate-400 py-8">
            Nenhuma ação registrada
          </p>
        )}
      </div>
    </div>
  );
}
