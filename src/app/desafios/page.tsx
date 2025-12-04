"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/providers/SupabaseProvider";
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
  const { supabase, session } = useSupabase();

async function concluirMissao(missaoId: string) {
  if (!session?.user) return;

  const res = await fetch("/api/desafios/concluir-missao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: session.user.id,
      desafio_id: desafio?.id,
      missao_id: missaoId,
    }),
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  window.location.reload();
}

  const { supabase, session } = useSupabase(); // ✅ AGORA TEMOS session e supabase

  const [desafio, setDesafio] = useState<DesafioSemanalIA | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setErro(null);
        setLoading(true);

        // Se não tiver usuário logado, não tenta carregar nada
        if (!session?.user?.id) {
          setLoading(false);
          setErro("Você precisa estar logada para ver os desafios.");
          return;
        }

        // 1) Verificar se já existe desafio criado para a semana
        const { data: desafioAtual, error: erroDesafioAtual } = await supabase
          .from("desafios_semanais")
          .select("*")
          .order("criado_em", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (erroDesafioAtual) {
          console.error("Erro carregando desafio atual:", erroDesafioAtual);
        }

        let desafioID = desafioAtual?.id;

        // 2) Se não existir desafio da semana, chamar função de IA para gerar um
        if (!desafioAtual) {
          const hoje = new Date();
          const ano = hoje.getFullYear();

          // calcula número da semana de forma simples
          const inicioAno = new Date(ano, 0, 1);
          const diffDias = Math.floor(
            (hoje.getTime() - inicioAno.getTime()) / (1000 * 60 * 60 * 24)
          );
          const semana = Math.floor(diffDias / 7) + 1;

          const { data: novoDesafio, error: erroFunc } =
            await supabase.functions.invoke("desafio-semanal", {
              body: { semana, ano },
            });

          if (erroFunc) {
            console.error("Erro na função desafio-semanal:", erroFunc);
            setErro("Não consegui gerar o desafio da semana.");
            setLoading(false);
            return;
          }

          if (!novoDesafio?.id) {
            console.error("Função desafio-semanal não retornou ID:", novoDesafio);
            setErro("Desafio da semana não pôde ser criado.");
            setLoading(false);
            return;
          }

          desafioID = novoDesafio.id;
        }

        if (!desafioID) {
          setErro("Nenhum desafio foi encontrado.");
          setLoading(false);
          return;
        }

        // 3) Carregar informações do desafio
        const { data: desafioInfo, error: erroInfo } = await supabase
          .from("desafios_semanais")
          .select("*")
          .eq("id", desafioID)
          .single();

        if (erroInfo || !desafioInfo) {
          console.error("Erro carregando dados do desafio:", erroInfo);
          setErro("Não consegui carregar os dados do desafio.");
          setLoading(false);
          return;
        }

        // 4) Carregar missões
        const { data: missoes, error: erroMissoes } = await supabase
          .from("desafios_missoes")
          .select("*")
          .eq("desafio_id", desafioID);

        if (erroMissoes || !missoes) {
          console.error("Erro carregando missões:", erroMissoes);
          setErro("Não consegui carregar as missões do desafio.");
          setLoading(false);
          return;
        }

        // 5) Carregar status do usuário nesse desafio
        const { data: userStatus, error: erroUserStatus } = await supabase
          .from("desafios_usuario")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("desafio_id", desafioID)
          .maybeSingle();

        if (erroUserStatus) {
          console.error("Erro carregando desafios_usuario:", erroUserStatus);
        }

        const xpAtual = userStatus?.xp_atual ?? 0;
        const nivelBatalha: DesafioSemanalIA["nivelBatalha"] =
          (userStatus?.nivel_batalha as any) || "Bronze";

        const completouTreinosObrigatorios =
          userStatus?.completou_treinos_obrigatorios ?? false;
        const completouTudo = userStatus?.completou_tudo ?? false;

        // 6) Montar objeto no formato esperado pelo front
        const missoesConvertidas: Missao[] = missoes.map((m: any) => {
          const concluida =
            completouTudo || (completouTreinosObrigatorios && m.obrigatoria);

          return {
            id: m.id,
            tipo: m.tipo as MissaoTipo,
            titulo: m.titulo,
            descricao: m.descricao,
            recompensaXp: m.recompensa_xp,
            concluida,
            obrigatoria: m.obrigatoria,
            ligadoATreinoId: m.treino_id,
          };
        });

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
          xpAtual,
          nivelBatalha,
          missoes: missoesConvertidas,
        });

        setLoading(false);
      } catch (err) {
        console.error("Erro geral /desafios:", err);
        setErro("Aconteceu um erro ao carregar os desafios.");
        setLoading(false);
      }
    }

    // só carrega depois que souber se tem sessão
    if (session !== undefined) {
      load();
    }
  }, [session, supabase]);

  // ================== ESTADOS ESPECIAIS ==================

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-lg font-semibold">
            Faça login para acessar seus desafios semanais.
          </p>
          <p className="text-sm text-slate-400 max-w-md">
            Os desafios são conectados ao seu usuário para salvar XP, progresso
            e recompensas.
          </p>
        </main>
      </div>
    );
  }

  if (loading || !desafio) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10">
          {erro && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {erro}
            </div>
          )}
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-40 bg-slate-800 rounded-full" />
            <div className="h-40 bg-slate-900 rounded-3xl" />
            <div className="h-32 bg-slate-900 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  // ================== CÁLCULOS DE PROGRESSO ==================

  const totalObrig = desafio.missoes.filter((m) => m.obrigatoria).length || 0;
  const obrigConcluidas = desafio.missoes.filter(
    (m) => m.obrigatoria && m.concluida
  ).length;

  const progressoTreinosObrigatorios =
    totalObrig > 0 ? obrigConcluidas / totalObrig : 0;

  const totalMissoes = desafio.missoes.length || 0;
  const missoesConcluidas = desafio.missoes.filter((m) => m.concluida).length;
  const progressoMissoes =
    totalMissoes > 0 ? missoesConcluidas / totalMissoes : 0;

  const xpPercent = desafio.xpTotal
    ? Math.min((desafio.xpAtual / desafio.xpTotal) * 100, 100)
    : 0;

  // ================== HELPERS VISUAIS ==================

  function badgeNivel(nivel: DesafioSemanalIA["nivelBatalha"]) {
    if (nivel === "Bronze")
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    if (nivel === "Prata")
      return "bg-slate-200/10 text-slate-100 border-slate-300/30";
    if (nivel === "Ouro")
      return "bg-yellow-400/20 text-yellow-200 border-yellow-400/40";
    return "bg-purple-500/20 text-purple-200 border-purple-400/40";
  }

  function getTipoLabel(tipo: MissaoTipo) {
    if (tipo === "treino") return "Treino principal";
    if (tipo === "extra") return "Missão extra";
    return "Missão bônus";
  }

  function getTipoCor(tipo: MissaoTipo) {
    if (tipo === "treino") return "text-emerald-300 bg-emerald-500/10";
    if (tipo === "extra") return "text-sky-300 bg-sky-500/10";
    return "text-violet-300 bg-violet-500/10";
  }

  // ================== UI ==================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* topo */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Desafios semanais com IA
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              {desafio.tema}
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-400">
              {desafio.subtitulo}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {desafio.semanaTexto}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Gerado automaticamente pela IA do Emagrify
            </span>
          </div>
        </section>

        {/* card principal: tema + batalha */}
        <section className="grid md:grid-cols-[1.2fr,0.8fr] gap-5">
          {/* Tema da semana */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                  Tema da semana (IA)
                </p>
                <p className="text-sm text-slate-200">
                  Foco principal:{" "}
                  <span className="font-semibold">
                    {desafio.focoPrincipal}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Foco secundário: {desafio.focoSecundario}
                </p>
              </div>

              <div className="hidden md:flex flex-col items-end text-right text-xs">
                <span className="text-slate-300">Treinos alvo</span>
                <span className="text-xl font-semibold">
                  {desafio.treinosAlvo}
                </span>
                <span className="text-[11px] text-slate-500">
                  sugeridos pela IA
                </span>
              </div>
            </div>

            {/* metas principais */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-center gap-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Meta de calorias
                  </p>
                  <p className="font-semibold text-slate-50">
                    {desafio.caloriasAlvo} kcal
                  </p>
                  <p className="text-[11px] text-slate-500">
                    estimadas pela IA
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-center gap-3">
                <Target className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Treinos principais
                  </p>
                  <p className="font-semibold text-slate-50">
                    {totalObrig} treinos
                  </p>
                  <p className="text-[11px] text-slate-500">
                    temáticos da semana
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 flex items-center gap-3">
                <Clock className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Progresso geral
                  </p>
                  <p className="font-semibold text-slate-50">
                    {Math.round(progressoMissoes * 100)}%
                  </p>
                  <p className="text-[11px] text-slate-500">
                    missões concluídas
                  </p>
                </div>
              </div>
            </div>

            {/* barra de progresso treinos obrigatórios */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Progresso dos treinos principais</span>
                <span>
                  {Math.round(progressoTreinosObrigatorios * 100)}% completos
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-400 transition-all"
                  style={{
                    width: `${Math.min(
                      progressoTreinosObrigatorios * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Batalha da semana */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1">
                  <Swords className="w-4 h-4 text-violet-300" />
                  Batalha da semana
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  Nível atual:{" "}
                  <span className="font-bold">{desafio.nivelBatalha}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Suba de nível completando treinos e missões IA.
                </p>
              </div>

              <div
                className={`px-3 py-2 rounded-2xl border text-[11px] font-semibold flex flex-col items-end gap-1 ${badgeNivel(
                  desafio.nivelBatalha
                )}`}
              >
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Liga
                </span>
                <span>{desafio.nivelBatalha}</span>
              </div>
            </div>

            {/* XP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>XP da semana</span>
                <span>
                  {desafio.xpAtual} / {desafio.xpTotal} XP
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 via-emerald-400 to-amber-300 transition-all"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {missoesConcluidas} / {totalMissoes} missões
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900 border border-slate-700">
                <Star className="w-3 h-3 text-yellow-300" />
                IA ativa — desafios ajustados ao seu perfil
              </span>
            </div>

            <Button className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-xs md:text-sm flex items-center justify-center gap-2">
              Ver plano da semana
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* missões divididas em seções: treinos, extras, bônus */}
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm md:text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Missões da semana
            </h2>
            <p className="text-[11px] md:text-xs text-slate-400">
              Todas as missões foram montadas pela IA com base no seu objetivo,
              nível e foco da semana.
            </p>
          </div>

          <div className="space-y-4">
            {/* TREINOS PRINCIPAIS */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                <Dumbbell className="w-3 h-3 text-emerald-400" />
                Treinos principais da IA (obrigatórios)
              </p>

              <div className="space-y-2">
                {desafio.missoes
                  .filter((m) => m.tipo === "treino")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTipoCor(
                              m.tipo
                            )}`}
                          >
                            {getTipoLabel(m.tipo)}
                          </span>
                          {m.concluida && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              concluído
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold">{m.titulo}</p>
                        <p className="text-[11px] md:text-xs text-slate-400">
                          {m.descricao}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-emerald-300">
                          +{m.recompensaXp} XP
                        </span>
                        <Button
                          size="sm"
                          variant={m.concluida ? "outline" : "default"}
                          className={
                            m.concluida
                              ? "border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs"
                              : "bg-emerald-600 hover:bg-emerald-700 text-xs"
                          }
                          onClick={() => {
                            if (m.ligadoATreinoId) {
                              window.location.href = `/treinos/${m.ligadoATreinoId}`;
                            }
                          }}
                        >
                          {m.concluida ? "Ver detalhes" : "Iniciar treino IA"}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* MISSÕES EXTRAS */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                <Flame className="w-3 h-3 text-sky-300" />
                Missões extras da semana
              </p>

              <div className="space-y-2">
                {desafio.missoes
                  .filter((m) => m.tipo === "extra")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTipoCor(
                              m.tipo
                            )}`}
                          >
                            {getTipoLabel(m.tipo)}
                          </span>
                          {m.concluida && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              concluída
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold">{m.titulo}</p>
                        <p className="text-[11px] md:text-xs text-slate-400">
                          {m.descricao}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-sky-300">
                          +{m.recompensaXp} XP
                        </span>
<Button
  size="sm"
  onClick={() => concluirMissao(m.id)}
  className="bg-emerald-600 hover:bg-emerald-700 text-xs"
>
  Marcar como concluída
</Button>

                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* MISSÕES BÔNUS */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 flex items-center gap-2">
                <Swords className="w-3 h-3 text-violet-300" />
                Missões bônus da batalha
              </p>

              <div className="space-y-2">
                {desafio.missoes
                  .filter((m) => m.tipo === "bonus")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl border border-violet-700/40 bg-violet-950/40 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTipoCor(
                              m.tipo
                            )}`}
                          >
                            {getTipoLabel(m.tipo)}
                          </span>
                          {m.concluida && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              bônus concluído
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold">{m.titulo}</p>
                        <p className="text-[11px] md:text-xs text-violet-100/80">
                          {m.descricao}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-violet-200">
                          +{m.recompensaXp} XP bônus
                        </span>
<Button
  size="sm"
  onClick={() => concluirMissao(m.id)}
  className="bg-violet-600 hover:bg-violet-700 text-xs"
>
  Marcar como concluída
</Button>

                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* rodapé informativo IA */}
        <section className="pb-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] md:text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
              <p>
                Este desafio foi construído 100% pela IA do Emagrify, combinando
                seus dados de objetivo, nível, preferências e limites com
                estratégias reais de treino. A cada semana, um novo tema e uma
                nova batalha são gerados automaticamente.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900 hover:bg-slate-800 mt-1 md:mt-0"
            >
              Ver próximos temas sugeridos pela IA
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
