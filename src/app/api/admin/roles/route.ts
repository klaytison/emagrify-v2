import { NextResponse } from 'next/server';

export async function GET() {
  const roles = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Acesso total ao sistema',
      permissions: [
        'view_dashboard',
        'view_users',
        'edit_users',
        'view_subscriptions',
        'manage_subscriptions',
        'view_financial',
        'manage_financial',
        'manage_content',
        'manage_coupons',
        'manage_automations',
        'view_logs',
        'manage_settings',
        'manage_roles',
      ],
      usersCount: 2,
    },
    {
      id: '2',
      name: 'Admin',
      description: 'Gerenciamento geral',
      permissions: [
        'view_dashboard',
        'view_users',
        'edit_users',
        'view_subscriptions',
        'manage_subscriptions',
        'view_financial',
        'manage_content',
        'manage_coupons',
      ],
      usersCount: 5,
    },
    {
      id: '3',
      name: 'Moderador',
      description: 'Gerenciamento de conteúdo',
      permissions: [
        'view_dashboard',
        'view_users',
        'manage_content',
      ],
      usersCount: 8,
    },
    {
      id: '4',
      name: 'Suporte',
      description: 'Atendimento ao cliente',
      permissions: [
        'view_dashboard',
        'view_users',
        'view_subscriptions',
      ],
      usersCount: 12,
    },
    {
      id: '5',
      name: 'Financeiro',
      description: 'Gestão financeira',
      permissions: [
        'view_dashboard',
        'view_financial',
        'manage_financial',
        'view_subscriptions',
      ],
      usersCount: 3,
    },
  ];

  return NextResponse.json({ roles });
}
