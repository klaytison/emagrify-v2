"use client";

import { useSupabase } from "@/providers/SupabaseProvider";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Sparkles,
  Swords,
  Target,
  Calendar,
  Trophy,
  CheckCircle2,
  Clock,
  ChevronRight,
  Star,
  Dumbbell,
} from "lucide-react";

// Tipos de dados
type MissaoTipo = "treino" | "extra" | "bonus";

interface Missao {
  id: string;
  tipo: MissaoTipo;
  titulo: string;
  descricao: string;
  recompensaXp: number;
  concluida: boolean;
  obrigatoria: boolean;
  ligadoATreinoId?: string | null;
}

interface DesafioSemanalIA {
  id: string;
  tema: string;
  subtitulo: string;
  semanaTexto: string;
  focoPrincipal: string;
  focoSecundario: string;
  caloriasAlvo: number;
  treinosAlvo: number;
  missoes: Missao[];
  xpTotal: number;
  xpAtual: number;
  nivelBatalha: "Bronze" | "Prata" | "Ouro" | "Lendário";
}

export default function DesafiosSemanaisPage() {
  const { supabase, session } = useSupabase(); // ⭐ AGORA ESTÁ AQUI
  const [desafio, setDesafio] = useState<DesafioSemanalIA | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para pegar semana atual corretamente
  function getISOWeek(date: Date): number {
    const newDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = newDate.getUTCDay() || 7;
    newDate.setUTCDate(newDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(newDate.getUTCFullYear(), 0, 1));
    return Math.ceil((((newDate as any) - (yearStart as any)) / 86400000 + 1) / 7);
  }

  // Carrega desafio real usando Supabase + IA
  useEffect(() => {
    async function load() {
      if (!session?.user?.id) return;

      setLoading(true);

      // 1) Busca se já existe desafio da semana
      const { data: desafioAtual } = await supabase
        .from("desafios_semanais")
        .select("*")
        .order("criado_em", { ascending: false })
        .limit(1)
        .maybeSingle();

      let desafioID = desafioAtual?.id;

      // 2) Se não existir => chama função IA gerar
      if (!desafioAtual) {
        const semana = getISOWeek(new Date());
        const ano = new Date().getFullYear();

        const { data: novoDesafio } = await supabase.functions.invoke(
          "desafio-semanal",
          {
            body: { semana, ano },
          }
        );

        desafioID = novoDesafio?.id;
      }

      if (!desafioID) {
        setLoading(false);
        return;
      }

      // 3) Carregar info do desafio
      const { data: desafioInfo } = await supabase
        .from("desafios_semanais")
        .select("*")
        .eq("id", desafioID)
        .single();

      // 4) Carregar missões
      const { data: missoes } = await supabase
        .from("desafios_missoes")
        .select("*")
        .eq("desafio_id", desafioID);

      // 5) Carregar progresso do usuário
      const { data: userStatus } = await supabase
        .from("desafios_usuario")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("desafio_id", desafioID)
        .maybeSingle();

      // Converte para o formato da página
      setDesafio({
        id: desafioID,
        tema: desafioInfo.tema,
        subtitulo: desafioInfo.subtitulo,
        semanaTexto: `Semana ${desafioInfo.semana} · ${desafioInfo.ano}`,
        focoPrincipal: desafioInfo.foco_principal,
        focoSecundario: desafioInfo.foco_secundario,
        caloriasAlvo: desafioInfo.calorias_alvo,
        treinosAlvo: desafioInfo.treinos_alvo,
        xpTotal: desafioInfo.xp_total,
        xpAtual: userStatus?.xp_atual ?? 0,
        nivelBatalha: userStatus?.nivel_batalha ?? "Bronze",
        missoes: missoes.map((m: any) => ({
          id: m.id,
          tipo: m.tipo,
          titulo: m.titulo,
          descricao: m.descricao,
          recompensaXp: m.recompensa_xp,
          concluida: userStatus?.missoes_concluidas?.includes(m.id) ?? false,
          obrigatoria: m.obrigatoria,
          ligadoATreinoId: m.treino_id,
        })),
      });

      setLoading(false);
    }

    load();
  }, [session, supabase]);

  // LOADING
  if (loading || !desafio) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-40 bg-slate-800 rounded-full" />
            <div className="h-40 bg-slate-900 rounded-3xl" />
            <div className="h-32 bg-slate-900 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  // (resto da sua página continua IGUAL — não mexi no layout)
  // ⬇️ ⬇️ ⬇️
