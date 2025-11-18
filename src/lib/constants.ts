// Constantes do Emagrify

export const COLORS = {
  primary: '#7BE4B7',
  secondary: '#FF7A00',
  white: '#FFFFFF',
  gray: '#F4F4F4',
  trust: '#6ECBF5',
  contrast: '#2A2A2A',
} as const;

export const SUBSCRIPTION = {
  originalPrice: 125,
  promotionalPrice: 95,
  duration: 30, // dias
} as const;

export const DAILY_CHALLENGES = [
  {
    id: 'water',
    title: 'Beber 2 litros de água',
    description: 'Mantenha-se hidratado durante todo o dia',
    points: 10,
  },
  {
    id: 'walk',
    title: 'Caminhar 20 minutos',
    description: 'Movimente seu corpo com uma caminhada leve',
    points: 15,
  },
  {
    id: 'fruit',
    title: 'Comer 1 fruta',
    description: 'Adicione vitaminas naturais à sua dieta',
    points: 10,
  },
  {
    id: 'no_soda',
    title: 'Não tomar refrigerante por 24h',
    description: 'Evite açúcares desnecessários',
    points: 20,
  },
  {
    id: 'breathing',
    title: '5 minutos de respiração',
    description: 'Controle a ansiedade com exercícios de respiração',
    points: 15,
  },
] as const;

export const WEEKLY_CHALLENGES = [
  {
    id: 'workouts',
    title: 'Completar 3 treinos na semana',
    description: 'Mantenha a consistência nos exercícios',
    points: 50,
  },
  {
    id: 'sugar',
    title: 'Reduzir açúcar em 3 refeições',
    description: 'Diminua o consumo de açúcar gradualmente',
    points: 40,
  },
  {
    id: 'cooking',
    title: 'Preparar 1 refeição saudável em casa',
    description: 'Controle os ingredientes da sua comida',
    points: 45,
  },
  {
    id: 'fasting',
    title: 'Fazer 1 jejum de 12h',
    description: 'Experimente o jejum intermitente',
    points: 35,
  },
] as const;

export const MONTHLY_CHALLENGES = [
  {
    id: 'weight_loss',
    title: 'Perder 1 kg',
    description: 'Alcance sua meta de perda de peso mensal',
    points: 200,
  },
  {
    id: 'workouts_month',
    title: 'Completar 20 treinos no mês',
    description: 'Mantenha a disciplina durante todo o mês',
    points: 150,
  },
  {
    id: 'measurements',
    title: 'Reduzir medidas (cintura/quadril)',
    description: 'Veja resultados reais nas suas medidas',
    points: 180,
  },
  {
    id: 'meal_plan',
    title: 'Cumprir plano alimentar por 30 dias',
    description: 'Siga sua dieta personalizada completamente',
    points: 250,
  },
] as const;

export const NOTIFICATION_TIMES = ['09:00', '18:00'] as const;

export const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: 'Abaixo do peso', color: '#6ECBF5' },
  { min: 18.5, max: 24.9, label: 'Peso normal', color: '#7BE4B7' },
  { min: 25, max: 29.9, label: 'Sobrepeso', color: '#FF7A00' },
  { min: 30, max: 34.9, label: 'Obesidade Grau I', color: '#FF5722' },
  { min: 35, max: 39.9, label: 'Obesidade Grau II', color: '#E91E63' },
  { min: 40, max: 100, label: 'Obesidade Grau III', color: '#9C27B0' },
] as const;

export const DIET_TYPES = [
  'Dieta Mediterrânea',
  'Low Carb',
  'Jejum Intermitente',
  'Dieta Flexível',
  'Dieta Cetogênica',
  'Dieta Vegetariana',
  'Dieta Vegana',
  'Dieta Paleo',
] as const;

export const RESEARCH_SOURCES = [
  'National Institutes of Health (NIH)',
  'World Health Organization (WHO)',
  'American Journal of Clinical Nutrition',
  'The Lancet',
  'British Medical Journal (BMJ)',
  'Journal of the American Medical Association (JAMA)',
  'Nature Medicine',
  'Harvard Medical School',
] as const;
