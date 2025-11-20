import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Não autorizado',
        permissions: [],
        role: null 
      }, { status: 401 });
    }

    // Buscar admin_user e suas permissões
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select(`
        *,
        admin_roles (
          *,
          admin_role_permissions (
            admin_permissions (
              chave
            )
          )
        )
      `)
      .eq('email', user.email)
      .eq('ativo', true)
      .single();

    if (adminError || !adminUser) {
      console.error('Erro ao buscar admin:', adminError);
      return NextResponse.json({ 
        error: 'Acesso negado',
        permissions: [],
        role: null 
      }, { status: 403 });
    }

    // Extrair permissões
    const permissions = adminUser.admin_roles?.admin_role_permissions?.map(
      (rp: any) => rp.admin_permissions.chave
    ) || [];

    return NextResponse.json({ 
      permissions,
      role: adminUser.admin_roles?.nome || null
    });
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return NextResponse.json({ 
      error: 'Erro interno',
      permissions: [],
      role: null 
    }, { status: 500 });
  }
}
