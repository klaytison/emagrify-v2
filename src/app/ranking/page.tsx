"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Crown, Medal, Trophy, Loader2 } from "lucide-react";

interface RankUser {
  user_id: string;
  nome: string | null;
  xp_semanal: number;
  avatar_url: string | null;
  posicao: number;
}

export default function RankingPage() {
  const { supabase, session } = useSupabase();
  const [ranking, setRanking] = useState<RankUser[]>([]);
  const [meuRank, setMeuRank] = useState<RankUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);

      const { data } = await supabase.rpc("ranking_semanal"); // ❗ Função que criaremos

      if (data) {
        setRanking(data);

        if (session?.user?.id) {
          const mine = data.find((u: RankUser) => u.user_id === session.user.id);
          if (mine) setMeuRank(mine);
        }
      }

      setLoading(false);
    }

    loadRanking();
  }, [session, supabase]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="max-w-3xl mx-auto px-5 py-8 space-y-6">
        {/* título */}
        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-emerald-400" />
          <h1 className="text-2xl font-bold">Ranking Semanal</h1>
        </div>

        <p className="text-slate-400 text-sm">
          Os jogadores que mais ganharam XP nesta semana aparecem aqui.
        </p>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        )}

        {/* TOPO 3 */}
        {!loading && ranking.length >= 3 && (
          <section className="grid grid-cols-3 gap-3 mt-6">
            {ranking.slice(0, 3).map((u, i) => {
              const bg =
                i === 0
                  ? "from-yellow-400 to-yellow-600"
                  : i === 1
                  ? "from-slate-300 to-slate-500"
                  : "from-amber-700 to-amber-900";

              const icon =
                i === 0 ? Crown : i === 1 ? Medal : Trophy;

              return (
                <div
                  key={u.user_id}
                  className="rounded-3xl p-4 text-center flex flex-col items-center border border-slate-800 bg-slate-900"
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg`}
                  >
                    {icon && (
                      <icon.type className="w-8 h-8 text-white drop-shadow-lg" />
                    )}
                  </div>

                  <img
                    src={u.avatar_url || "/avatar-default.png"}
                    className="w-14 h-14 rounded-full mt-3 border border-slate-700 object-cover"
                  />

                  <p className="font-semibold mt-2 text-sm">
                    {u.nome || "Usuário"}
                  </p>
                  <p className="text-emerald-400 text-xs font-semibold">
                    {u.xp_semanal} XP
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                    {i + 1}º Lugar
                  </p>
                </div>
              );
            })}
          </section>
        )}

        {/* LISTA DO RANKING */}
        <section className="space-y-3 mt-8">
          {ranking.slice(3).map((u) => (
            <div
              key={u.user_id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                <p className="text-slate-400 text-sm w-6">{u.posicao}º</p>

                <img
                  src={u.avatar_url || "/avatar-default.png"}
                  className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                />

                <div>
                  <p className="font-medium text-sm">{u.nome || "Usuário"}</p>
                  <p className="text-xs text-emerald-400 font-semibold">
                    {u.xp_semanal} XP
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* MEU RANKING (sempre aparece) */}
        {meuRank && (
          <section className="mt-10 rounded-xl p-4 bg-slate-900 border border-slate-800">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
              Sua posição
            </p>

            <div className="flex items-center gap-3">
              <p className="text-emerald-400 font-bold text-lg">
                {meuRank.posicao}º
              </p>

              <img
                src={meuRank.avatar_url || "/avatar-default.png"}
                className="w-12 h-12 rounded-full object-cover border border-slate-700"
              />

              <div>
                <p className="font-medium text-sm">{meuRank.nome}</p>
                <p className="text-emerald-400 text-xs font-semibold">
                  {meuRank.xp_semanal} XP nesta semana
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
