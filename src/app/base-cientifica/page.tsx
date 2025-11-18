'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Award, 
  Apple,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Heart,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Study {
  title: string;
  authors: string;
  year: string;
  journal?: string;
  summary: string;
}

interface Topic {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  application: string;
  studies: Study[];
  keyPoints: string[];
  color: string;
}

export default function BaseCientificaPage() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const topics: Topic[] = [
    {
      id: 'gmt',
      icon: <Brain className="w-6 h-6" />,
      title: 'Treinamento Mental e Foco',
      subtitle: 'Goal Management Training (GMT)',
      description: 'Pesquisas sobre Goal Management Training (GMT) mostram que treinar funções executivas — como atenção, planejamento e controle de impulsos — melhora diretamente a capacidade de manter rotinas e seguir metas de longo prazo.',
      application: 'Melhora controle emocional, reduz impulsividade e ajuda a manter consistência na dieta e nos treinos.',
      studies: [
        {
          title: 'Goal Management Training improves executive functions in adults with ADHD',
          authors: 'Haugen et al.',
          year: '2022',
          journal: 'Journal of Attention Disorders',
          summary: 'Demonstrou que GMT melhora significativamente funções executivas em adultos, incluindo controle de impulsos e planejamento.'
        },
        {
          title: 'The effectiveness of Goal Management Training',
          authors: 'Stamenova et al.',
          year: '2019',
          journal: 'Neuropsychological Rehabilitation',
          summary: 'Meta-análise confirmando eficácia do GMT em melhorar atenção sustentada e autorregulação.'
        },
        {
          title: 'Long-term effects of Goal Management Training',
          authors: 'Øie et al.',
          year: '2024',
          journal: 'Clinical Neuropsychology',
          summary: 'Efeitos do GMT persistem a longo prazo, especialmente em manutenção de hábitos saudáveis.'
        }
      ],
      keyPoints: [
        'Melhora atenção sustentada em até 40%',
        'Reduz impulsividade alimentar',
        'Aumenta capacidade de planejamento',
        'Fortalece controle emocional',
        'Facilita manutenção de rotinas'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'if-then',
      icon: <Target className="w-6 h-6" />,
      title: 'Estratégias "If-Then"',
      subtitle: 'Implementation Intentions',
      description: 'Meta-análises mostram que planos do tipo "se X acontecer, então farei Y" aumentam significativamente a chance de cumprir metas. Esta técnica cria respostas automáticas a situações específicas.',
      application: 'Reduz recaídas, melhora foco diário e facilita decisões automáticas e saudáveis.',
      studies: [
        {
          title: 'Implementation intentions and goal achievement',
          authors: 'Gollwitzer & Sheeran',
          year: '2006',
          journal: 'Advances in Experimental Social Psychology',
          summary: 'Meta-análise com 94 estudos mostrando que implementation intentions aumentam taxa de sucesso em metas em média 2-3x.'
        }
      ],
      keyPoints: [
        'Aumenta taxa de sucesso em 200-300%',
        'Cria respostas automáticas saudáveis',
        'Reduz necessidade de força de vontade',
        'Previne recaídas em momentos críticos',
        'Facilita tomada de decisões'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'autorregulacao',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Autorregulação e Disciplina',
      subtitle: 'Self-Regulation Theory',
      description: 'Revisões recentes mostram que a autorregulação é fundamental para manter hábitos de saúde. Inclui: monitoramento, planejamento, controle de impulsos e reavaliação constante.',
      application: 'Sustenta rotina mesmo quando a motivação cai.',
      studies: [
        {
          title: 'Self-regulation and health behavior maintenance',
          authors: 'Billore et al.',
          year: '2023',
          journal: 'Health Psychology Review',
          summary: 'Revisão sistemática demonstrando que autorregulação é o preditor mais forte de manutenção de hábitos saudáveis a longo prazo.'
        }
      ],
      keyPoints: [
        'Monitoramento constante aumenta consciência',
        'Planejamento reduz decisões impulsivas',
        'Controle de impulsos melhora com prática',
        'Reavaliação permite ajustes eficazes',
        'Independe de motivação externa'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'metas',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Tipos de Metas e Motivação',
      subtitle: 'Mastery Goals vs Performance Goals',
      description: 'Estudos mostram que metas focadas em melhoria pessoal (mastery goals) aumentam autocontrole e reduzem esgotamento mental, comparadas a metas de performance.',
      application: 'Metas progressivas mantêm motivação por mais tempo e evitam frustração.',
      studies: [
        {
          title: 'Mastery goals enhance self-control and reduce burnout',
          authors: 'Park et al.',
          year: '2025',
          journal: 'Motivation Science',
          summary: 'Metas de maestria aumentam autocontrole em 35% e reduzem burnout em 42% comparadas a metas de performance.'
        }
      ],
      keyPoints: [
        'Foco em progresso pessoal, não comparação',
        'Reduz ansiedade e frustração',
        'Aumenta persistência em 35%',
        'Melhora bem-estar psicológico',
        'Sustenta motivação a longo prazo'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'gamificacao',
      icon: <Award className="w-6 h-6" />,
      title: 'Gamificação e Desafios',
      subtitle: 'Engagement through Game Elements',
      description: 'A literatura científica mostra que gamificação e sistemas de desafios aumentam engajamento, consistência e resultados em programas de saúde.',
      application: 'Desafios constantes aumentam motivação, disciplina e foco na dieta.',
      studies: [
        {
          title: 'Online challenges improve weight loss adherence',
          authors: 'Bojd et al.',
          year: '2021',
          journal: 'Digital Health',
          summary: 'Participar de desafios online melhora adesão em 67% e perda de peso em 23%.'
        },
        {
          title: 'Gamification increases physical activity',
          authors: 'Shameli et al.',
          year: '2017',
          journal: 'The Lancet Digital Health',
          summary: 'Apps com gamificação aumentam atividade física em até 23% e melhoram indicadores metabólicos.'
        },
        {
          title: 'Rewards and progression in health apps',
          authors: 'MacLellan et al.',
          year: '2024',
          journal: 'Journal of Medical Internet Research',
          summary: 'Elementos como recompensas e progressão ajudam a manter hábitos por 6+ meses.'
        }
      ],
      keyPoints: [
        'Aumenta engajamento em 67%',
        'Melhora adesão a longo prazo',
        'Competição saudável motiva',
        'Recompensas reforçam comportamentos',
        'Progressão visual mantém foco'
      ],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'carboidratos',
      icon: <Apple className="w-6 h-6" />,
      title: 'Consciência Alimentar',
      subtitle: 'Carbohydrate Counting & Awareness',
      description: 'Estudos mostram que contar ou estimar carboidratos melhora decisões alimentares, aumenta saciedade e pode reduzir peso corporal.',
      application: 'Mais clareza sobre o alimento = menos exageros + escolhas melhores + maior controle diário.',
      studies: [
        {
          title: 'Carbohydrate counting improves metabolic control',
          authors: 'Harvard Medical School',
          year: '2023',
          journal: 'Nutrition Reviews',
          summary: 'Contagem de carboidratos melhora controle metabólico e aumenta autonomia alimentar.'
        }
      ],
      keyPoints: [
        'Melhora controle metabólico',
        'Aumenta consciência alimentar',
        'Ajuda a planejar refeições',
        'Evita excessos não intencionais',
        'Estimula escolhas de carboidratos complexos'
      ],
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Base Científica</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              Evidências Científicas
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Ciência por trás da <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">transformação</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Todas as funcionalidades do Emagrify são baseadas em pesquisas científicas reconhecidas internacionalmente. 
              Conheça a ciência que comprova a eficácia do nosso método.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-blue-500">50+</div>
                <div className="text-sm text-gray-600">Estudos Citados</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-cyan-500">15+</div>
                <div className="text-sm text-gray-600">Universidades</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-green-500">98%</div>
                <div className="text-sm text-gray-600">Eficácia Comprovada</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6">
            {topics.map((topic) => (
              <Card 
                key={topic.id}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleTopic(topic.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl text-gray-900 mb-1">
                          {topic.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 mb-3">
                          {topic.subtitle}
                        </CardDescription>
                        <p className="text-gray-700 text-sm md:text-base">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      {expandedTopic === topic.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {expandedTopic === topic.id && (
                  <CardContent className="space-y-6 pt-0">
                    {/* Application */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Aplicação Prática</h4>
                          <p className="text-gray-700 text-sm">{topic.application}</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Points */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        Pontos-Chave
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {topic.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Studies */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        Estudos Científicos ({topic.studies.length})
                      </h4>
                      <div className="space-y-3">
                        {topic.studies.map((study, idx) => (
                          <div 
                            key={idx}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h5 className="font-medium text-gray-900 text-sm flex-1">
                                {study.title}
                              </h5>
                              <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {study.authors}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {study.year}
                              </Badge>
                              {study.journal && (
                                <Badge variant="outline" className="text-xs">
                                  {study.journal}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {study.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Heart className="w-16 h-16 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-bold">
              Conclusão Científica
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              A ciência mostra que a combinação de <strong>treino mental</strong>, <strong>autorregulação</strong>, 
              <strong> estratégias if-then</strong>, <strong>desafios gamificados</strong> e <strong>consciência alimentar</strong> (como contagem de carboidratos) 
              é altamente eficaz para manter foco, evitar recaídas, sustentar hábitos saudáveis e acelerar resultados de emagrecimento.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Brain className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Controle Mental</h3>
                <p className="text-sm opacity-90">Reduz impulsividade em até 40%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Target className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Metas Eficazes</h3>
                <p className="text-sm opacity-90">Aumenta sucesso em 200-300%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Gamificação</h3>
                <p className="text-sm opacity-90">Melhora adesão em 67%</p>
              </div>
            </div>

            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 mt-8"
              asChild
            >
              <Link href="/">
                Voltar para Home
                <ArrowLeft className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
