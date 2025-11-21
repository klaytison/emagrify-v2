// src/lib/supabaseClient.ts
import { createBrowserSupabaseClient } from "./supabase/browserClient";

export const supabaseClient = () => createBrowserSupabaseClient();
