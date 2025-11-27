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
  const [slider, setSlider] = useState(50); // porcentagem do corte

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

    setAntes(data[0]); // mais antiga
    setDepois(data[data.length - 1]); // mais recente

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

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          </div>
        )}

        {/* SE NÃO TIVER DADOS */}
        {!loading && (!antes || !depois) && (
          <div className="text-center text-gray-400 py-20">
            Você precisa ter pelo meno
