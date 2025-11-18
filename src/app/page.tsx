'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Dumbbell, 
  Apple, 
  TrendingDown, 
  Award, 
  Calculator,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Target,
  Brain,
  Utensils,
  Camera,
  Menu,
  X,
  Mail,
  Instagram,
  Sun,
  Moon,
  Activity,
  Flame,
  Wind,
  ArrowLeft
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

// Lista completa de 23 depoimentos
const allTestimonials = [
  {
    name: 'Maria Silva',
    age: 34,
    lost: '18kg',
    time: '4 meses',
    story: 'Depois de anos tentando, finalmente consegui! O acompanhamento diário e os desafios me mantiveram motivada.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  {
    name: 'João Santos',
    age: 42,
    lost: '25kg',
    time: '6 meses',
    story: 'Perdi peso de forma saudável e ganhei massa muscular. Os treinos personalizados fizeram toda diferença!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
  {
    name: 'Ana Costa',
    age: 38,
    lost: '12kg',
    time: '3 meses',
    story: 'O quiz de menopausa mudou minha vida. Finalmente entendi meu corpo e consegui emagrecer.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  },
  {
    name: 'Carlos Oliveira',
    age: 45,
    lost: '20kg',
    time: '5 meses',
    story: 'Estava com diabetes tipo 2 e consegui reverter! Minha saúde melhorou completamente com a dieta personalizada.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  },
  {
    name: 'Juliana Ferreira',
    age: 29,
    lost: '15kg',
    time: '4 meses',
    story: 'As receitas internacionais me ajudaram a não sentir que estava em dieta. Emagreci comendo gostoso!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
  },
  {
    name: 'Roberto Alves',
    age: 51,
    lost: '30kg',
    time: '8 meses',
    story: 'Maior transformação da minha vida! Voltei a jogar futebol com meus filhos. Gratidão eterna ao Emagrify.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop'
  },
  {
    name: 'Fernanda Lima',
    age: 36,
    lost: '14kg',
    time: '3 meses',
    story: 'O treinamento mental foi essencial! Aprendi a controlar a ansiedade e parei de comer por emoção.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop'
  },
  {
    name: 'Pedro Henrique',
    age: 27,
    lost: '22kg',
    time: '5 meses',
    story: 'Sempre fui sedentário. Os treinos adaptados me fizeram amar exercícios! Hoje sou outra pessoa.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop'
  },
  {
    name: 'Camila Rodrigues',
    age: 41,
    lost: '17kg',
    time: '4 meses',
    story: 'Depois da gravidez, achei que nunca voltaria ao meu peso. O Emagrify provou que eu estava errada!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
  },
  {
    name: 'Marcos Paulo',
    age: 39,
    lost: '19kg',
    time: '5 meses',
    story: 'A calculadora de carboidratos com IA é sensacional! Aprendi a comer melhor sem passar fome.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop'
  },
  {
    name: 'Beatriz Souza',
    age: 33,
    lost: '13kg',
    time: '3 meses',
    story: 'Os desafios semanais me mantiveram focada. Cada conquista era uma motivação a mais!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop'
  },
  {
    name: 'Ricardo Mendes',
    age: 48,
    lost: '28kg',
    time: '7 meses',
    story: 'Tinha pressão alta e colesterol elevado. Hoje estou sem remédios! Minha vida mudou completamente.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  },
  {
    name: 'Larissa Martins',
    age: 31,
    lost: '16kg',
    time: '4 meses',
    story: 'O acompanhamento diário me deu disciplina. Nunca imaginei que conseguiria manter uma rotina saudável!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop'
  },
  {
    name: 'Thiago Barbosa',
    age: 35,
    lost: '21kg',
    time: '5 meses',
    story: 'Trabalho viajando muito e achava impossível emagrecer. As receitas práticas salvaram minha vida!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop'
  },
  {
    name: 'Patricia Gomes',
    age: 44,
    lost: '24kg',
    time: '6 meses',
    story: 'Na menopausa, pensei que era impossível. O plano específico para essa fase foi perfeito para mim!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop'
  },
  {
    name: 'Lucas Cardoso',
    age: 26,
    lost: '18kg',
    time: '4 meses',
    story: 'Gamer que vivia de delivery. O Emagrify me ensinou a cozinhar e cuidar da saúde. Mudança total!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop'
  },
  {
    name: 'Renata Dias',
    age: 37,
    lost: '15kg',
    time: '4 meses',
    story: 'Sofria com compulsão alimentar. O suporte psicológico e as técnicas mentais me libertaram!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop'
  },
  {
    name: 'André Pereira',
    age: 40,
    lost: '26kg',
    time: '6 meses',
    story: 'Estava obeso e deprimido. Hoje corro maratonas! O Emagrify salvou minha vida literalmente.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop'
  },
  {
    name: 'Gabriela Nunes',
    age: 32,
    lost: '11kg',
    time: '3 meses',
    story: 'Queria perder os últimos quilos para o casamento. Consegui e ainda ganhei saúde e disposição!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop'
  },
  {
    name: 'Felipe Castro',
    age: 29,
    lost: '23kg',
    time: '5 meses',
    story: 'Ex-atleta que engordou muito. Voltei à forma com os treinos personalizados. Melhor investimento!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop'
  },
  {
    name: 'Vanessa Rocha',
    age: 46,
    lost: '20kg',
    time: '5 meses',
    story: 'Tentei todas as dietas da moda e nada funcionava. Aqui aprendi a ter uma relação saudável com comida.',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop'
  },
  {
    name: 'Daniel Moreira',
    age: 38,
    lost: '27kg',
    time: '7 meses',
    story: 'Tinha apneia do sono e dores nas articulações. Hoje durmo bem e não sinto mais dores. Vida nova!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop'
  },
  {
    name: 'Isabela Freitas',
    age: 30,
    lost: '14kg',
    time: '4 meses',
    story: 'Vegetariana e achava difícil emagrecer. As receitas plant-based são incríveis e super nutritivas!',
    rating: 5,
    photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop'
  }
];

// Perguntas do Quiz de Menopausa & Menstruação
const menopauseQuestions = [
  {
    id: 1,
    question: 'Você menstrua atualmente?',
    options: [
      { value: 'sim', label: 'Sim, regularmente' },
      { value: 'irregular', label: 'Sim, mas de forma irregular' },
      { value: 'nao', label: 'Não menstruo mais' },
    ],
  },
  {
    id: 2,
    question: 'Qual sua idade?',
    options: [
      { value: '18-30', label: '18-30 anos' },
      { value: '31-40', label: '31-40 anos' },
      { value: '41-50', label: '41-50 anos' },
      { value: '51+', label: '51 anos ou mais' },
    ],
  },
  {
    id: 3,
    question: 'Seu ciclo é regular?',
    options: [
      { value: 'sim', label: 'Sim, muito regular (28-30 dias)' },
      { value: 'mais-ou-menos', label: 'Mais ou menos (varia alguns dias)' },
      { value: 'nao', label: 'Não, é bastante irregular' },
      { value: 'nao-aplica', label: 'Não se aplica (não menstruo)' },
    ],
  },
  {
    id: 4,
    question: 'Em qual fase do ciclo você está agora?',
    options: [
      { value: 'menstruacao', label: 'Menstruação (dias 1-5)' },
      { value: 'folicular', label: 'Fase Folicular (dias 6-14)' },
      { value: 'ovulacao', label: 'Ovulação (dias 14-16)' },
      { value: 'lutea', label: 'Fase Lútea (dias 17-28)' },
      { value: 'nao-sei', label: 'Não sei / Não se aplica' },
    ],
  },
  {
    id: 5,
    question: 'Você sente inchaço?',
    options: [
      { value: 'sim', label: 'Sim, muito inchaço' },
      { value: 'as-vezes', label: 'Às vezes, principalmente antes da menstruação' },
      { value: 'nao', label: 'Não sinto inchaço' },
    ],
  },
  {
    id: 6,
    question: 'Está com cólica?',
    options: [
      { value: 'forte', label: 'Sim, cólica forte' },
      { value: 'leve', label: 'Sim, cólica leve' },
      { value: 'nao', label: 'Não tenho cólica' },
    ],
  },
  {
    id: 7,
    question: 'Percebeu aumento de fome recentemente?',
    options: [
      { value: 'alta', label: 'Sim, muita fome (principalmente doces)' },
      { value: 'normal', label: 'Fome normal' },
      { value: 'baixa', label: 'Pouca fome ou sem apetite' },
    ],
  },
  {
    id: 8,
    question: 'Seu humor está instável?',
    options: [
      { value: 'muito', label: 'Sim, muito instável (irritabilidade, tristeza)' },
      { value: 'um-pouco', label: 'Um pouco instável' },
      { value: 'estavel', label: 'Estável, sem alterações' },
    ],
  },
  {
    id: 9,
    question: 'Seu nível de energia hoje é qual?',
    options: [
      { value: 'muito-alto', label: 'Muito alto (muita disposição)' },
      { value: 'alto', label: 'Alto (boa disposição)' },
      { value: 'medio', label: 'Médio (disposição normal)' },
      { value: 'baixo', label: 'Baixo (cansaço leve)' },
      { value: 'muito-baixo', label: 'Muito baixo (exaustão)' },
    ],
  },
  {
    id: 10,
    question: 'Você tem ondas de calor?',
    options: [
      { value: 'sim', label: 'Sim, frequentes' },
      { value: 'as-vezes', label: 'Às vezes' },
      { value: 'nao', label: 'Não tenho' },
    ],
  },
  {
    id: 11,
    question: 'Como está seu sono?',
    options: [
      { value: 'otimo', label: 'Ótimo (durmo bem toda noite)' },
      { value: 'bom', label: 'Bom (durmo razoavelmente)' },
      { value: 'ruim', label: 'Ruim (acordo várias vezes)' },
      { value: 'pessimo', label: 'Péssimo (insônia frequente)' },
    ],
  },
  {
    id: 12,
    question: 'Onde percebe ganho de peso?',
    options: [
      { value: 'barriga', label: 'Principalmente na barriga' },
      { value: 'coxas', label: 'Coxas e quadril' },
      { value: 'geral', label: 'Corpo todo de forma geral' },
      { value: 'nao-percebo', label: 'Não percebo ganho de peso' },
    ],
  },
  {
    id: 13,
    question: 'Sente ansiedade aumentada?',
    options: [
      { value: 'sim', label: 'Sim, muita ansiedade' },
      { value: 'moderada', label: 'Ansiedade moderada' },
      { value: 'nao', label: 'Não sinto ansiedade' },
    ],
  },
  {
    id: 14,
    question: 'Quantos dias por semana você treina?',
    options: [
      { value: '0', label: 'Não treino atualmente' },
      { value: '1-2', label: '1-2 dias por semana' },
      { value: '3-4', label: '3-4 dias por semana' },
      { value: '5+', label: '5 ou mais dias por semana' },
    ],
  },
  {
    id: 15,
    question: 'Qual intensidade de treino prefere?',
    options: [
      { value: 'leve', label: 'Leve (caminhada, alongamento)' },
      { value: 'moderada', label: 'Moderada (musculação leve, corrida leve)' },
      { value: 'intensa', label: 'Intensa (HIIT, crossfit, corrida intensa)' },
    ],
  },
  {
    id: 16,
    question: 'Qual seu objetivo principal?',
    options: [
      { value: 'emagrecer', label: 'Emagrecer' },
      { value: 'manter', label: 'Manter peso atual' },
      { value: 'aliviar', label: 'Aliviar sintomas hormonais' },
      { value: 'massa', label: 'Ganhar massa muscular' },
    ],
  },
];

export default function Home() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenopauseDialog, setShowMenopauseDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Carregar preferência de tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Função para alternar tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const displayedTestimonials = showAllTestimonials ? allTestimonials : allTestimonials.slice(0, 3);

  const progress = ((currentQuestion + 1) / menopauseQuestions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [menopauseQuestions[currentQuestion].id]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < menopauseQuestions.length - 1) {
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

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowResults(false);
    setAnswers({});
  };

  const generatePersonalizedPlan = () => {
    const isMenopause = answers[1] === '51+' || answers[1] === '41-50';
    const hasSymptoms = answers[5] === 'sim' || answers[6] === 'forte' || answers[7] === 'alta';
    const lowEnergy = answers[9] === 'baixo' || answers[9] === 'muito-baixo';

    return {
      treino: isMenopause 
        ? "Treino de força moderada 3-4x/semana com foco em preservação de massa muscular e saúde óssea. Inclui exercícios de resistência, alongamento e mobilidade."
        : hasSymptoms
        ? "Treino adaptado ao ciclo: Fase folicular (dias 1-14) - treinos intensos; Fase lútea (dias 15-28) - treinos moderados com foco em recuperação."
        : "Treino balanceado com cardio e musculação, ajustado à sua fase do ciclo para máxima eficiência.",
      
      dieta: isMenopause
        ? "Dieta rica em cálcio, vitamina D, proteínas e fitoestrógenos. Redução de sódio para controlar inchaço. Foco em alimentos anti-inflamatórios."
        : hasSymptoms
        ? "Dieta anti-inflamatória com redução de sal na fase lútea. Aumento de magnésio e ômega-3 para controlar sintomas. Carboidratos complexos para estabilizar humor."
        : "Dieta balanceada com ajustes conforme a fase do ciclo: mais carboidratos na fase lútea, mais proteínas na folicular.",
      
      estrategias: lowEnergy
        ? ["Priorize sono de qualidade (7-9h)", "Suplementação de vitamina D e B12", "Exercícios leves em dias de baixa energia", "Hidratação constante"]
        : ["Mantenha rotina de exercícios regular", "Controle porções sem restrição extrema", "Pratique mindful eating", "Registre seu progresso semanalmente"],
      
      recomendacoes: isMenopause
        ? ["Consulte médico sobre TRH se sintomas intensos", "Pratique yoga ou pilates 2x/semana", "Evite cafeína após 14h", "Inclua soja e linhaça na dieta"]
        : ["Acompanhe seu ciclo com app", "Ajuste treinos conforme energia", "Permita-se descansar na menstruação", "Hidrate-se mais na fase lútea"]
    };
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => handleNavigation('/')} className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold text-[#2A2A2A] dark:text-white">Emagrify</span>
            </button>
            
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] transition-colors"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] transition-colors"
              >
                Depoimentos
              </button>
              <button 
                onClick={() => handleNavigation('/receitas')}
                className="text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] transition-colors"
              >
                Receitas Grátis
              </button>
              <button 
                onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] transition-colors"
              >
                Notícias
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Botão de Trocar Tema */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] hover:bg-[#7BE4B7]/10 transition-all"
                aria-label="Alternar tema"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              <Button 
                variant="ghost" 
                className="text-[#2A2A2A] dark:text-gray-300 hidden md:inline-flex"
                onClick={() => handleNavigation('/login')}
              >
                Entrar
              </Button>
              <Button 
                className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90 transition-opacity"
                onClick={() => handleNavigation('/checkout')}
              >
                Assinar Agora
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <button 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7]"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7]"
              >
                Depoimentos
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/receitas');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7]"
              >
                Receitas Grátis
              </button>
              <button 
                onClick={() => {
                  document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7]"
              >
                Notícias
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7]"
              >
                Entrar
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7BE4B7]/10 via-white dark:via-gray-900 to-[#6ECBF5]/10 py-12 md:py-32 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90">
                🔥 Promoção: De R$125 por apenas R$95/mês
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-[#2A2A2A] dark:text-white leading-tight">
                Transforme seu corpo e sua <span className="text-[#7BE4B7]">vida</span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Plataforma completa com dietas personalizadas, treinos exclusivos, 
                acompanhamento diário e suporte científico para sua jornada de transformação.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90 transition-opacity text-lg px-8"
                  onClick={() => handleNavigation('/checkout')}
                >
                  Começar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#7BE4B7] text-[#2A2A2A] dark:text-white hover:bg-[#7BE4B7]/10"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Funcionalidades
                </Button>
              </div>

              <div className="flex items-center gap-4 sm:gap-8 pt-4 flex-wrap">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#7BE4B7]">50k+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#FF7A00]">15kg</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Média Perdida</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#6ECBF5]">4.9★</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avaliação</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#7BE4B7]/10 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#7BE4B7] flex-shrink-0" />
                    <span className="font-medium text-[#2A2A2A] dark:text-white text-sm sm:text-base">Dietas Personalizadas com IA</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#6ECBF5]/10 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#6ECBF5] flex-shrink-0" />
                    <span className="font-medium text-[#2A2A2A] dark:text-white text-sm sm:text-base">Treinos Adaptados ao Seu Nível</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#FF7A00]/10 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF7A00] flex-shrink-0" />
                    <span className="font-medium text-[#2A2A2A] dark:text-white text-sm sm:text-base">Acompanhamento Diário</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#7BE4B7]/10 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#7BE4B7] flex-shrink-0" />
                    <span className="font-medium text-[#2A2A2A] dark:text-white text-sm sm:text-base">Base Científica Comprovada</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-[#7BE4B7]/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-48 h-48 sm:w-72 sm:h-72 bg-[#6ECBF5]/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 sm:py-20 bg-[#F4F4F4] dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#7BE4B7] text-white mb-4">
              Funcionalidades Completas
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2A2A] dark:text-white mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ferramentas profissionais baseadas em ciência para sua transformação completa
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature Cards */}
            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/calculadora-carboidratos')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Calculadora de Carboidratos</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Tire foto do seu prato e descubra os nutrientes instantaneamente com IA
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/quiz-perda-peso')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#7BE4B7] flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Quiz Personalizado</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Responda perguntas e receba uma dieta e treino feitos especialmente para você
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/calculadora-imc')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6ECBF5] to-[#7BE4B7] flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Calculadora de IMC</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Calcule seu Índice de Massa Corporal e entenda sua faixa de peso ideal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/desafios')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7BE4B7] to-[#FF7A00] flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Sistema de Desafios</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Desafios diários, semanais e mensais com recompensas e gamificação
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/monitor-progresso')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6ECBF5] to-[#FF7A00] flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Monitor de Progresso</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Acompanhe peso, medidas, fotos e evolução com gráficos detalhados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/treinamento-mental')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#6ECBF5] flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Treinamento Mental</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Mude sua mentalidade e supere barreiras psicológicas com técnicas comprovadas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => setShowMenopauseDialog(true)}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Menopausa & Menstruação</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Planos especiais para mulheres com orientações sobre hormônios e peso
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/base-cientifica')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6ECBF5] to-[#7BE4B7] flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Base Científica</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Todas as recomendações baseadas em estudos científicos reconhecidos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 h-full cursor-pointer"
              onClick={() => handleNavigation('/receitas')}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#7BE4B7] flex items-center justify-center mb-4">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#2A2A2A] dark:text-white">Receitas Internacionais</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Centenas de receitas saudáveis do mundo todo com passo a passo
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-[#FF7A00] text-white mb-4">
              Histórias Reais
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2A2A2A] dark:text-white mb-4">
              Transformações que inspiram
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Veja como o Emagrify mudou a vida de milhares de pessoas
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedTestimonials.map((testimonial, idx) => (
              <Card key={idx} className="border-none shadow-lg bg-gradient-to-br from-[#F4F4F4] dark:from-gray-800 to-white dark:to-gray-700 transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.photo} 
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#7BE4B7]"
                    />
                    <div>
                      <CardTitle className="text-[#2A2A2A] dark:text-white text-base sm:text-lg">{testimonial.name}</CardTitle>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{testimonial.age} anos</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF7A00] text-[#FF7A00]" />
                    ))}
                  </div>

                  <div className="flex gap-4 mb-4">
                    <Badge className="bg-[#7BE4B7] text-white text-xs sm:text-sm">
                      -{testimonial.lost}
                    </Badge>
                    <Badge className="bg-[#6ECBF5] text-white text-xs sm:text-sm">
                      {testimonial.time}
                    </Badge>
                  </div>

                  <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    &quot;{testimonial.story}&quot;
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-[#7BE4B7] text-[#2A2A2A] dark:text-white hover:bg-[#7BE4B7]/10"
              onClick={() => setShowAllTestimonials(!showAllTestimonials)}
            >
              {showAllTestimonials ? 'Ver Menos Depoimentos' : 'Ver Todos os Depoimentos'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] text-white">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Comece sua transformação hoje
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a mais de 50.000 pessoas que já transformaram suas vidas com o Emagrify
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md mx-auto mb-8">
            <div className="text-5xl sm:text-6xl font-bold mb-2">R$ 95</div>
            <div className="text-lg sm:text-xl mb-2">
              <span className="line-through opacity-70">R$ 125</span>
              <Badge className="ml-2 bg-[#FF7A00] text-white">24% OFF</Badge>
            </div>
            <div className="text-base sm:text-lg opacity-90">por 30 dias</div>
          </div>

          <Button 
            size="lg"
            className="bg-white text-[#7BE4B7] hover:bg-gray-100 text-base sm:text-lg px-8 sm:px-12"
            onClick={() => handleNavigation('/checkout')}
          >
            Assinar Agora
            <Zap className="ml-2 w-5 h-5" />
          </Button>

          <p className="mt-6 text-xs sm:text-sm opacity-80">
            Cancele quando quiser • Acesso imediato • Suporte 24/7
          </p>
        </div>
      </section>

      {/* Menopause Dialog */}
      <Dialog open={showMenopauseDialog} onOpenChange={(open) => {
        setShowMenopauseDialog(open);
        if (!open) {
          resetQuiz();
        }
      }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto dark:bg-gray-800">
          {!showResults ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl font-bold text-[#2A2A2A] dark:text-white flex items-center gap-3">
                  <Heart className="w-8 h-8 text-[#7BE4B7]" />
                  Menopausa & Menstruação
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400 text-base">
                  Entenda como o ciclo menstrual e a fase da vida influenciam diretamente o emagrecimento
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-[#7BE4B7] text-white">
                      Pergunta {currentQuestion + 1} de {menopauseQuestions.length}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(progress)}% completo</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <Card className="border-2 border-[#7BE4B7] dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-[#2A2A2A] dark:text-white">
                      {menopauseQuestions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={answers[menopauseQuestions[currentQuestion].id]}
                      onValueChange={handleAnswer}
                    >
                      {menopauseQuestions[currentQuestion].options.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-[#7BE4B7] transition-colors cursor-pointer"
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label
                            htmlFor={option.value}
                            className="flex-1 cursor-pointer text-base text-[#2A2A2A] dark:text-white"
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
                        disabled={!answers[menopauseQuestions[currentQuestion].id]}
                        className="flex-1 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white"
                      >
                        {currentQuestion === menopauseQuestions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl font-bold text-[#2A2A2A] dark:text-white flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-[#7BE4B7]" />
                  Seu Plano Personalizado Está Pronto!
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400 text-base">
                  Baseado nas suas respostas, criamos um plano completo para você
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {(() => {
                  const plan = generatePersonalizedPlan();
                  return (
                    <>
                      <Card className="border-2 border-[#7BE4B7] dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-[#2A2A2A] dark:text-white">
                            <Dumbbell className="w-6 h-6 text-[#7BE4B7]" />
                            Treino Ideal para Seu Momento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300">{plan.treino}</p>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-[#6ECBF5] dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-[#2A2A2A] dark:text-white">
                            <Apple className="w-6 h-6 text-[#6ECBF5]" />
                            Plano Alimentar Personalizado
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300">{plan.dieta}</p>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-[#FF7A00] dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-[#2A2A2A] dark:text-white">
                            <Target className="w-6 h-6 text-[#FF7A00]" />
                            Estratégias de Emagrecimento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.estrategias.map((estrategia, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                                <span>{estrategia}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-[#7BE4B7] dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-[#2A2A2A] dark:text-white">
                            <Heart className="w-6 h-6 text-[#7BE4B7]" />
                            Recomendações Comportamentais
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.recomendacoes.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-[#7BE4B7] flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <div className="flex gap-4">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90"
                          size="lg"
                          onClick={() => handleNavigation('/checkout')}
                        >
                          Assinar para Acessar Plano Completo
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="lg"
                          onClick={resetQuiz}
                          className="border-2 border-[#7BE4B7]"
                        >
                          Refazer Quiz
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#2A2A2A] dark:text-white">Entre em Contato</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Fale conosco através dos nossos canais de atendimento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <a 
              href="mailto:emagrify@gmail.com"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#7BE4B7]/10 to-[#6ECBF5]/10 hover:from-[#7BE4B7]/20 hover:to-[#6ECBF5]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#2A2A2A] dark:text-white group-hover:text-[#7BE4B7] transition-colors">Email</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">emagrify@gmail.com</div>
              </div>
            </a>

            <a 
              href="https://www.instagram.com/emagrify_br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#FF7A00]/10 to-[#7BE4B7]/10 hover:from-[#FF7A00]/20 hover:to-[#7BE4B7]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#7BE4B7] flex items-center justify-center flex-shrink-0">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#2A2A2A] dark:text-white group-hover:text-[#FF7A00] transition-colors">Instagram</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">@emagrify_br</div>
              </div>
            </a>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-[#2A2A2A] dark:bg-gray-950 text-white py-8 sm:py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <span className="text-xl sm:text-2xl font-bold">Emagrify</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Transformando vidas através da saúde e bem-estar
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm sm:text-base">Funcionalidades</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><button onClick={() => handleNavigation('/quiz-perda-peso')}>Dietas Personalizadas</button></li>
                <li><button onClick={() => handleNavigation('/desafios')}>Sistema de Desafios</button></li>
                <li><button onClick={() => handleNavigation('/calculadora-imc')}>Calculadoras</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm sm:text-base">Recursos</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><button onClick={() => handleNavigation('/receitas')}>Receitas Grátis</button></li>
                <li><button onClick={() => handleNavigation('/calculadora-carboidratos')}>Calculadoras</button></li>
                <li><button onClick={() => handleNavigation('/base-cientifica')}>Artigos Científicos</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm sm:text-base">Suporte</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><button onClick={() => handleNavigation('/')}>Central de Ajuda</button></li>
                <li>
                  <button 
                    onClick={() => setShowContactDialog(true)}
                    className="hover:text-[#7BE4B7] transition-colors"
                  >
                    Contato
                  </button>
                </li>
                <li><button onClick={() => handleNavigation('/')}>Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>© 2024 Emagrify. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
