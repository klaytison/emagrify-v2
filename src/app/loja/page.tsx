"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/providers/SupabaseProvider";
import {
  BadgeCheck,
  ShoppingBag,
  Sparkles,
  Loader2,
  Lock,
} from "lucide-react";

interface LojaItem {
  id: string;
  nome: string;
  descricao: string;
  preco_xp: number;
  categoria: string;
  imagem_url: string | null;
}

export default function LojaPage() {
  const { supabase, session } = useSupabase();

  const [itens, setItens] = useState<LojaItem[]>([]);
  const [comprados, setComprados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [comprando, setComprando] = useState<string | null>(null);

  // ===== CARREGAR ITENS DA LOJA =====
  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: loja } = await supabase
        .from("loja_itens")
        .select("*")
        .order("preco_xp", { ascending: true });

      setItens(loja || []);

      if (session?.user?.id) {
        const { data: comp } = await supabase
          .from("loja_compras")
          .select("item_id")
          .eq("user_id", session.user.id);

        setComprados(comp?.map((x) => x.item_id) || []);

        const { data: userXp } = await supabase
          .from("desafios_usuario")
          .select("xp_atual")
          .eq("user_id", session.user.id)
          .maybeSingle();

        setXp(userXp?.xp_atual || 0);
      }

      setLoading(false);
    }

    load();
  }, [session, supabase]);

  // ===== FUNÇÃO COMPRAR ITEM =====
  async function comprarItem(itemId: string) {
    if (!session?.user) {
      alert("Você precisa estar logada!");
      return;
    }

    setComprando(itemId);

    const { data, error } = await supabase.functions.invoke("comprar-item", {
      body: {
        user_id: session.user.id,
        item_id: itemId,
      },
    });

    setComprando(null);

    if (error) {
      alert(error.message || "Erro ao comprar.");
      return;
    }

    alert("Item comprado com sucesso!");
    location.reload();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            Loja de Recompensas
          </h1>
          <p className="text-slate-400 text-sm">
            Ganhe XP completando desafios e troque por recompensas exclusivas.
          </p>
        </div>

        {/* XP ATUAL */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase text-slate-400 font-semibold">
              Seu saldo
            </p>
            <p className="text-xl font-bold text-emerald-400">{xp} XP</p>
          </div>
          <Sparkles className="w-7 h-7 text-emerald-400" />
        </div>

        {/* ITENS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading &&
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse"
              ></div>
            ))}

          {!loading &&
            itens.map((item) => {
              const comprado = comprados.includes(item.id);
              const podeComprar = xp >= item.preco_xp;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col"
                >
                  {/* IMAGEM */}
                  <div className="h-32 bg-slate-800 flex items-center justify-center">
                    {item.imagem_url ? (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sparkles className="w-8 h-8 text-emerald-400 opacity-40" />
                    )}
                  </div>

                  {/* INFO */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{item.nome}</h3>
                      <span className="text-xs text-emerald-400 font-bold">
                        {item.preco_xp} XP
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex-1">
                      {item.descricao}
                    </p>

                    {/* BOTÃO */}
                    <div className="mt-4">
                      {comprado ? (
                        <div className="text-emerald-400 text-xs flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" />
                          Já adquirido
                        </div>
                      ) : (
                        <Button
                          disabled={!podeComprar || comprando === item.id}
                          onClick={() => comprarItem(item.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          {comprando === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : podeComprar ? (
                            "Comprar"
                          ) : (
                            <span className="flex items-center gap-1">
                              <Lock className="w-4 h-4" /> XP Insuficiente
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </section>
      </main>
    </div>
  );
}
