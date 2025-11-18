'use server';

import { createServerClient } from '@/lib/supabase/server';
import { isAdmin, ADMIN_ACTIONS, type AdminAction } from '@/lib/config/admin';
import { revalidatePath } from 'next/cache';

/**
 * Tipos para o sistema de administração
 */
export interface Assinatura {
  id: string;
  user_id: string;
  plano: string;
  status: 'ativa' | 'expirada' | 'cancelada' | 'suspensa';
  data_inicio: string;
  data_fim: string;
  renova_automaticamente: boolean;
  valor_mensal: number;
  ultima_atualizacao: string;
  email?: string;
  nome?: string;
  dias_restantes?: number;
}

export interface Transacao {
  id: string;
  user_id: string;
  assinatura_id?: string;
  valor: number;
  tipo: string;
  descricao: string;
  data: string;
  email?: string;
  nome?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nome?: string;
  foto?: string;
  created_at: string;
  assinaturas?: Assinatura[];
  total_gasto?: number;
}

export interface DashboardStats {
  totalMesAtual: number;
  totalAno: number;
  totalGeral: number;
  assinaturasAtivas: number;
  usuariosAtivos: number;
  faturamentoMensal: Array<{ mes: string; valor: number }>;
}

/**
 * Verifica se o usuário atual é admin
 */
async function verificarAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !isAdmin(user.email)) {
    throw new Error('Acesso negado: apenas administradores');
  }
  
  return { supabase, adminId: user.id, adminEmail: user.email };
}

/**
 * Registra ação administrativa
 */
async function registrarLog(
  supabase: any,
  adminId: string,
  acao: AdminAction,
  descricao: string,
  metadata?: any
) {
  await supabase.from('admin_logs').insert({
    admin_id: adminId,
    acao,
    descricao,
    metadata: metadata || null,
  });
}

/**
 * DASHBOARD - Obter estatísticas gerais
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase, adminId } = await verificarAdmin();
  
  // Total do mês atual
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  
  const { data: mesAtual } = await supabase
    .from('transacoes_assinatura')
    .select('valor')
    .in('tipo', ['assinatura_comprada', 'assinatura_renovada'])
    .gte('data', inicioMes.toISOString());
  
  const totalMesAtual = mesAtual?.reduce((sum, t) => sum + Number(t.valor), 0) || 0;
  
  // Total do ano
  const inicioAno = new Date();
  inicioAno.setMonth(0, 1);
  inicioAno.setHours(0, 0, 0, 0);
  
  const { data: ano } = await supabase
    .from('transacoes_assinatura')
    .select('valor')
    .in('tipo', ['assinatura_comprada', 'assinatura_renovada'])
    .gte('data', inicioAno.toISOString());
  
  const totalAno = ano?.reduce((sum, t) => sum + Number(t.valor), 0) || 0;
  
  // Total geral
  const { data: geral } = await supabase
    .from('transacoes_assinatura')
    .select('valor')
    .in('tipo', ['assinatura_comprada', 'assinatura_renovada']);
  
  const totalGeral = geral?.reduce((sum, t) => sum + Number(t.valor), 0) || 0;
  
  // Assinaturas ativas
  const { count: assinaturasAtivas } = await supabase
    .from('assinaturas')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ativa');
  
  // Usuários com assinatura ativa
  const { data: usuariosAtivos } = await supabase
    .from('assinaturas')
    .select('user_id')
    .eq('status', 'ativa');
  
  const usuariosUnicosAtivos = new Set(usuariosAtivos?.map(u => u.user_id)).size;
  
  // Faturamento mensal dos últimos 12 meses
  const { data: faturamentoData } = await supabase
    .from('transacoes_assinatura')
    .select('data, valor')
    .in('tipo', ['assinatura_comprada', 'assinatura_renovada'])
    .gte('data', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
    .order('data', { ascending: true });
  
  const faturamentoPorMes = new Map<string, number>();
  faturamentoData?.forEach(t => {
    const mes = new Date(t.data).toISOString().substring(0, 7);
    faturamentoPorMes.set(mes, (faturamentoPorMes.get(mes) || 0) + Number(t.valor));
  });
  
  const faturamentoMensal = Array.from(faturamentoPorMes.entries())
    .map(([mes, valor]) => ({ mes, valor }))
    .sort((a, b) => a.mes.localeCompare(b.mes));
  
  await registrarLog(supabase, adminId, ADMIN_ACTIONS.ACESSO_PAINEL, 'Visualizou dashboard');
  
  return {
    totalMesAtual,
    totalAno,
    totalGeral,
    assinaturasAtivas: assinaturasAtivas || 0,
    usuariosAtivos: usuariosUnicosAtivos,
    faturamentoMensal,
  };
}

/**
 * ASSINATURAS - Listar todas
 */
export async function getAssinaturas(filtro?: {
  status?: string;
  plano?: string;
  busca?: string;
}): Promise<Assinatura[]> {
  const { supabase } = await verificarAdmin();
  
  let query = supabase
    .from('assinaturas')
    .select(`
      *,
      usuarios_perfil(nome)
    `)
    .order('data_fim', { ascending: true });
  
  if (filtro?.status) {
    query = query.eq('status', filtro.status);
  }
  
  if (filtro?.plano) {
    query = query.eq('plano', filtro.plano);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Buscar emails dos usuários
  const userIds = data?.map(a => a.user_id) || [];
  const { data: users } = await supabase.auth.admin.listUsers();
  
  const userMap = new Map(users?.users.map(u => [u.id, u.email]));
  
  return (data || []).map(a => ({
    ...a,
    email: userMap.get(a.user_id),
    nome: a.usuarios_perfil?.nome,
    dias_restantes: Math.max(0, Math.ceil((new Date(a.data_fim).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
  }));
}

/**
 * ASSINATURAS - Criar nova
 */
export async function criarAssinatura(data: {
  userEmail: string;
  plano: string;
  valorMensal: number;
  meses: number;
  renovaAutomaticamente?: boolean;
}) {
  const { supabase, adminId } = await verificarAdmin();
  
  // Buscar usuário por email
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users.find(u => u.email === data.userEmail);
  
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  
  const dataInicio = new Date();
  const dataFim = new Date();
  dataFim.setMonth(dataFim.getMonth() + data.meses);
  
  // Criar assinatura
  const { data: assinatura, error: assinaturaError } = await supabase
    .from('assinaturas')
    .insert({
      user_id: user.id,
      plano: data.plano,
      status: 'ativa',
      data_inicio: dataInicio.toISOString(),
      data_fim: dataFim.toISOString(),
      renova_automaticamente: data.renovaAutomaticamente || false,
      valor_mensal: data.valorMensal,
    })
    .select()
    .single();
  
  if (assinaturaError) throw assinaturaError;
  
  // Criar transação
  await supabase.from('transacoes_assinatura').insert({
    user_id: user.id,
    assinatura_id: assinatura.id,
    valor: data.valorMensal * data.meses,
    tipo: 'assinatura_comprada',
    descricao: `Assinatura ${data.plano} - ${data.meses} mês(es)`,
  });
  
  // Registrar log
  await registrarLog(
    supabase,
    adminId,
    ADMIN_ACTIONS.CRIAR_ASSINATURA,
    `Criou assinatura ${data.plano} para ${data.userEmail}`,
    { assinatura_id: assinatura.id, plano: data.plano, meses: data.meses }
  );
  
  revalidatePath('/admin');
  return { success: true, assinatura };
}

/**
 * ASSINATURAS - Doar assinatura
 */
export async function doarAssinatura(data: {
  userEmail: string;
  plano: string;
  meses: number;
}) {
  const { supabase, adminId } = await verificarAdmin();
  
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users?.users.find(u => u.email === data.userEmail);
  
  if (!user) throw new Error('Usuário não encontrado');
  
  const dataInicio = new Date();
  const dataFim = new Date();
  dataFim.setMonth(dataFim.getMonth() + data.meses);
  
  const { data: assinatura, error } = await supabase
    .from('assinaturas')
    .insert({
      user_id: user.id,
      plano: data.plano,
      status: 'ativa',
      data_inicio: dataInicio.toISOString(),
      data_fim: dataFim.toISOString(),
      renova_automaticamente: false,
      valor_mensal: 0,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  await supabase.from('transacoes_assinatura').insert({
    user_id: user.id,
    assinatura_id: assinatura.id,
    valor: 0,
    tipo: 'assinatura_doada',
    descricao: `Assinatura ${data.plano} doada - ${data.meses} mês(es)`,
  });
  
  await registrarLog(
    supabase,
    adminId,
    ADMIN_ACTIONS.DOAR_ASSINATURA,
    `Doou ${data.meses} mês(es) de ${data.plano} para ${data.userEmail}`,
    { assinatura_id: assinatura.id }
  );
  
  revalidatePath('/admin');
  return { success: true };
}

/**
 * ASSINATURAS - Cancelar
 */
export async function cancelarAssinatura(assinaturaId: string) {
  const { supabase, adminId } = await verificarAdmin();
  
  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('*, usuarios_perfil(nome)')
    .eq('id', assinaturaId)
    .single();
  
  if (!assinatura) throw new Error('Assinatura não encontrada');
  
  await supabase
    .from('assinaturas')
    .update({ status: 'cancelada', renova_automaticamente: false })
    .eq('id', assinaturaId);
  
  await supabase.from('transacoes_assinatura').insert({
    user_id: assinatura.user_id,
    assinatura_id: assinaturaId,
    valor: 0,
    tipo: 'assinatura_cancelada',
    descricao: `Assinatura ${assinatura.plano} cancelada pelo admin`,
  });
  
  await registrarLog(
    supabase,
    adminId,
    ADMIN_ACTIONS.CANCELAR_ASSINATURA,
    `Cancelou assinatura ${assinatura.plano}`,
    { assinatura_id: assinaturaId }
  );
  
  revalidatePath('/admin');
  return { success: true };
}

/**
 * ASSINATURAS - Estender prazo
 */
export async function estenderAssinatura(assinaturaId: string, meses: number) {
  const { supabase, adminId } = await verificarAdmin();
  
  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('id', assinaturaId)
    .single();
  
  if (!assinatura) throw new Error('Assinatura não encontrada');
  
  const novaDataFim = new Date(assinatura.data_fim);
  novaDataFim.setMonth(novaDataFim.getMonth() + meses);
  
  await supabase
    .from('assinaturas')
    .update({ 
      data_fim: novaDataFim.toISOString(),
      status: 'ativa'
    })
    .eq('id', assinaturaId);
  
  await supabase.from('transacoes_assinatura').insert({
    user_id: assinatura.user_id,
    assinatura_id: assinaturaId,
    valor: 0,
    tipo: 'ajuste_manual',
    descricao: `Prazo estendido em ${meses} mês(es) pelo admin`,
  });
  
  await registrarLog(
    supabase,
    adminId,
    ADMIN_ACTIONS.ESTENDER_ASSINATURA,
    `Estendeu assinatura em ${meses} mês(es)`,
    { assinatura_id: assinaturaId, meses }
  );
  
  revalidatePath('/admin');
  return { success: true };
}

/**
 * USUÁRIOS - Listar todos
 */
export async function getUsuarios(busca?: string): Promise<Usuario[]> {
  const { supabase } = await verificarAdmin();
  
  const { data: users } = await supabase.auth.admin.listUsers();
  const { data: perfis } = await supabase.from('usuarios_perfil').select('*');
  const { data: assinaturas } = await supabase.from('assinaturas').select('*');
  const { data: transacoes } = await supabase.from('transacoes_assinatura').select('*');
  
  const perfilMap = new Map(perfis?.map(p => [p.user_id, p]));
  const assinaturasMap = new Map<string, Assinatura[]>();
  const gastosMap = new Map<string, number>();
  
  assinaturas?.forEach(a => {
    if (!assinaturasMap.has(a.user_id)) {
      assinaturasMap.set(a.user_id, []);
    }
    assinaturasMap.get(a.user_id)!.push(a);
  });
  
  transacoes?.forEach(t => {
    if (t.tipo === 'assinatura_comprada' || t.tipo === 'assinatura_renovada') {
      gastosMap.set(t.user_id, (gastosMap.get(t.user_id) || 0) + Number(t.valor));
    }
  });
  
  let usuarios = (users?.users || []).map(u => {
    const perfil = perfilMap.get(u.id);
    return {
      id: u.id,
      email: u.email || '',
      nome: perfil?.nome,
      foto: perfil?.foto,
      created_at: u.created_at,
      assinaturas: assinaturasMap.get(u.id) || [],
      total_gasto: gastosMap.get(u.id) || 0,
    };
  });
  
  if (busca) {
    const termo = busca.toLowerCase();
    usuarios = usuarios.filter(u => 
      u.email.toLowerCase().includes(termo) ||
      u.nome?.toLowerCase().includes(termo) ||
      u.id.includes(termo)
    );
  }
  
  return usuarios;
}

/**
 * TRANSAÇÕES - Listar todas
 */
export async function getTransacoes(filtro?: {
  tipo?: string;
  mesAno?: string;
  userId?: string;
}): Promise<Transacao[]> {
  const { supabase } = await verificarAdmin();
  
  let query = supabase
    .from('transacoes_assinatura')
    .select('*')
    .order('data', { ascending: false });
  
  if (filtro?.tipo) {
    query = query.eq('tipo', filtro.tipo);
  }
  
  if (filtro?.userId) {
    query = query.eq('user_id', filtro.userId);
  }
  
  const { data } = await query;
  
  const { data: users } = await supabase.auth.admin.listUsers();
  const userMap = new Map(users?.users.map(u => [u.id, u.email]));
  
  let transacoes = (data || []).map(t => ({
    ...t,
    email: userMap.get(t.user_id),
  }));
  
  if (filtro?.mesAno) {
    transacoes = transacoes.filter(t => 
      t.data.startsWith(filtro.mesAno)
    );
  }
  
  return transacoes;
}

/**
 * RELATÓRIOS - Exportar CSV
 */
export async function exportarCSV(tipo: 'assinaturas' | 'transacoes' | 'usuarios') {
  const { supabase, adminId } = await verificarAdmin();
  
  let csv = '';
  
  if (tipo === 'assinaturas') {
    const assinaturas = await getAssinaturas();
    csv = 'ID,Email,Nome,Plano,Status,Data Início,Data Fim,Valor Mensal,Dias Restantes\n';
    assinaturas.forEach(a => {
      csv += `${a.id},${a.email},${a.nome || ''},${a.plano},${a.status},${a.data_inicio},${a.data_fim},${a.valor_mensal},${a.dias_restantes}\n`;
    });
  } else if (tipo === 'transacoes') {
    const transacoes = await getTransacoes();
    csv = 'ID,Email,Tipo,Valor,Descrição,Data\n';
    transacoes.forEach(t => {
      csv += `${t.id},${t.email},${t.tipo},${t.valor},"${t.descricao}",${t.data}\n`;
    });
  } else if (tipo === 'usuarios') {
    const usuarios = await getUsuarios();
    csv = 'ID,Email,Nome,Total Gasto,Assinaturas Ativas,Data Cadastro\n';
    usuarios.forEach(u => {
      const ativas = u.assinaturas?.filter(a => a.status === 'ativa').length || 0;
      csv += `${u.id},${u.email},${u.nome || ''},${u.total_gasto},${ativas},${u.created_at}\n`;
    });
  }
  
  await registrarLog(
    supabase,
    adminId,
    ADMIN_ACTIONS.EXPORTAR_CSV,
    `Exportou CSV de ${tipo}`
  );
  
  return csv;
}

/**
 * RELATÓRIOS - Ranking de usuários
 */
export async function getRankingUsuarios() {
  const { supabase } = await verificarAdmin();
  
  const usuarios = await getUsuarios();
  
  return usuarios
    .filter(u => u.total_gasto > 0)
    .sort((a, b) => b.total_gasto - a.total_gasto)
    .slice(0, 10);
}

/**
 * PLANOS - Listar todos
 */
export async function getPlanos() {
  const { supabase } = await verificarAdmin();
  
  const { data } = await supabase
    .from('planos')
    .select('*')
    .order('valor_mensal', { ascending: true });
  
  return data || [];
}

/**
 * PLANOS - Criar novo
 */
export async function criarPlano(data: {
  nome: string;
  descricao: string;
  valorMensal: number;
  duracaoMeses: number;
  beneficios: string[];
}) {
  const { supabase, adminId } = await verificarAdmin();
  
  const { error } = await supabase.from('planos').insert({
    nome: data.nome,
    descricao: data.descricao,
    valor_mensal: data.valorMensal,
    duracao_meses: data.duracaoMeses,
    beneficios: data.beneficios,
    ativo: true,
  });
  
  if (error) throw error;
  
  await registrarLog(
    supabase,
    adminId,
    ADMIN_ACTIONS.CRIAR_PLANO,
    `Criou plano ${data.nome}`
  );
  
  revalidatePath('/admin');
  return { success: true };
}

/**
 * PLANOS - Atualizar
 */
export async function atualizarPlano(id: string, data: {
  nome?: string;
  descricao?: string;
  valorMensal?: number;
  duracaoMeses?: number;
  beneficios?: string[];
  ativo?: boolean;
}) {
  const { supabase, adminId } = await verificarAdmin();
  
  const updates: any = { updated_at: new Date().toISOString() };
  if (data.nome) updates.nome = data.nome;
  if (data.descricao) updates.descricao = data.descricao;
  if (data.valorMensal) updates.valor_mensal = data.valorMensal;
  if (data.duracaoMeses) updates.duracao_meses = data.duracaoMeses;
  if (data.beneficios) updates.beneficios = data.beneficios;
  if (data.ativo !== undefined) updates.ativo = data.ativo;
  
  const { error } = await supabase
    .from('planos')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
  
  await registrarLog(
    supabase,
    adminId,
    ADMIN_ACTIONS.EDITAR_PLANO,
    `Atualizou plano ${data.nome || id}`
  );
  
  revalidatePath('/admin');
  return { success: true };
}
