import { NextRequest, NextResponse } from 'next/server';
import { getUsuarios } from '@/lib/actions/admin';
import { createServerClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/config/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get('busca') || undefined;

    const usuarios = await getUsuarios(busca);
    return NextResponse.json(usuarios);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !isAdmin(user.email)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    // Deletar usuário
    await supabase.auth.admin.deleteUser(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
