'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AssinaturaNecessariaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7BE4B7]/10 via-white to-[#6ECBF5]/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-none shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-[#2A2A2A] mb-2">
            Conteúdo Premium
          </CardTitle>
          <CardDescription className="text-lg">
            Assine agora para acessar todas as funcionalidades exclusivas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-br from-[#7BE4B7]/10 to-[#6ECBF5]/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#7BE4B7] flex-shrink-0" />
              <span className="text-[#2A2A2A]">Dietas personalizadas com IA</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#7BE4B7] flex-shrink-0" />
              <span className="text-[#2A2A2A]">Treinos adaptados ao seu nível</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#7BE4B7] flex-shrink-0" />
              <span className="text-[#2A2A2A]">Sistema de desafios gamificado</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#7BE4B7] flex-shrink-0" />
              <span className="text-[#2A2A2A]">Acompanhamento de progresso completo</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#7BE4B7] flex-shrink-0" />
              <span className="text-[#2A2A2A]">Calculadoras e ferramentas exclusivas</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#7BE4B7] flex-shrink-0" />
              <span className="text-[#2A2A2A]">Suporte científico e nutricional</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-[#7BE4B7] text-center">
            <Badge className="bg-[#FF7A00] text-white mb-3">
              🔥 Promoção Especial
            </Badge>
            <div className="text-5xl font-bold text-[#2A2A2A] mb-2">R$ 95</div>
            <div className="text-lg mb-2">
              <span className="line-through text-gray-500">R$ 125</span>
              <Badge className="ml-2 bg-[#7BE4B7] text-white">24% OFF</Badge>
            </div>
            <div className="text-gray-600 mb-4">por 30 dias</div>
            
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90 text-lg"
              asChild
            >
              <Link href="/checkout">
                <Sparkles className="mr-2 w-5 h-5" />
                Assinar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <p className="mt-4 text-sm text-gray-600">
              Cancele quando quiser • Acesso imediato • Suporte 24/7
            </p>
          </div>

          <div className="text-center">
            <Link href="/" className="text-[#7BE4B7] hover:underline text-sm">
              Voltar para página inicial
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
