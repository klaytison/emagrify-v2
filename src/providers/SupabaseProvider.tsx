"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Session, User, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

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

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega sessão inicial apenas 1x
  useEffect(() => {
    let mounted = true;

    const loadInitial = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession((prev) => {
        return prev?.access_token === data.session?.access_token
          ? prev
          : data.session ?? null;
      });

      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    loadInitial();

    // Listener otimizado
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession((prev) => {
        // evita re-render desnecessário
        if (prev?.access_token === newSession?.access_token) {
          return prev;
        }
        return newSession ?? null;
      });

      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

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

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) {
    throw new Error("useSupabase deve ser usado dentro de um SupabaseProvider");
  }
  return ctx;
}
