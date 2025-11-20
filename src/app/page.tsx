"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Home() {
  const [showContactDialog, setShowContactDialog] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* === HERO SECTION (VAI RECEBER A NOVA SEÇÃO PREMIUM NO PASSO 2) === */}
      <section className="relative py-20 bg-gradient-to-br from-[#7BE4B7]/10 via-white dark:via-gray-900 to-[#6ECBF5]/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2A2A2A] dark:text-white">
            Transforme seu corpo e sua <span className="text-[#7BE4B7]">vida</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Plataforma completa com dietas personalizadas, treinos exclusivos e
            suporte diário.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white text-lg px-10"
            onClick={() => (window.location.href = "/checkout")}
          >
            Começar Agora
          </Button>
        </div>
      </section>
{/* === SEÇÃO PREMIUM — PLANO PRINCIPAL === */}
<section
  id="premium"
  className="relative py-24 bg-gradient-to-br from-white via-[#F4F4F4] to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
>
  {/* Efeito de fundo suave */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#7BE4B7]/20 to-[#6ECBF5]/20 blur-3xl opacity-40"></div>

  <div
    className="container mx-auto px-4 relative z-10 animate-fadeSlideUp"
  >
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#2A2A2A] dark:text-white leading-tight">
        Comece sua transformação hoje
      </h2>

      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Junte-se a mais de <span className="font-bold">50.000 pessoas</span>{" "}
        que já transformaram suas vidas com o Emagrify.
      </p>
    </div>

    {/* CARD PREMIUM */}
    <div
      className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-10 text-center 
      animate-fadeSlideUp delay-200"
    >
      <div className="mb-6">
        <span className="inline-block bg-[#FF7A00]/10 text-[#FF7A00] font-bold text-sm px-4 py-1 rounded-full">
          Plano mais escolhido ⭐
        </span>
      </div>

      <h3 className="text-3xl font-extrabold text-[#2A2A2A] dark:text-white">
        Assinatura Mensal
      </h3>

      <div className="mt-6 mb-2">
        <span className="line-through text-gray-500 dark:text-gray-400">
          R$ 125
        </span>
        <span className="ml-3 bg-[#FF7A00] text-white text-xs px-3 py-1 rounded-full">
          24% OFF
        </span>
      </div>

      <div className="text-6xl font-bold text-[#2A2A2A] dark:text-white">
        R$ 95
      </div>
      <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8 text-sm">
        por 30 dias • Cancelamento a qualquer momento
      </p>

      {/* Botão principal */}
      <button
        onClick={() => (window.location.href = "/checkout")}
        className="w-full py-4 text-lg font-semibold rounded-xl
        bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5]
        text-white shadow-lg hover:opacity-90 transition-all"
      >
        Assinar Agora
      </button>

      {/* Benefícios */}
      <ul className="mt-10 space-y-3 text-left">
        {[
          "Dietas personalizadas com IA",
          "Treinos criados para seu objetivo",
          "Acompanhamento diário",
          "Receitas internacionais",
          "Sistema de progresso e métricas",
          "Acesso completo a todos os recursos",
        ].map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-300 animate-fadeSlideUp"
            style={{ animationDelay: `${300 + i * 120}ms` }}
          >
            <span className="w-5 h-5 bg-[#7BE4B7] rounded-full flex items-center justify-center text-white text-sm">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>

</section>
{/* === REAL RESULTS SECTION (PASSO 3) === */}
<section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
  <div className="container mx-auto px-6">
    <div className="text-center mb-14">
      <span className="inline-block bg-[#7BE4B7]/20 text-[#2A2A2A] dark:text-white px-4 py-1 rounded-full text-sm font-semibold">
        Resultados Reais
      </span>
      <h2 className="text-4xl md:text-5xl font-bold mt-4 text-[#2A2A2A] dark:text-white">
        Pessoas como você já transformaram suas vidas
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Saúde, confiança e autoestima renovadas — veja alguns exemplos reais de usuários que seguiram nossos planos.
      </p>
    </div>

    {/* IMAGES GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      
      {/* CARD 1 */}
      <div 
        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <img 
          src="/results/woman1.webp"
          alt="Resultado real 1"
          className="w-full h-80 object-cover"
        />
      </div>

      {/* CARD 2 */}
      <div 
        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <img 
          src="/results/woman2.webp"
          alt="Resultado real 2"
          className="w-full h-80 object-cover"
        />
      </div>

      {/* CARD 3 */}
      <div 
        className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <img 
          src="/results/woman3.webp"
          alt="Resultado real 3"
          className="w-full h-80 object-cover"
        />
      </div>
    </div>

    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
      Resultados reais variam de pessoa para pessoa. O mais importante é começar.
    </p>
  </div>
</section>

      {/* === SEÇÃO FEATURES (vamos melhorar no Passo 3) === */}
      <section className="py-20 bg-[#F4F4F4] dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#2A2A2A] dark:text-white mb-6">
            Funcionalidades
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Ferramentas inteligentes feitas para transformar sua rotina.
          </p>
        </div>

        {/* Grade será refinada no Passo 3 */}
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-[#2A2A2A] dark:text-white">
              Dietas Personalizadas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Geradas automaticamente com IA.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-[#2A2A2A] dark:text-white">
              Treinos adaptados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Criados de acordo com seu objetivo.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-[#2A2A2A] dark:text-white">
              Monitoramento diário
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Acompanhe sua evolução todos os dias.
            </p>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-[#2A2A2A] dark:bg-gray-950 text-white py-10 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-gray-300">
          © {new Date().getFullYear()} Emagrify — Todos os direitos reservados.
        </div>
      </footer>

           {/* === Contact Dialog === */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2A2A2A] dark:text-white">
              Entre em Contato
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Email: emagrify@gmail.com
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

     <style jsx global>{`
  /* GLOBAL SMOOTH SCROLL */
  html, body {
    scroll-behavior: smooth;
  }

  /* Animation fadeSlideUp */
  @keyframes fadeSlideUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeSlideUp {
    animation: fadeSlideUp 0.8s ease forwards;
  }

  .delay-200 {
    animation-delay: 0.2s;
  }

  /* Buttons premium */
  .btn-premium {
    transition: all 0.25s ease-in-out;
  }

  .btn-premium:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }

  /* Fade smooth */
  .fade-smooth {
    opacity: 0;
    transform: translateY(20px);
    animation: smoothFade 0.8s forwards;
  }

  @keyframes smoothFade {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Glow effect card */
  .card-premium::before {
    content: "";
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255,255,255,0.35), transparent);
    filter: blur(25px);
    z-index: -1;
  }

  /* Hover titles */
  h1, h2, h3 {
    transition: color 0.3s ease;
  }

  h1:hover, h2:hover, h3:hover {
    color: #6ECBF5;
  }

  a, button {
    transition: 0.25s ease-in-out;
  }
`}</style>
    </div>
  );
}

