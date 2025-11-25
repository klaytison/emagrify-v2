"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { MicroMetaForm } from "@/components/metas/MicroMetaForm";

export default function NovaMicroMetaPage() {
  const params = useParams();
  const router = useRouter();

  const metaId = params.id as string;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50"
    >
      <Header />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-0">
        {/* Título geral da página */}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-slate-100 sm:text-xl">
            Micro-metas da sua jornada
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Crie pequenos compromissos que deixam sua meta principal mais leve
            e possível.
          </p>
        </div>

        <MicroMetaForm
          metaId={metaId}
          onSuccess={() => router.push(`/metas/${metaId}`)}
        />
      </main>
    </motion.div>
  );
}
