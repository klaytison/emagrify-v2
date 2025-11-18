'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // converter cm para m
    
    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h);
      setBmi(parseFloat(bmiValue.toFixed(1)));
      
      // Determinar categoria
      if (bmiValue < 18.5) {
        setCategory('Abaixo do peso');
        setColor('#6ECBF5');
      } else if (bmiValue < 25) {
        setCategory('Peso normal');
        setColor('#7BE4B7');
      } else if (bmiValue < 30) {
        setCategory('Sobrepeso');
        setColor('#FF7A00');
      } else if (bmiValue < 35) {
        setCategory('Obesidade Grau I');
        setColor('#FF5722');
      } else if (bmiValue < 40) {
        setCategory('Obesidade Grau II');
        setColor('#E91E63');
      } else {
        setCategory('Obesidade Grau III');
        setColor('#9C27B0');
      }
    }
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
              Calculadora de Saúde
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
              Calculadora de IMC
            </h1>
            <p className="text-lg text-gray-600">
              Descubra seu Índice de Massa Corporal e entenda sua faixa de peso
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">Seus Dados</CardTitle>
                <CardDescription>
                  Insira suas informações para calcular o IMC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ex: 70"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 170"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white text-lg py-6"
                  onClick={calculateBMI}
                  disabled={!weight || !height}
                >
                  <Calculator className="mr-2 w-5 h-5" />
                  Calcular IMC
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">Seu Resultado</CardTitle>
                <CardDescription>
                  Interpretação do seu IMC
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bmi !== null ? (
                  <div className="space-y-6">
                    <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: `${color}20` }}>
                      <div className="text-6xl font-bold mb-2" style={{ color }}>
                        {bmi}
                      </div>
                      <div className="text-2xl font-semibold text-[#2A2A2A]">
                        {category}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#2A2A2A]">
                        Faixas de IMC:
                      </h4>
                      <div className="space-y-2">
                        {[
                          { range: 'Abaixo de 18,5', label: 'Abaixo do peso', color: '#6ECBF5' },
                          { range: '18,5 - 24,9', label: 'Peso normal', color: '#7BE4B7' },
                          { range: '25,0 - 29,9', label: 'Sobrepeso', color: '#FF7A00' },
                          { range: '30,0 - 34,9', label: 'Obesidade Grau I', color: '#FF5722' },
                          { range: '35,0 - 39,9', label: 'Obesidade Grau II', color: '#E91E63' },
                          { range: 'Acima de 40', label: 'Obesidade Grau III', color: '#9C27B0' },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 rounded-lg"
                            style={{ backgroundColor: `${item.color}15` }}
                          >
                            <div>
                              <div className="font-medium text-[#2A2A2A]">
                                {item.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                IMC: {item.range}
                              </div>
                            </div>
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#7BE4B7]/10 rounded-xl p-4">
                      <p className="text-sm text-gray-700">
                        <strong>Importante:</strong> O IMC é apenas um indicador inicial. 
                        Consulte um profissional de saúde para uma avaliação completa.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <TrendingDown className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Preencha os campos para calcular seu IMC</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="border-none shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="text-[#2A2A2A]">O que é IMC?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                O Índice de Massa Corporal (IMC) é uma medida internacional usada para calcular 
                se uma pessoa está no peso ideal. Ele é calculado dividindo o peso (em kg) pela 
                altura ao quadrado (em metros).
              </p>
              <p className="text-gray-700">
                Desenvolvido pelo matemático Lambert Quételet no século XIX, o IMC é amplamente 
                utilizado pela Organização Mundial da Saúde (OMS) como referência para classificação 
                de peso.
              </p>
              <div className="bg-[#6ECBF5]/10 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Fonte:</strong> Organização Mundial da Saúde (OMS) - 
                  Diretrizes para avaliação nutricional de adultos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
