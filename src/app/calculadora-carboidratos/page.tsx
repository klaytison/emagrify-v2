'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Camera, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CarbCalculatorPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    // Simulação de análise com IA
    setTimeout(() => {
      setResult({
        food: 'Prato Misto',
        calories: 520,
        carbs: 65,
        protein: 28,
        fats: 18,
        fiber: 8,
        items: [
          { name: 'Arroz integral', amount: '150g', carbs: 45 },
          { name: 'Frango grelhado', amount: '120g', carbs: 0 },
          { name: 'Brócolis', amount: '80g', carbs: 6 },
          { name: 'Feijão', amount: '100g', carbs: 14 },
        ]
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2A2A2A]">Emagrify</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Voltar</Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-[#7BE4B7] text-white mb-4">
              Calculadora Inteligente
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
              Calculadora de Carboidratos
            </h1>
            <p className="text-lg text-gray-600">
              Tire uma foto do seu prato e descubra os nutrientes instantaneamente
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">Enviar Foto</CardTitle>
                <CardDescription>
                  Tire uma foto ou faça upload de uma imagem do seu prato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-[#7BE4B7] rounded-xl p-8 text-center hover:bg-[#7BE4B7]/5 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-16 h-16 mx-auto text-[#7BE4B7]" />
                        <div>
                          <p className="text-lg font-medium text-[#2A2A2A]">
                            Clique para fazer upload
                          </p>
                          <p className="text-sm text-gray-500">
                            ou arraste uma imagem aqui
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white"
                  onClick={analyzeImage}
                  disabled={!imagePreview || analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 w-5 h-5" />
                      Analisar Prato
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">Resultado da Análise</CardTitle>
                <CardDescription>
                  Informações nutricionais detectadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#2A2A2A] mb-4">
                        {result.food}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#7BE4B7]/10 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-[#7BE4B7]">
                            {result.calories}
                          </div>
                          <div className="text-sm text-gray-600">Calorias</div>
                        </div>
                        <div className="bg-[#FF7A00]/10 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-[#FF7A00]">
                            {result.carbs}g
                          </div>
                          <div className="text-sm text-gray-600">Carboidratos</div>
                        </div>
                        <div className="bg-[#6ECBF5]/10 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-[#6ECBF5]">
                            {result.protein}g
                          </div>
                          <div className="text-sm text-gray-600">Proteínas</div>
                        </div>
                        <div className="bg-[#7BE4B7]/10 rounded-xl p-4 text-center">
                          <div className="text-3xl font-bold text-[#7BE4B7]">
                            {result.fats}g
                          </div>
                          <div className="text-sm text-gray-600">Gorduras</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-[#2A2A2A]">
                          Alimentos Detectados:
                        </h4>
                        {result.items.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-[#2A2A2A]">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.amount}
                              </div>
                            </div>
                            <Badge className="bg-[#FF7A00] text-white">
                              {item.carbs}g carbs
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Faça upload de uma imagem para ver os resultados</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Manual Calculator */}
          <Card className="border-none shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="text-[#2A2A2A]">Calculadora Manual</CardTitle>
              <CardDescription>
                Ou insira os alimentos manualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="food">Alimento</Label>
                  <Input id="food" placeholder="Ex: Arroz integral" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Quantidade (g)</Label>
                  <Input id="amount" type="number" placeholder="150" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-[#7BE4B7] text-white">
                    Adicionar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
