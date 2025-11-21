// src/lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseAdminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseAdminUrl || !supabaseServiceKey) {
  // Só pra ajudar a debugar em ambiente de dev
  console.warn(
    "[supabaseAdmin] Verifique suas variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(supabaseAdminUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
