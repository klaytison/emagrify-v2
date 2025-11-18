'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Flame, Trophy, Star, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

export default function ChallengesPage() {
  const [dailyChallenges, setDailyChallenges] = useState([
    { id: 1, title: 'Beber 2 litros de água', points: 10, completed: true },
    { id: 2, title: 'Caminhar 20 minutos', points: 15, completed: true },
    { id: 3, title: 'Comer 1 fruta', points: 10, completed: false },
    { id: 4, title: 'Não tomar refrigerante por 24h', points: 20, completed: false },
    { id: 5, title: '5 minutos de Vacuum', points: 15, completed: false },
  ]);

  const [weeklyChallenges, setWeeklyChallenges] = useState([
    { id: 1, title: 'Completar 3 treinos na semana', points: 50, progress: 2, total: 3 },
    { id: 2, title: 'Reduzir açúcar em 3 refeições', points: 40, progress: 1, total: 3 },
    { id: 3, title: 'Preparar 1 refeição saudável em casa', points: 45, progress: 0, total: 1 },
    { id: 4, title: 'Fazer 1 jejum de 12h', points: 35, progress: 0, total: 1 },
  ]);

  const [monthlyChallenges] = useState([
    { id: 1, title: 'Perder 1 kg', points: 200, progress: 0.6, total: 1 },
    { id: 2, title: 'Completar 20 treinos no mês', points: 150, progress: 12, total: 20 },
    { id: 3, title: 'Reduzir medidas (cintura/quadril)', points: 180, progress: 0, total: 1 },
    { id: 4, title: 'Cumprir plano alimentar por 30 dias', points: 250, progress: 18, total: 30 },
  ]);

  const totalPoints = 1250;
  const level = 8;
  const streakDays = 15;

  const toggleDailyChallenge = (id: number) => {
    setDailyChallenges(
      dailyChallenges.map((c) =>
        c.id === id ? { ...c, completed: !c.completed } : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <header className="bg-white border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2A2A2A]">Emagrify</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Voltar</Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-[#7BE4B7] text-white mb-4">
              Sistema de Desafios
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
              Seus Desafios
            </h1>
            <p className="text-lg text-gray-600">
              Complete desafios diários e ganhe recompensas
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-none shadow-lg bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Nível Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold mb-2">{level}</div>
                <Progress value={65} className="h-2 bg-white/30" />
                <p className="text-sm mt-2 opacity-90">350 XP para o próximo nível</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-[#FF7A00] to-[#7BE4B7] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  Pontos Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold mb-2">{totalPoints}</div>
                <p className="text-sm opacity-90">Você está no Top 10%</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-[#6ECBF5] to-[#FF7A00] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  Sequência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold mb-2">{streakDays}</div>
                <p className="text-sm opacity-90">dias consecutivos</p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Challenges */}
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#2A2A2A] flex items-center gap-2">
                    <Badge className="bg-[#7BE4B7] text-white">Diários</Badge>
                    Desafios de Hoje
                  </CardTitle>
                  <CardDescription>
                    Complete todos para ganhar bônus de 20 pontos extras
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#7BE4B7]">
                    {dailyChallenges.filter((c) => c.completed).length}/{dailyChallenges.length}
                  </div>
                  <div className="text-sm text-gray-600">Completos</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    challenge.completed
                      ? 'bg-[#7BE4B7]/10 border-[#7BE4B7]'
                      : 'bg-white border-gray-200 hover:border-[#7BE4B7]'
                  }`}
                  onClick={() => toggleDailyChallenge(challenge.id)}
                >
                  <div className="flex items-center gap-4">
                    {challenge.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-[#7BE4B7]" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                    <div>
                      <div className={`font-medium ${challenge.completed ? 'text-[#7BE4B7]' : 'text-[#2A2A2A]'}`}>
                        {challenge.title}
                      </div>
                      <div className="text-sm text-gray-600">+{challenge.points} pontos</div>
                    </div>
                  </div>
                  {challenge.completed && (
                    <Badge className="bg-[#7BE4B7] text-white">Completo!</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Challenges */}
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-[#2A2A2A] flex items-center gap-2">
                <Badge className="bg-[#FF7A00] text-white">Semanais</Badge>
                Desafios da Semana
              </CardTitle>
              <CardDescription>
                Evolução real com pequenas mudanças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weeklyChallenges.map((challenge) => (
                <div key={challenge.id} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-[#2A2A2A]">{challenge.title}</div>
                      <div className="text-sm text-gray-600">+{challenge.points} pontos</div>
                    </div>
                    <Badge className="bg-[#FF7A00] text-white">
                      {challenge.progress}/{challenge.total}
                    </Badge>
                  </div>
                  <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Challenges */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#2A2A2A] flex items-center gap-2">
                <Badge className="bg-[#6ECBF5] text-white">Mensais</Badge>
                Desafios do Mês
              </CardTitle>
              <CardDescription>
                Transformação real e resultados perceptíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {monthlyChallenges.map((challenge) => (
                <div key={challenge.id} className="p-4 bg-white rounded-lg border-2 border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-[#2A2A2A]">{challenge.title}</div>
                      <div className="text-sm text-gray-600">+{challenge.points} pontos</div>
                    </div>
                    <Badge className="bg-[#6ECBF5] text-white">
                      {typeof challenge.progress === 'number' && challenge.progress < 1
                        ? `${(challenge.progress * 100).toFixed(0)}%`
                        : `${challenge.progress}/${challenge.total}`}
                    </Badge>
                  </div>
                  <Progress
                    value={
                      typeof challenge.progress === 'number' && challenge.progress < 1
                        ? challenge.progress * 100
                        : (challenge.progress / challenge.total) * 100
                    }
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notification Info */}
          <Card className="border-none shadow-lg mt-8 bg-gradient-to-br from-[#7BE4B7]/10 to-[#6ECBF5]/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7BE4B7] flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2A2A2A] mb-2">
                    Notificações Ativadas
                  </h3>
                  <p className="text-gray-700">
                    Você receberá lembretes 2 vezes ao dia (9h e 18h) para completar seus desafios 
                    e manter sua sequência ativa. Mantenha-se motivado!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
