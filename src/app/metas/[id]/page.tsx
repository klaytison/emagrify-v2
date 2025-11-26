"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Loader2,
  Target,
  PlusCircle,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 🎉 confete e troféu
import soltarConfete from "@/components/animations/Confetti";
import TrophyAnimation from "@/components/animations/Trophy";

const victorySoundUrl =
  "https://cdn.pixabay.com/audio/2022/03/15/audio_f90d1afee.mp3";

type MetaPrincipal = {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  dificuldade: string;
  inicio: string | null;
  fim: string | null;
  criado_em: string;
};

type MicroMeta = {
  id: string;
  meta_id: string;
  titulo: string;
  descricao: string | null;
  semana: number;
  concluido: boolean;
};

export default function MetaDetalhes() {
  const { supabase, session } = useSupabase();
  const params = useParams();
  const router = useRouter();

  const metaId = params.id as string;

  const [meta, setMeta] = useState<MetaPrincipal | null>(null);
  const [microMetas, setMicroMetas] = useState<MicroMeta[]>([]);
  con
