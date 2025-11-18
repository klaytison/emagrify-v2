'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const questions = [
  {
    id: 1,
    question: 'Qual é seu objetivo principal?',
    options: [
      { value: 'weight_loss', label: 'Perder peso' },
      { value: 'muscle_gain', label: 'Ganhar massa muscular' },
      { value: 'maintain', label: 'Manter peso atual' },
      { value: 'health', label: 'Melhorar saúde geral' },
    ],
  },
  {
    id: 2,
    question: 'Qual é seu nível de atividade física atual?',
    options: [
      { value: 'sedentary', label: 'Sedentário (pouco ou nenhum exercício)' },
      { value: 'light', label: 'Leve (1-3 dias por semana)' },
      { value: 'moderate', label: 'Moderado (3-5 dias por semana)' },
      { value: 'intense', label: 'Intenso (6-7 dias por semana)' },
    ],
  },
  {
    id: 3,
    question: 'Quantos quilos você deseja perder/ganhar?',
    options: [
      { value: '5', label: 'Até 5 kg' },
      { value: '10', label: '5-10 kg' },
      { value: '15', label: '10-15 kg' },
      { value: '20', label: 'Mais de 15 kg' },
    ],
  },
  {
    id: 4,
    question: 'Você tem alguma restrição alimentar?',
    options: [
      { value: 'none', label: 'Nenhuma' },
      { value: 'vegetarian', label: 'Vegetariano' },
      { value: 'vegan', label: 'Vegano' },
      { value: 'lactose', label: 'Intolerância à lactose' },
      { value: 'gluten', label: 'Intolerância ao glúten' },
    ],
  },
  {
    id: 5,
    question: 'Quanto tempo você pode dedicar aos exercícios por dia?',
    options: [
      { value: '15', label: '15 minutos' },
      { value: '30', label: '30 minutos' },
      { value: '45', label: '45 minutos' },
      { value: '60', label: '1 hora ou mais' },
    ],
  },
  {
    id: 6,
    question: 'Qual seu maior desafio para emagrecer?',
    options: [
      { value: 'anxiety', label: 'Ansiedade e compulsão alimentar' },
      { value: 'time', label: 'Falta de tempo' },
      { value: 'motivation', label: 'Falta de motivação' },
      { value: 'knowledge', label: 'Não sei o que comer' },
    ],
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <header className="bg-white border-b border-gray-200">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#2A2A2A]">Emagrify</span>
            </Link>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-[#7BE4B7]" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
                Seu Plano Personalizado Está Pronto!
              </h1>
              <p className="text-lg text-gray-600">
                Baseado nas suas respostas, criamos um plano completo para você
              </p>
            </div>

            <Card className="border-none shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">Plano Alimentar Personalizado</CardTitle>
                <CardDescription>
                  Dieta elaborada especialmente para seus objetivos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Café da Manhã */}
                <div>
                  <h3 className="text-xl font-bold text-[#2A2A2A] mb-4 flex items-center gap-2">
                    <Badge className="bg-[#7BE4B7] text-white">Café da Manhã</Badge>
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-[#2A2A2A]">Omelete de Claras com Aveia</div>
                      <div className="text-sm text-gray-600 mt-1">
                        3 claras de ovo + 30g aveia + 1 banana + café sem açúcar
                      </div>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-[#7BE4B7] font-medium">320 kcal</span>
                        <span className="text-gray-600">25g proteína</span>
                        <span className="text-gray-600">35g carbs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Almoço */}
                <div>
                  <h3 className="text-xl font-bold text-[#2A2A2A] mb-4 flex items-center gap-2">
                    <Badge className="bg-[#FF7A00] text-white">Almoço</Badge>
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-[#2A2A2A]">Frango Grelhado com Batata Doce</div>
                      <div className="text-sm text-gray-600 mt-1">
                        150g frango + 150g batata doce + salada verde + azeite
                      </div>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-[#FF7A00] font-medium">450 kcal</span>
                        <span className="text-gray-600">40g proteína</span>
                        <span className="text-gray-600">45g carbs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jantar */}
                <div>
                  <h3 className="text-xl font-bold text-[#2A2A2A] mb-4 flex items-center gap-2">
                    <Badge className="bg-[#6ECBF5] text-white">Jantar</Badge>
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium text-[#2A2A2A]">Salmão com Legumes</div>
                      <div className="text-sm text-gray-600 mt-1">
                        120g salmão + brócolis + cenoura + abobrinha
                      </div>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-[#6ECBF5] font-medium">380 kcal</span>
                        <span className="text-gray-600">35g proteína</span>
                        <span className="text-gray-600">20g carbs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#7BE4B7]/10 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Base Científica:</strong> Este plano foi elaborado seguindo as diretrizes 
                    da American Journal of Clinical Nutrition e recomendações da OMS para perda de peso 
                    saudável (déficit calórico de 500kcal/dia para perda de 0,5kg por semana).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="text-[#2A2A2A]">Plano de Exercícios</CardTitle>
                <CardDescription>
                  Treinos adaptados ao seu nível e disponibilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    day: 'Segunda-feira',
                    workout: 'Treino de Força - Membros Superiores',
                    duration: '45 min',
                    exercises: ['Flexões: 3x12', 'Rosca direta: 3x15', 'Tríceps: 3x12'],
                  },
                  {
                    day: 'Quarta-feira',
                    workout: 'Cardio + Core',
                    duration: '40 min',
                    exercises: ['Corrida: 20 min', 'Prancha: 3x30s', 'Abdominais: 3x20'],
                  },
                  {
                    day: 'Sexta-feira',
                    workout: 'Treino de Força - Membros Inferiores',
                    duration: '45 min',
                    exercises: ['Agachamento: 3x15', 'Afundo: 3x12', 'Panturrilha: 3x20'],
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-[#2A2A2A]">{item.day}</div>
                        <div className="text-sm text-gray-600">{item.workout}</div>
                      </div>
                      <Badge className="bg-[#FF7A00] text-white">{item.duration}</Badge>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mt-2">
                      {item.exercises.map((ex, i) => (
                        <li key={i}>• {ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="bg-[#6ECBF5]/10 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Base Científica:</strong> Programa baseado nas diretrizes do American College 
                    of Sports Medicine (ACSM) para exercícios aeróbicos e de resistência para perda de peso.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white text-lg px-12"
                asChild
              >
                <Link href="/">
                  Começar Meu Plano
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2A2A2A]">Emagrify</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Voltar</Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <Badge className="bg-[#7BE4B7] text-white">
                Pergunta {currentQuestion + 1} de {questions.length}
              </Badge>
              <span className="text-sm text-gray-600">{Math.round(progress)}% completo</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-[#2A2A2A]">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={answers[questions[currentQuestion].id]}
                onValueChange={handleAnswer}
              >
                {questions[currentQuestion].options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-[#7BE4B7] transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Anterior
                </Button>
                <Button
                  onClick={nextQuestion}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="flex-1 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white"
                >
                  {currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
