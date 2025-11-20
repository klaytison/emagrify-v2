import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = 'klaytsa3@gmail.com';

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return user?.email === ADMIN_EMAIL;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Acesso negado');
  }
  
  return true;
}

export { ADMIN_EMAIL };
