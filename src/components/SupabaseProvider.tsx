"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, SupabaseClient, createBrowserClient } from "@supabase/supabase-js";

const SupabaseContext = createContext<{
  supabase: SupabaseClient | null;
  session: Session | null;
}>({
  supabase: null,
  session: null,
});

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => useContext(SupabaseContext);
