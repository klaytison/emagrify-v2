"use client";

import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
} from "react";
import { motion } from "framer-motion";
import { Target, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// 🔊 URLs dos sons fofinhos (hospede no seu app ou bucket próprio)
// Ex: Supabase Storage, S3, ou pasta /public/sounds
const OPEN_SOUND_URL = "/sounds/emagrify-open-soft.mp3";
const SUCCESS_SOUND_URL = "/sounds/emagrify-success-cute.mp3";
const ERROR_SOUND_URL = "/sounds/emagrify-error-soft.mp3";

interface MicroMetaFormProps {
  metaId: string;
  onSuccess?: () => void;
}

function useCuteSounds() {
  const openSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof Audio === "undefined") return;

    openSoundRef.current = new Audio(OPEN_SOUND_URL);
    successSoundRef.current = new Audio(SUCCESS_SOUND_URL);
    errorSoundRef.current = new Audio(ERROR_SOUND_URL);

    if (openSoundRef.current) openSoundRef.current.volume = 0.15;
    if (successSoundRef.current) successSoundRef.current.volume = 0.2;
    if (errorSoundRef.current) errorSoundRef.current.volume = 0.2;

    // Tentativa de tocar um som fofinho de "tela aberta"
    try {
      openSoundRef.current?.play().catch(() => {});
    } catch {
      // ignorado
    }
  }, []);

  function play(ref: RefObject<HTMLAudioElement>) {
    try {
      const el = ref.current;
      if (!el) return;
      el.currentTime = 0;
      el.play().catch(() => {});
    } catch {
      // ignore
    }
  }

  return {
    openSoundRef,
    successSoundRef,
    errorSoundRef,
    play,
  };
}

export function MicroMetaForm({ metaId, onSuccess }: MicroMetaFormProps) {
  const { supabase, session } = useSupabase();
  const { toast } = useToast();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [semana, setSemana] = useState<number>(1);
  const [salvando, setSalvando] = useState(false);

  const {
    openSoundRef,
    successSoundRef,
    errorSoundRef,
    play,
  } = useCuteSounds();

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!session?.user) {
      play(errorSoundRef);
      toast({
        variant: "destructive",
        title: "Sessão expirada",
        description: "Faça login novamente para criar micro-metas.",
      });
      return;
    }

    if (!titulo.trim()) {
      play(errorSoundRef);
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Dê um nome bonitinho para sua micro-meta 💚",
      });
      return;
    }

    if (semana < 1 || semana > 52 || Number.isNaN(semana)) {
      play(errorSoundRef);
      toast({
        variant: "destructive",
        title: "Semana inválida",
        description: "Escolha um valor entre 1 e 52.",
      });
      return;
    }

    setSalvando(true);

    const { error } = await supabase.from("micro_metas").insert({
      meta_id: metaId,
      titulo,
      descricao,
      semana,
      concluido: false,
    });

    setSalvando(false);

    if (error) {
      console.error(error);
      play(errorSoundRef);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes.",
      });
      return;
    }

    play(successSoundRef);
    toast({
      title: "Micro-meta criada! 🎉",
      description: "Pequenos passos, grandes resultados.",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    });

    if (onSuccess) {
      onSuccess();
    } else {
      setTitulo("");
      setDescricao("");
      setSemana(1);
    }
  }

  function handleSemanaChange(value: string) {
    const num = Number(value);
    if (Number.isNaN(num)) {
      setSemana(1);
    } else {
      setSemana(num);
    }
  }

  function handleSemanaBlur() {
    if (semana < 1) setSemana(1);
    if (semana > 52) setSemana(52);
  }

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-950/70 shadow-xl backdrop-blur-xl"
    >
      {/* Gradiente decorativo no topo */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-40 bg-gradient-to-b from-emerald-500/30 via-emerald-500/5 to-transparent blur-3xl" />

      {/* Áudios invisíveis (caso prefira usar <audio> no DOM) */}
      <audio ref={openSoundRef} className="hidden" />
      <audio ref={successSoundRef} className="hidden" />
      <audio ref={errorSoundRef} className="hidden" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 space-y-6 p-6 sm:p-8"
      >
        {/* Tag + título */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
            <Target className="h-3 w-3" />
            Nova micro-meta
          </span>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">
                Criar micro-meta
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Divida sua meta principal em passos semanais, leves e possíveis.
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end text-right text-[11px] text-slate-400">
              <span>ID da meta</span>
              <code className="mt-0.5 rounded-md bg-slate-900/80 px-2 py-1 font-mono text-[10px] text-slate-300">
                {metaId.slice(0, 10)}...
              </code>
            </div>
          </div>
        </div>

        {/* Campo título */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">
            Título da micro-meta
          </label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Treinar 3x na semana"
            className="border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus-visible:ring-emerald-500"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Algo simples, direto e que você reconheça fácil.</span>
            <span>{titulo.length}/80</span>
          </div>
        </div>

        {/* Campo descrição */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">
            Descrição (opcional)
          </label>
          <Textarea
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Detalhes da micro-meta, lembretes, dias preferidos..."
            className="border-slate-700 bg-slate-900/60 text-slate-50 placeholder:text-slate-500 focus-visible:ring-emerald-500"
          />
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Use esse espaço pra falar com o seu “eu do futuro”.
          </p>
        </div>

        {/* Linha: semana */}
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 sm:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              Semana (1 a 52)
            </label>
            <Input
              type="number"
              min={1}
              max={52}
              value={semana}
              onChange={(e) => handleSemanaChange(e.target.value)}
              onBlur={handleSemanaBlur}
              className="w-full border-slate-700 bg-slate-900/60 text-slate-50 focus-visible:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-500">
              Em qual semana essa micro-meta vai brilhar? ✨
            </p>
          </div>

          <div className="flex sm:justify-end">
            <Button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {salvando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Salvar micro-meta
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
