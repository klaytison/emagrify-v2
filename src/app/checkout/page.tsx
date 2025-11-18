'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, CreditCard, QrCode, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [step, setStep] = useState<'payment' | 'success'>('payment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4">
        <Card className="border-none shadow-2xl max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-[#7BE4B7] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#2A2A2A] mb-4">
              Pagamento Confirmado!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sua assinatura foi ativada com sucesso. Bem-vindo ao Emagrify!
            </p>
            
            <div className="bg-[#7BE4B7]/10 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-600">Plano</div>
                  <div className="font-bold text-[#2A2A2A]">Mensal Premium</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Valor</div>
                  <div className="font-bold text-[#2A2A2A]">R$ 95,00</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Próxima cobrança</div>
                  <div className="font-bold text-[#2A2A2A]">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <Badge className="bg-[#7BE4B7] text-white">Ativo</Badge>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white text-lg px-12"
              asChild
            >
              <Link href="/">Começar Agora</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2A2A2A]">Emagrify</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Voltar
            </Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-[#FF7A00] text-white mb-4">
              🔥 Oferta Especial
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
              Finalize sua Assinatura
            </h1>
            <p className="text-lg text-gray-600">
              Acesso completo a todas as funcionalidades por apenas R$ 95/mês
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="md:col-span-1">
              <Card className="border-none shadow-lg sticky top-4">
                <CardHeader>
                  <CardTitle className="text-[#2A2A2A]">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plano Mensal</span>
                      <span className="font-medium text-[#2A2A2A]">R$ 125,00</span>
                    </div>
                    <div className="flex justify-between text-[#7BE4B7]">
                      <span>Desconto Promocional</span>
                      <span className="font-medium">-R$ 30,00</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-[#2A2A2A]">Total</span>
                    <span className="font-bold text-[#7BE4B7]">R$ 95,00</span>
                  </div>

                  <div className="bg-[#7BE4B7]/10 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
                      <span className="text-gray-700">Acesso imediato</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
                      <span className="text-gray-700">Cancele quando quiser</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
                      <span className="text-gray-700">Suporte 24/7</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#7BE4B7]" />
                      <span className="text-gray-700">Todas as funcionalidades</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Renovação automática a cada 30 dias
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="md:col-span-2">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#2A2A2A]">Método de Pagamento</CardTitle>
                  <CardDescription>
                    Escolha como deseja pagar sua assinatura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          paymentMethod === 'credit_card'
                            ? 'border-[#7BE4B7] bg-[#7BE4B7]/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                          <CreditCard className="w-5 h-5 text-[#7BE4B7]" />
                          <span className="font-medium">Cartão de Crédito</span>
                        </Label>
                      </div>

                      <div
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          paymentMethod === 'pix'
                            ? 'border-[#7BE4B7] bg-[#7BE4B7]/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                          <QrCode className="w-5 h-5 text-[#6ECBF5]" />
                          <span className="font-medium">PIX</span>
                          <Badge className="bg-[#7BE4B7] text-white ml-auto">Aprovação Instantânea</Badge>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'credit_card' && (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="card_number">Número do Cartão</Label>
                          <Input
                            id="card_number"
                            placeholder="0000 0000 0000 0000"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="card_name">Nome no Cartão</Label>
                          <Input
                            id="card_name"
                            placeholder="Como está escrito no cartão"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Validade</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/AA"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'pix' && (
                      <div className="space-y-4 pt-4">
                        <div className="bg-[#6ECBF5]/10 rounded-xl p-6 text-center">
                          <QrCode className="w-32 h-32 mx-auto mb-4 text-[#6ECBF5]" />
                          <p className="text-sm text-gray-700 mb-4">
                            Após confirmar, você receberá o QR Code para pagamento via PIX
                          </p>
                          <Badge className="bg-[#6ECBF5] text-white">
                            Aprovação em até 2 minutos
                          </Badge>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                      <Lock className="w-5 h-5 text-[#7BE4B7] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        Seus dados estão seguros. Utilizamos criptografia de ponta e não 
                        armazenamos informações do cartão.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white text-lg py-6"
                    >
                      Confirmar Pagamento - R$ 95,00
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      Ao confirmar, você concorda com nossos Termos de Uso e Política de Privacidade
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
