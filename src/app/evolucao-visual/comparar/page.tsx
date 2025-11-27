"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { motion } from "framer-motion";
import { ArrowLeftRight, Loader2 } from "lucide-react";

export default function CompararSilhuetaPage() {
  const { supabase, session } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [antes, setAntes] = useState<any | null>(null);
  const [depois, setDepois] = useState<any | null>(null);
  const [slider, setSlider] = useState(50);

  async function carregar() {
    if (!session?.user) return;

    const { data } = await supabase
      .from("evolucao_silhuetas")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (!data || data.length < 2) {
      setAntes(null);
      setDepois(null);
      setLoading(false);
      return;
    }

    setAntes(data[0]); 
    setDepois(data[data.length - 1]); 
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [session]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-100 transition">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-bold">Comparar Silhuetas</h1>
        </div>

        <p className="text-gray-400 mb-10">
          Compare automaticamente sua primeira silhueta com a mais recente.
        </p>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        )}

        {!loading && (!antes || !depois) && (
          <div className="text-center text-gray-400 py-20">
            Você precisa ter pelo menos <strong>2 silhuetas salvas</strong> para comparar.
          </div>
        )}

        {!loading && antes && depois && (
          <>
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max="100"
                value={slider}
                onChange={(e) => setSlider(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            <div className="relative w-full flex justify-center">
              <div className="relative w-[250px] h-[460px] border border-gray-800 rounded-xl overflow-hidden bg-gray-900/40">

                <div
                  className="absolute inset-0 flex justify-center items-start"
                  dangerouslySetInnerHTML={{ __html: depois.silhueta_svg }}
                />

                <div
                  className="absolute inset-0 flex justify-center items-start overflow-hidden"
                  style={{ width: `${slider}%` }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: antes.silhueta_svg }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-400 mt-4">
              <span>Primeira silhueta</span>
              <span>Mais recente</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
