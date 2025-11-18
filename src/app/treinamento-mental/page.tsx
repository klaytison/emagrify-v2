'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  Target, 
  Wind, 
  Clock, 
  Star,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Moon,
  Sun,
  Timer,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX
} from 'lucide-react';
import Link from 'next/link';

interface Exercise {
  id: number;
  title: string;
  duration: string;
  icon: any;
  color: string;
  description: string;
  steps: string[];
  benefits: string[];
  completed: boolean;
}

export default function TreinamentoMental() {
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const exercises: Exercise[] = [
    {
      id: 1,
      title: 'Acorde com Intenção',
      duration: '2 min',
      icon: Sun,
      color: 'from-[#FF7A00] to-[#FFB347]',
      description: 'Comece o dia com propósito e foco absoluto',
      steps: [
        'Ao acordar, antes de pegar o celular, respire fundo 3 vezes',
        'Repita mentalmente: "Hoje eu avanço. Mesmo que pouco, eu avanço."',
        'Visualize uma ação específica que você fará hoje para cuidar de si',
        'Sinta gratidão por mais um dia de oportunidades'
      ],
      benefits: [
        'Reduz impulsos alimentares',
        'Melhora autocontrole',
        'Aumenta motivação diária',
        'Treina o cérebro para começar com propósito'
      ],
      completed: false
    },
    {
      id: 2,
      title: 'Visualização Matinal',
      duration: '3 min',
      icon: Target,
      color: 'from-[#7BE4B7] to-[#6ECBF5]',
      description: 'Programe seu cérebro para o sucesso',
      steps: [
        'Sente-se confortavelmente com a coluna reta',
        'Feche os olhos e respire profundamente',
        'Visualize você com o corpo que deseja',
        'Imagine-se vestindo roupas que quer usar',
        'Sinta-se leve, saudável e confiante',
        'Veja pessoas te elogiando',
        'Sorria porque você conseguiu'
      ],
      benefits: [
        'Cérebro não diferencia imaginação de realidade',
        'Aumenta motivação e disciplina',
        'Fortalece conexões neurais positivas',
        'Cria expectativa de sucesso'
      ],
      completed: false
    },
    {
      id: 3,
      title: 'Âncora de Foco',
      duration: '30 seg',
      icon: Zap,
      color: 'from-[#6ECBF5] to-[#4A90E2]',
      description: 'Seu mantra pessoal de poder',
      steps: [
        'Escolha uma frase poderosa (sugestões abaixo)',
        'Respire fundo e repita mentalmente 3 vezes',
        'Sinta a força das palavras',
        'Use especialmente em momentos de tentação'
      ],
      benefits: [
        'Ativa força de vontade instantânea',
        'Quebra padrões de pensamento negativo',
        'Reforça identidade de pessoa disciplinada',
        'Funciona como "botão de reset" mental'
      ],
      completed: false
    },
    {
      id: 4,
      title: 'Respiração Antiansiedade',
      duration: '1 min',
      icon: Wind,
      color: 'from-[#7BE4B7] to-[#5DD39E]',
      description: 'Controle compulsão alimentar em 60 segundos',
      steps: [
        'Inspire pelo nariz contando até 4',
        'Segure o ar por 1 segundo',
        'Expire pela boca contando até 6',
        'Repita 5 vezes',
        'Sinta a ansiedade diminuindo'
      ],
      benefits: [
        'Reduz compulsão alimentar',
        'Ativa sistema nervoso parassimpático',
        'Tira você do piloto automático',
        'Funciona em qualquer lugar'
      ],
      completed: false
    },
    {
      id: 5,
      title: 'Ritual dos 10 Segundos',
      duration: '10 seg',
      icon: Timer,
      color: 'from-[#FF7A00] to-[#E65100]',
      description: 'Pare antes de comer impulsivamente',
      steps: [
        'Antes de comer algo não planejado, PARE',
        'Conte 10 segundos respirando',
        'Pergunte: "Eu realmente quero isso ou é só ansiedade?"',
        'Decida conscientemente'
      ],
      benefits: [
        'Ativa parte racional do cérebro',
        'Quebra automatismo',
        'Aumenta consciência alimentar',
        'Funciona de verdade (comprovado)'
      ],
      completed: false
    },
    {
      id: 6,
      title: 'Autoelogio Estratégico',
      duration: '30 seg',
      icon: Star,
      color: 'from-[#FFB347] to-[#FF7A00]',
      description: 'Reforce sua autoconfiança diariamente',
      steps: [
        'No fim do dia, diga em voz baixa:',
        '"Hoje eu fui melhor do que ontem"',
        '"Eu fiz algo que me levou mais perto do meu objetivo"',
        '"Eu sou capaz"',
        'Sinta orgulho genuíno'
      ],
      benefits: [
        'Cérebro precisa ouvir isso',
        'Mantém consistência',
        'Aumenta autoestima',
        'Cria ciclo de feedback positivo'
      ],
      completed: false
    },
    {
      id: 7,
      title: 'Revisão Noturna',
      duration: '1 min',
      icon: Moon,
      color: 'from-[#4A90E2] to-[#2E5C8A]',
      description: 'Programe seu subconsciente para o sucesso',
      steps: [
        'Antes de dormir, feche os olhos',
        'Respire profundamente 3 vezes',
        'Repita mentalmente: "Eu estou no caminho certo"',
        '"Não importa a velocidade, eu vou chegar"',
        'Durma com essa certeza'
      ],
      benefits: [
        'Reforça foco subconsciente',
        'Mantém você firme no dia seguinte',
        'Melhora qualidade do sono',
        'Consolida aprendizados do dia'
      ],
      completed: false
    },
    {
      id: 8,
      title: 'Quebra de Pensamentos Negativos',
      duration: 'Sempre',
      icon: TrendingUp,
      color: 'from-[#7BE4B7] to-[#4CAF50]',
      description: 'Reprograme sua mente para resiliência',
      steps: [
        'Quando surgir "Não consigo", substitua por:',
        '"É difícil, mas eu estou fazendo"',
        'Quando surgir "É muito difícil", diga:',
        '"Cada dia fica mais fácil"',
        'Quando surgir "Eu vou desistir", afirme:',
        '"Eu já cheguei até aqui, vou continuar"'
      ],
      benefits: [
        'Reprograma padrões mentais',
        'Aumenta resiliência',
        'Transforma obstáculos em desafios',
        'Fortalece mentalidade de crescimento'
      ],
      completed: false
    },
    {
      id: 9,
      title: 'Micro-Metas Diárias',
      duration: 'Todo dia',
      icon: CheckCircle2,
      color: 'from-[#6ECBF5] to-[#7BE4B7]',
      description: 'Vitórias pequenas viram consistência',
      steps: [
        'Todo dia escolha APENAS 1 meta simples:',
        '• Beber 2L de água',
        '• Caminhar 10 minutos',
        '• Comer uma refeição melhor',
        '• Dormir 30min mais cedo',
        'Comemore quando completar!'
      ],
      benefits: [
        'Mente adora vitórias pequenas',
        'Cria momentum',
        'Evita sobrecarga',
        'Gera consistência natural'
      ],
      completed: false
    },
    {
      id: 10,
      title: 'Lembrete Poderoso',
      duration: 'Quando desanimar',
      icon: Award,
      color: 'from-[#FF7A00] to-[#FFD700]',
      description: 'Use quando sentir vontade de desistir',
      steps: [
        'Quando bater desânimo, repita:',
        '"Se eu parar agora, vou ter que recomeçar"',
        '"Se eu continuar, vou comemorar"',
        'Lembre-se: você já começou',
        'Cada dia é um passo mais perto'
      ],
      benefits: [
        'Reativa motivação instantaneamente',
        'Coloca perspectiva',
        'Lembra do custo de desistir',
        'Reforça compromisso consigo mesmo'
      ],
      completed: false
    }
  ];

  const toggleExerciseComplete = (id: number) => {
    if (completedExercises.includes(id)) {
      setCompletedExercises(completedExercises.filter(ex => ex !== id));
    } else {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const progressPercentage = (completedExercises.length / exercises.length) * 100;

  const mantras = [
    "Eu controlo meu corpo",
    "Meu foco é maior que minha fome emocional",
    "Eu mereço essa vitória",
    "Eu escolho cuidar de mim",
    "Cada dia eu fico mais forte",
    "Eu sou capaz de transformação"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#7BE4B7]" />
              <h1 className="text-xl font-bold text-[#2A2A2A]">Treinamento Mental</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white mb-4">
            🧠 Foco Absoluto no Emagrecimento
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
            Transforme sua <span className="text-[#7BE4B7]">mente</span>, transforme seu corpo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            10 exercícios mentais comprovados para criar disciplina emocional, 
            controlar impulsos e manter foco contínuo na sua jornada
          </p>

          {/* Progress Card */}
          <Card className="max-w-md mx-auto border-none shadow-lg bg-white">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg">Seu Progresso Hoje</CardTitle>
                <Badge className="bg-[#7BE4B7] text-white">
                  {completedExercises.length}/{exercises.length}
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <CardDescription className="mt-2">
                {completedExercises.length === exercises.length 
                  ? '🎉 Parabéns! Você completou todos os exercícios hoje!'
                  : `Continue! Faltam ${exercises.length - completedExercises.length} exercícios`
                }
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-lg bg-gradient-to-br from-[#7BE4B7]/10 to-white">
            <CardHeader>
              <Heart className="w-10 h-10 text-[#7BE4B7] mb-3" />
              <CardTitle className="text-[#2A2A2A]">Disciplina Emocional</CardTitle>
              <CardDescription>
                Controle sobre impulsos e fome emocional através de técnicas comprovadas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-[#6ECBF5]/10 to-white">
            <CardHeader>
              <Target className="w-10 h-10 text-[#6ECBF5] mb-3" />
              <CardTitle className="text-[#2A2A2A]">Foco Contínuo</CardTitle>
              <CardDescription>
                Mantenha-se motivado e consistente sem depender de ninguém
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-[#FF7A00]/10 to-white">
            <CardHeader>
              <Sparkles className="w-10 h-10 text-[#FF7A00] mb-3" />
              <CardTitle className="text-[#2A2A2A]">Menos Recaídas</CardTitle>
              <CardDescription>
                Resistência ao desânimo e maior consistência nos seus hábitos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Mantras Section */}
        <Card className="mb-12 border-none shadow-lg bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] text-white">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8" />
              <CardTitle className="text-2xl">Mantras Poderosos</CardTitle>
            </div>
            <CardDescription className="text-white/90 text-base">
              Escolha um mantra e repita 3 vezes quando sentir tentação ou desânimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {mantras.map((mantra, idx) => (
                <div 
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <p className="font-medium text-center">"{mantra}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercises Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-[#2A2A2A] mb-6">
            Exercícios Diários
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => {
              const Icon = exercise.icon;
              const isCompleted = completedExercises.includes(exercise.id);
              
              return (
                <Card 
                  key={exercise.id}
                  className={`border-none shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                    isCompleted ? 'ring-2 ring-[#7BE4B7]' : ''
                  }`}
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exercise.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Button
                        size="sm"
                        variant={isCompleted ? "default" : "outline"}
                        className={isCompleted ? "bg-[#7BE4B7] hover:bg-[#6BD3A6]" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExerciseComplete(exercise.id);
                        }}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Feito
                          </>
                        ) : (
                          'Marcar'
                        )}
                      </Button>
                    </div>
                    
                    <CardTitle className="text-[#2A2A2A] mb-2">{exercise.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {exercise.duration}
                      </Badge>
                    </div>
                    <CardDescription>{exercise.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] text-white">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-10 h-10 text-[#FFD700]" />
              <CardTitle className="text-3xl">Resultados Esperados</CardTitle>
            </div>
            <CardDescription className="text-white/80 text-lg mb-6">
              Ao praticar esses exercícios diariamente, você desenvolverá:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Disciplina emocional sólida',
                'Controle total sobre impulsos alimentares',
                'Foco contínuo nos seus objetivos',
                'Motivação interna real (não depende de ninguém)',
                'Resistência ao desânimo e frustração',
                'Mais consistência nos hábitos saudáveis',
                'Menos recaídas e autossabotagem',
                'Autoconfiança e autoestima elevadas'
              ].map((result, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-4">
                  <CheckCircle2 className="w-5 h-5 text-[#7BE4B7] flex-shrink-0" />
                  <span className="text-white/90">{result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <Card 
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedExercise.color} flex items-center justify-center`}>
                  <selectedExercise.icon className="w-8 h-8 text-white" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedExercise(null)}
                >
                  ✕
                </Button>
              </div>
              
              <CardTitle className="text-2xl text-[#2A2A2A] mb-2">
                {selectedExercise.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedExercise.duration}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {selectedExercise.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Steps */}
              <div>
                <h4 className="font-bold text-[#2A2A2A] mb-3 flex items-center gap-2">
                  <Play className="w-5 h-5 text-[#7BE4B7]" />
                  Como Fazer
                </h4>
                <div className="space-y-2">
                  {selectedExercise.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7BE4B7] text-white flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-bold text-[#2A2A2A] mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF7A00]" />
                  Benefícios
                </h4>
                <div className="grid gap-2">
                  {selectedExercise.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-[#7BE4B7]/10 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-[#7BE4B7] flex-shrink-0" />
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90"
                size="lg"
                onClick={() => {
                  toggleExerciseComplete(selectedExercise.id);
                  setSelectedExercise(null);
                }}
              >
                {completedExercises.includes(selectedExercise.id) ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Marcar como Não Feito
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Marcar como Concluído
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
