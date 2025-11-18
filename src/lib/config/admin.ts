/**
 * Configuração do Administrador
 * 
 * IMPORTANTE: Altere o email abaixo para o SEU email
 * Apenas este email terá acesso ao painel administrativo
 */

export const ADMIN_CONFIG = {
  // 🔐 ALTERE ESTE EMAIL PARA O SEU
  adminEmail: 'klaytsa3@gmail.com',
  
  // Configurações do painel
  itemsPorPagina: 20,
  diasAlertaExpiracao: 7,
  
  // Planos padrão
  planosDisponiveis: [
    { id: 'basico', nome: 'Básico', valor: 29.90, meses: 1 },
    { id: 'premium', nome: 'Premium', valor: 59.90, meses: 1 },
    { id: 'anual', nome: 'Anual', valor: 499.90, meses: 12 },
  ],
} as const;

/**
 * Verifica se um email é administrador
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_CONFIG.adminEmail.toLowerCase();
}

/**
 * Tipos de ações administrativas para logs
 */
export const ADMIN_ACTIONS = {
  // Assinaturas
  CRIAR_ASSINATURA: 'criar_assinatura',
  CANCELAR_ASSINATURA: 'cancelar_assinatura',
  ALTERAR_PLANO: 'alterar_plano',
  DOAR_ASSINATURA: 'doar_assinatura',
  ESTENDER_ASSINATURA: 'estender_assinatura',
  
  // Usuários
  VISUALIZAR_USUARIO: 'visualizar_usuario',
  DELETAR_USUARIO: 'deletar_usuario',
  
  // Planos
  CRIAR_PLANO: 'criar_plano',
  EDITAR_PLANO: 'editar_plano',
  DESATIVAR_PLANO: 'desativar_plano',
  
  // Relatórios
  GERAR_RELATORIO: 'gerar_relatorio',
  EXPORTAR_CSV: 'exportar_csv',
  
  // Sistema
  ACESSO_PAINEL: 'acesso_painel',
  AJUSTE_MANUAL: 'ajuste_manual',
} as const;

export type AdminAction = typeof ADMIN_ACTIONS[keyof typeof ADMIN_ACTIONS];
