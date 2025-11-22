"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dumbbell,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface Exercise {
  id: string;
  nome: string;
  series: string;
  repeticoes: string;
  descansoSegundos: string;
}

const ADMIN_EMAIL = "klaytsa3@gmail.com";

export default function NovoTreinoPage() {
  const router = useRouter();
  const { session, loading: loadingSession } = useSupabase();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [nivel, setNivel] = useState<"iniciante" | "intermediario" | "avancado" | "">("");
  const [categoria, setCategoria] = useState("");
  const [duracao, setDuracao] = useState("");
  const [calorias, setCalorias] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  const [exercicios, setExercicios] = useState<Exercise[]>([
    {
      id: "ex-1",
      nome: "",
      series: "",
      repeticoes: "",
      descansoSegundos: "",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin =
    session?.user?.email &&
    session.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  function handleAddExercise() {
    setExercicios((prev) => [
      ...prev,
      {
        id: `ex-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        nome: "",
        series: "",
        repeticoes: "",
        descansoSegundos: "",
      },
    ]);
  }

  function handleRemoveExercise(id: string) {
    setExercicios((prev) => prev.filter((ex) => ex.id !== id));
  }

  function handleExerciseChange(
    id: string,
    field: keyof Omit<Exercise, "id">,
    value: string
  ) {
    setExercicios((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? {
              ...ex,
              [field]: value,
            }
          : ex
      )
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isAdmin) {
      setError("Apenas o administrador pode criar treinos.");
      return;
    }

    if (!titulo.trim()) {
      setError("O título do treino é obrigatório.");
      return;
    }

    if (!nivel) {
      setError("Selecione o nível do treino.");
      return;
    }

    if (!categoria.trim()) {
      setError("Informe uma categoria (ex: força, cardio…).");
      return;
    }

    const exerciciosLimpos = exercicios
      .filter((ex) => ex.nome.trim())
      .map((ex) => ({
        nome: ex.nome.trim(),
        series: ex.series.trim() || null,
        repeticoes: ex.repeticoes.trim() || null,
        descansoSegundos: ex.descansoSegundos.trim()
          ? Number(ex.descansoSegundos)
          : null,
      }));

    if (exerciciosLimpos.length === 0) {
      setError("Adicione pelo menos um exercício com nome preenchido.");
      return;
    }

    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      nivel,
      categoria: categoria.trim(),
      duracao: duracao ? Number(duracao) : null,
      calorias: calorias ? Number(calorias) : null,
      exercicios: exerciciosLimpos,
      video_url: videoUrl.trim() || null,
      imagem_url: imagemUrl.trim() || null,
    };

    try {
      setSaving(true);

      const res = await fetch("/api/treinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Erro ao criar treino:", data);
        setError(data.error || "Erro ao criar treino.");
        return;
      }

      setSuccess("Treino criado com sucesso! Redirecionando…");

      // pequena pausa para o usuário ver a mensagem
      setTimeout(() => {
        router.push("/admin/treinos");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // Estado de carregamento da sessão
  if (loadingSession) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando sessão…
        </div>
      </main>
    );
  }

  // Bloqueio se não for admin
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center">
        <div className="max-w-md text-center space-y-3">
          <p className="text-lg font-semibold">Acesso restrito</p>
          <p className="text-sm text-gray-400">
            Esta área é exclusiva do administrador.
          </p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => router.push("/")}
          >
            Voltar para o início
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/treinos")}
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            Novo treino adaptado
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            Cadastre treinos completos com nível, categoria e lista de
            exercícios. Eles aparecerão na aba de <b>Treinos adaptados</b> para
            os usuários.
          </p>
        </header>

        {/* Mensagens */}
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        )}

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-800 bg-gray-900/70 p-6"
        >
          {/* Infos principais */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do treino</Label>
              <Input
                id="titulo"
                placeholder="Ex: Treino de corpo inteiro para iniciantes"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="bg-gray-950 border-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label>Nível</Label>
              <Select
                value={nivel}
                onValueChange={(v) =>
                  setNivel(v as "iniciante" | "intermediario" | "avancado")
                }
              >
                <SelectTrigger className="bg-gray-950 border-gray-800">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                placeholder="Ex: força, HIIT, cardio, alongamento…"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="bg-gray-950 border-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração média (minutos)</Label>
                <Input
                  id="duracao"
                  type="number"
                  min={0}
                  placeholder="Ex: 35"
                  value={duracao}
                  onChange={(e) => setDuracao(e.target.value)}
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calorias">Calorias estimadas</Label>
                <Input
                  id="calorias"
                  type="number"
                  min={0}
                  placeholder="Ex: 280"
                  value={calorias}
                  onChange={(e) => setCalorias(e.target.value)}
                  className="bg-gray-950 border-gray-800"
                />
              </div>
            </div>
          </section>

          {/* Descrição */}
          <section className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={3}
              placeholder="Explique de forma simples o objetivo do treino, para quem é indicado e como ele ajuda na rotina do aluno."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="bg-gray-950 border-gray-800"
            />
          </section>

          {/* Exercícios dinâmicos */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold">Exercícios do treino</h2>
                <p className="text-xs text-gray-400">
                  Adicione os exercícios na ordem em que devem ser executados.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10"
                onClick={handleAddExercise}
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar exercício
              </Button>
            </div>

            <div className="space-y-3">
              {exercicios.map((ex, index) => (
                <div
                  key={ex.id}
                  className="rounded-xl border border-gray-800 bg-gray-950/80 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs uppercase tracking-wide text-gray-500">
                      Exercício #{index + 1}
                    </span>
                    {exercicios.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(ex.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nome do exercício</Label>
                      <Input
                        placeholder="Ex: Agachamento, flexão, polichinelo…"
                        value={ex.nome}
                        onChange={(e) =>
                          handleExerciseChange(ex.id, "nome", e.target.value)
                        }
                        className="bg-gray-900 border-gray-800"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Séries</Label>
                        <Input
                          placeholder="Ex: 3"
                          value={ex.series}
                          onChange={(e) =>
                            handleExerciseChange(ex.id, "series", e.target.value)
                          }
                          className="bg-gray-900 border-gray-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Repetições</Label>
                        <Input
                          placeholder="Ex: 12"
                          value={ex.repeticoes}
                          onChange={(e) =>
                            handleExerciseChange(
                              ex.id,
                              "repeticoes",
                              e.target.value
                            )
                          }
                          className="bg-gray-900 border-gray-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Descanso (seg)</Label>
                        <Input
                          placeholder="Ex: 45"
                          value={ex.descansoSegundos}
                          onChange={(e) =>
                            handleExerciseChange(
                              ex.id,
                              "descansoSegundos",
                              e.target.value
                            )
                          }
                          className="bg-gray-900 border-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Vídeo e imagem */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video">URL do vídeo (opcional)</Label>
              <Input
                id="video"
                placeholder="https://youtu.be/..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-gray-950 border-gray-800"
              />
              <p className="text-[11px] text-gray-500">
                Pode ser link do YouTube, Vimeo ou outro player embutido.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem">URL da imagem (thumb)</Label>
              <Input
                id="imagem"
                placeholder="https://.../capa-treino.jpg"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                className="bg-gray-950 border-gray-800"
              />
              <p className="text-[11px] text-gray-500">
                Imagem exibida como capa do treino na listagem.
              </p>
            </div>
          </section>

          {/* Botão salvar */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-500/90 text-white px-6"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando treino…
                </span>
              ) : (
                "Salvar treino"
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

