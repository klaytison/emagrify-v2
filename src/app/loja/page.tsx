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
  X,
  Star,
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
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState<string | null>(null);

  // modal
  const [preview, setPreview] = useState<LojaItem | null>(null);

  // ====== CARREGAR LOJA ======
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
        setComprados(comp?.map((i) => i.item_id) || []);

        const { data: dadosXp } = await supabase
          .from("desafios_usuario")
          .select("xp_atual")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setXp(dadosXp?.xp_atual || 0);
      }

      setLoading(false);
    }

    load();
  }, [session, supabase]);

  // ====== COMPRAR ITEM ======
  async function comprarItem(item: LojaItem) {
    if (!session?.user) {
      alert("Você precisa estar logada!");
      return;
    }

    setComprando(item.id);

    const { data, error } = await supabase.functions.invoke("comprar-item", {
      body: { user_id: session.user.id, item_id: item.id },
    });

    setComprando(null);

    if (error) {
      alert(error.message || "Erro ao comprar.");
      return;
    }

    // Atualiza UI sem reload
    setComprados((old) => [...old, item.id]);
    setXp((old) => old - item.preco_xp);

    // animação visual
    setPreview(item);

    setTimeout(() => {
      setPreview(null);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <Header />

      {/* MODAL DE PREVIEW */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 w-80 text-center animate-fade-in">
            <Star className="w-10 h-10 text-emerald-400 mx-auto mb-3 animate-pulse" />
            <h2 className="text-xl font-bold text-emerald-400">
              Item Adquirido!
            </h2>
            <p className="text-sm text-slate-300 mt-2 mb-3">{preview.nome}</p>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setPreview(null)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* TÍTULO */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-emerald-400" />
            Loja de Recompensas
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Troque XP acumulado por recompensas exclusivas.
          </p>
        </div>

        {/* XP BOX */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-4 flex items-center justify-between shadow-lg shadow-emerald-500/5">
          <div>
            <p className="text-[11px] uppercase text-slate-400 font-semibold">
              Seu XP
            </p>
            <p className="text-2xl font-bold text-emerald-400">{xp} XP</p>
          </div>
          <Sparkles className="w-8 h-8 text-emerald-400 animate-spin-slow" />
        </div>

        {/* ITENS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading &&
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse"
              ></div>
            ))}

          {!loading &&
            itens.map((item) => {
              const comprado = comprados.includes(item.id);
              const podeComprar = xp >= item.preco_xp;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 overflow-hidden flex flex-col hover:border-emerald-500/30 transition-all shadow-lg shadow-black/20"
                >
                  {/* imagem com overlay */}
                  <div className="relative h-36 bg-slate-800 flex items-center justify-center overflow-hidden">
                    {item.imagem_url ? (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sparkles className="w-10 h-10 text-emerald-400 opacity-40" />
                    )}

                    {/* categoria */}
                    <span className="absolute top-2 left-2 px-2 py-1 text-[10px] uppercase bg-black/40 backdrop-blur-sm text-emerald-300 rounded-full border border-emerald-500/30">
                      {item.categoria}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm">{item.nome}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex-1">
                      {item.descricao}
                    </p>

                    {/* footer do card */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-emerald-400 text-sm font-bold">
                        {item.preco_xp} XP
                      </span>

                      {comprado ? (
                        <div className="text-emerald-400 text-xs flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" />
                          Adquirido
                        </div>
                      ) : (
                        <Button
                          disabled={!podeComprar || comprando === item.id}
                          onClick={() => comprarItem(item)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs px-3 py-1"
                        >
                          {comprando === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : podeComprar ? (
                            "Comprar"
                          ) : (
                            <span className="flex items-center gap-1">
                              <Lock className="w-3 h-3" /> XP insuficiente
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

/* animação */
const styles = `
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 6s linear infinite; }
@keyframes fade-in { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fade-in .3s ease-out; }
`;
