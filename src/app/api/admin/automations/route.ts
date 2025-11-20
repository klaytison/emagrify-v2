import { NextResponse } from 'next/server';

export async function GET() {
  const automations = [
    {
      id: '1',
      name: 'E-mail de Boas-vindas',
      trigger: 'Novo cadastro',
      action: 'email',
      template: {
        subject: 'Bem-vindo ao Emagrify, {{user_name}}!',
        body: 'Olá {{user_name}}, estamos felizes em ter você conosco! Seu plano {{plan_name}} está ativo e pronto para uso.',
      },
      active: true,
      executionCount: 1247,
    },
    {
      id: '2',
      name: 'Aviso de Renovação',
      trigger: '3 dias antes da renovação',
      action: 'email',
      template: {
        subject: 'Sua assinatura será renovada em breve',
        body: 'Olá {{user_name}}, sua assinatura do plano {{plan_name}} será renovada em {{renewal_date}}. Certifique-se de que seu método de pagamento está atualizado.',
      },
      active: true,
      executionCount: 892,
    },
    {
      id: '3',
      name: 'Falha de Pagamento',
      trigger: 'Pagamento recusado',
      action: 'email',
      template: {
        subject: 'Problema com seu pagamento',
        body: 'Olá {{user_name}}, não conseguimos processar seu pagamento. Por favor, atualize seu método de pagamento para continuar usando o Emagrify.',
      },
      active: true,
      executionCount: 45,
    },
    {
      id: '4',
      name: 'Assinatura Expirada',
      trigger: 'Assinatura expirou',
      action: 'email',
      template: {
        subject: 'Sua assinatura expirou',
        body: 'Olá {{user_name}}, sua assinatura do Emagrify expirou. Renove agora para continuar aproveitando todos os benefícios!',
      },
      active: true,
      executionCount: 234,
    },
  ];

  return NextResponse.json({ automations });
}
