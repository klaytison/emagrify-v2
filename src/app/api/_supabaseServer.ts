// app/api/_supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

export function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // só no servidor

  return createClient(supabaseUrl, supabaseKey);
}
