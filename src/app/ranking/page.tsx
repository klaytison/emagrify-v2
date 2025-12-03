"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Crown, Loader2 } from "lucide-react";

interface RankItem {
  user_id: string;
  nome: string;
  xp_semanal: number;
  avatar_url: string | null;
  posicao: number;
}

export default function RankingSemanalPage() {
  const [ranking, setRanking] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ranking");
        const json = await res.json();
        setRanking(json.ranking || []);
      } catch (e) {
        console.error("Erro ao carregar ranking:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function corDaPosicao(posicao: number) {
    switch (posicao) {
      case 1:
        return "from-yellow-300 to-amber-500 shadow-yellow-400/30";
      case 2:
        return "from-gray-300 to-gray-500 shadow-gray-400/30";
      case 3:
        return "from-amber-600 to-orange-700 shadow-orange-500/30";
      default:
        return "from-slate-800 to-slate-900";
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-transparent">
            Ranking Semanal
          </h1>
          <p className="text-sm text-slate-400">
            Veja quem lidera esta semana com mais XP em desafios e treinos 💪
          </p>
        </div>

        {/* loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          </div>
        )}

        {/* ranking vazio */}
        {!loading && ranking.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            Nenhum usuário pontuou esta semana ainda.
          </div>
        )}

        {/* ranking */}
        <div className="space-y-4">
          {ranking.map((r) => (
            <div
              key={r.user_id}
              className={`
                relative rounded-2xl overflow-hidden border border-slate-800 
                bg-gradient-to-br ${corDaPosicao(r.posicao)} 
                p-[1px] shadow-lg
              `}
            >
              <div
                className="rounded-2xl bg-slate-950/70 backdrop-blur-xl p-4 flex items-center justify-between"
              >
                {/* left: posição + avatar + nome */}
                <div className="flex items-center gap-4">
                  {/* posição */}
                  <div className="w-10 text-center">
                    {r.posicao <= 3 ? (
                      <Crown
                        className={`mx-auto ${
                          r.posicao === 1
                            ? "text-yellow-400"
                            : r.posicao === 2
                            ? "text-gray-300"
                            : "text-orange-500"
                        }`}
                      />
                    ) : (
                      <span className="text-lg font-bold text-slate-300">
                        {r.posicao}º
                      </span>
                    )}
                  </div>

                  {/* avatar */}
                  <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-slate-700 shadow">
                    {r.avatar_url ? (
                      <img
                        src={r.avatar_url}
                        alt={r.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        sem foto
                      </div>
                    )}
                  </div>

                  {/* nome + xp */}
                  <div>
                    <p className="font-semibold text-sm md:text-base">
                      {r.nome}
                    </p>
                    <p className="text-xs text-slate-400">
                      {r.xp_semanal} XP nesta semana
                    </p>
                  </div>
                </div>

                {/* barra de xp */}
                <div className="flex-1 mx-4 hidden md:block">
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all"
                      style={{
                        width: `${Math.min((r.xp_semanal / 1000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* XP final */}
                <div className="text-right font-semibold text-emerald-300">
                  {r.xp_semanal} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
