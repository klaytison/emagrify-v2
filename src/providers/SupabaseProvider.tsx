"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session, User, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

// ---------- CONTEXTO ----------
type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

// ---------- PROVIDER ----------
export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // CLIENT DO SUPABASE
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------- CARREGAR SESSÃO UMA ÚNICA VEZ ----------
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSession();

    // ---------- LISTENER SEGURO (SEM RE-RENDER AO DIGITAR!) ----------
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // só atualiza se o token REALMENTE mudou
      setSession((prev) => {
        if (prev?.access_token === newSession?.access_token) return prev;
        return newSession ?? null;
      });

      setUser(newSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // ---------- FUNÇÕES ----------
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const refreshSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session ?? null);
    setUser(data.session?.user ?? null);
  };

  // ---------- VALOR FINAL ----------
  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        session,
        user,
        loading,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

// ---------- HOOK ----------
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error(
      "useSupabase deve ser usado dentro de um SupabaseProvider"
    );
  }
  return context;
}
