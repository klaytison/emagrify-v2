"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Header from "@/components/Header";
import { useSupabase } from "@/providers/SupabaseProvider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dumbbell,
  Flame,
  Clock,
  Gauge,
  Loader2,
  Filter,
} from "lucide-react";

type Nivel = "iniciante" | "intermediario" | "avancado" | string;

interface Treino {
  id: string;
  titulo: string;
  descricao: string | null;
  nivel: Nivel;
  categoria: string | null;
  duracao: number | null;
  calorias: number | null;
  imagem_url: string | null;
  created_at: string;
}

/**
 * Classifica duração em faixa textual
 */
function getDuracaoCategoria(minutos: number | null | undefined) {
  if (!minutos || minutos <= 0) return "indefinido";
  if (minutos <= 25) return "curto";
  if (minutos <= 45) return "médio";
  return "longo";
}

export default function TreinosPage() {
  const { session } = useSupabase();

  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [nivelFiltro, setNivelFiltro] = useState<Nivel | "todos">("todos");
  const [duracaoFiltro, setDuracaoFiltro] = useState<
    "todos" | "curto" | "medio" | "longo"
  >("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  useEffect(() => {
    const loadTreinos = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/treinos");
        const data = await res.json();

        if (!res.ok) {
          console.error("Erro ao carregar treinos:", data);
          setError(data.error || "Não foi possível carregar os treinos.");
          return;
        }

        const lista: Treino[] = data.treinos ?? data.data ?? [];
        setTreinos(lista);
      } catch (err) {
        console.error(err);
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    loadTreinos();
  }, []);

  // Lista filtrada (filtragem no cliente)
  const treinosFiltrados = treinos.filter((t) => {
    // Filtro nível
    if (nivelFiltro !== "todos") {
      if (!t.nivel || t.nivel !== nivelFiltro) return false;
    }

    // Filtro duração
    const categoriaDur = getDuracaoCategoria(t.duracao ?? null);
    if (duracaoFiltro === "curto" && categoriaDur !== "curto") return false;
    if (duracaoFiltro === "medio" && categoriaDur !== "médio") return false;
    if (duracaoFiltro === "longo" && categoriaDur !== "longo") return false;

    // Filtro categoria (texto)
    if (categoriaFiltro.trim()) {
      const termo = categoriaFiltro.trim().toLowerCase();
      const cat = (t.categoria || "").toLowerCase();
      const titulo = (t.titulo || "").toLowerCase();
      if (!cat.includes(termo) && !titulo.includes(termo)) return false;
    }

    return true;
  });

  const treinoDestaque = treinosFiltrados[0] ?? treinos[0] ?? null;
  const demaisTreinos = treinoDestaque
    ? treinosFiltrados.filter((t) => t.id !== treinoDestaque.id)
    : treinosFiltrados;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-10">
        {/* Título + intro */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#7BE4B7]/15 px-3 py-1 text-xs font-semibold text-[#2A2A2A] dark:text-gray-100">
              <Dumbbell className="w-4 h-4 text-[#7BE4B7]" />
              Treinos adaptados
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Treinos pensados para a sua rotina
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              Escolha treinos de acordo com seu nível, tempo disponível e
              objetivo. Em breve, a IA do Emagrify irá montar sessões 100%
              personalizadas para você.
            </p>
          </div>

          {session && (
            <div className="text-xs text-gray-500 dark:text-gray-400 md:text-right">
              Logada como{" "}
              <span className="font-semibold">
                {session.user?.email ?? "usuária"}
              </span>
              . Em breve os treinos serão ajustados automaticamente ao seu
              progresso.
            </div>
          )}
        </section>

        {/* Filtros */}
        <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4 text-[#7BE4B7]" />
            <span>Filtrar treinos</span>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Nível */}
            <select
              value={nivelFiltro}
              onChange={(e) =>
                setNivelFiltro(e.target.value as Nivel | "todos")
              }
              className="text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            >
              <option value="todos">Todos os níveis</option>
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>

            {/* Duração */}
            <select
              value={duracaoFiltro}
              onChange={(e) =>
                setDuracaoFiltro(
                  e.target.value as "todos" | "curto" | "medio" | "longo"
                )
              }
              className="text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            >
              <option value="todos">Todas as durações</option>
              <option value="curto">Até 25min</option>
              <option value="medio">25–45min</option>
              <option value="longo">Mais de 45min</option>
            </select>

            {/* Categoria / busca */}
            <input
              type="text"
              placeholder="Buscar por nome ou categoria..."
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="flex-1 md:w-60 text-xs md:text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7BE4B7]"
            />
          </div>
        </section>

        {/* Estado de carregamento / erro */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Carregando treinos...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-300 bg-red-50 text-red-900 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && treinosFiltrados.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum treino encontrado com os filtros selecionados. Tente ajustar
            os filtros ou limpar a busca.
          </p>
        )}

        {!loading && !error && treinosFiltrados.length > 0 && (
          <>
            {/* Destaque + carrossel */}
            {treinoDestaque && (
              <section className="grid lg:grid-cols-[1.4fr,1fr] gap-6 items-stretch">
                {/* Card destaque */}
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-50 relative">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    {treinoDestaque.imagem_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={treinoDestaque.imagem_url}
                        alt={treinoDestaque.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500/40 via-sky-500/40 to-slate-900" />
                    )}
                  </div>

                  <div className="relative z-10 p-6 space-y-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                    <div className="flex items-center gap-2 text-xs">
                      {treinoDestaque.categoria && (
                        <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200">
                          {treinoDestaque.categoria}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-full bg-sky-500/20 text-sky-100 capitalize">
                        {treinoDestaque.nivel || "Nível livre"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-300">
                      <Flame className="w-3 h-3 text-amber-300" />
                      <span>
                        Focado em queimar calorias e acelerar sua evolução.
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      {treinoDestaque.titulo}
                    </h2>

                    {treinoDestaque.descricao && (
                      <p className="text-sm text-gray-200 line-clamp-3">
                        {treinoDestaque.descricao}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-gray-200">
                      {treinoDestaque.duracao != null && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {treinoDestaque.duracao} min
                        </span>
                      )}
                      {treinoDestaque.calorias != null && (
                        <span className="inline-flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          ~{treinoDestaque.calorias} kcal
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        {getDuracaoCategoria(
                          treinoDestaque.duracao ?? null
                        ).toUpperCase()}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Link href={`/treinos/${treinoDestaque.id}`}>
                        <Button className="bg-emerald-500 hover:bg-emerald-500/90 text-white font-semibold">
                          Começar treino
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border-gray-500/60 text-gray-100 hover:bg-white/5"
                        asChild
                      >
                        <Link href="/monitoramento">
                          Registrar depois
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Carrossel lateral */}
                {demaisTreinos.length > 0 && (
                  <Card className="border-gray-800 bg-gray-900/80 text-gray-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-emerald-400" />
                        Outros treinos recomendados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {demaisTreinos.slice(0, 6).map((t) => (
                          <Link
                            key={t.id}
                            href={`/treinos/${t.id}`}
                            className="min-w-[180px] max-w-[200px] rounded-xl border border-gray-800 bg-gray-950/80 p-3 flex flex-col justify-between hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-colors"
                          >
                            <div className="space-y-1">
                              <p className="text-xs text-gray-400 line-clamp-1">
                                {t.categoria || "Treino geral"}
                              </p>
                              <p className="text-sm font-semibold line-clamp-2">
                                {t.titulo}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                              <span className="capitalize">
                                {t.nivel || "Nível livre"}
                              </span>
                              {t.duracao != null && (
                                <span>{t.duracao} min</span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </section>
            )}

            {/* Grid principal */}
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">
                  Todos os treinos disponíveis
                </h2>
                <p className="text-xs text-gray-500">
                  {treinosFiltrados.length} treino
                  {treinosFiltrados.length !== 1 && "s"} encontrado
                  {nivelFiltro !== "todos" && (
                    <> • nível {nivelFiltro.toString()}</>
                  )}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {treinosFiltrados.map((t) => (
                  <Link
                    key={t.id}
                    href={`/treinos/${t.id}`}
                    className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:border-emerald-500/70 hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="h-32 w-full relative overflow-hidden">
                      {t.imagem_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.imagem_url}
                          alt={t.titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-500/30 via-sky-500/30 to-slate-900" />
                      )}
                    </div>

                    <div className="p-3 space-y-2 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 capitalize">
                          {t.nivel || "Nível livre"}
                        </span>
                        {t.categoria && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px]">
                            {t.categoria}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-semibold line-clamp-2">
                        {t.titulo}
                      </p>

                      {t.descricao && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {t.descricao}
                        </p>
                      )}

                      <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 gap-2">
                        <div className="flex items-center gap-2">
                          {t.duracao != null && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {t.duracao} min
                            </span>
                          )}
                          {t.calorias != null && (
                            <span className="inline-flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              ~{t.calorias} kcal
                            </span>
                          )}
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
                          Ver treino
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
