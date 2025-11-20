import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './profile-client';

export default async function PerfilPage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Buscar ou criar perfil
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        nome: user.user_metadata?.nome || '',
        biografia: '',
        avatar_url: ''
      })
      .select()
      .single();
    
    profile = newProfile;
  }

  // Buscar histórico de atividades (logs relacionados ao usuário)
  const { data: history } = await supabase
    .from('transacoes_assinatura')
    .select('*')
    .eq('user_id', user.id)
    .order('data', { ascending: false })
    .limit(10);

  return <ProfileClient profile={profile} history={history || []} />;
}
