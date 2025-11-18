// Tipos globais do Emagrify

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: Subscription | null;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentMethod: 'credit_card' | 'pix';
}

export interface QuizAnswer {
  questionId: string;
  answer: string | number;
}

export interface DietPlan {
  id: string;
  userId: string;
  type: 'weight_loss' | 'muscle_gain' | 'menopause';
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks: Meal[];
  exercises: Exercise[];
  research: string;
  createdAt: Date;
}

export interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  preparation: string;
}

export interface Exercise {
  name: string;
  duration: number;
  sets?: number;
  reps?: number;
  calories: number;
  description: string;
}

export interface Challenge {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  description: string;
  points: number;
  completed: boolean;
  streak?: number;
}

export interface Progress {
  userId: string;
  date: Date;
  weight: number;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  photos?: string[];
  notes?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  age: number;
  weightLost: number;
  duration: string;
  story: string;
  challenges: string[];
  psychologicalBarriers: string[];
  beforePhoto: string;
  afterPhoto: string;
  verified: boolean;
}

export interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  description: string;
  benefits: string[];
  sideEffects: string[];
  contraindications: string[];
  research: string;
  approved: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  country: string;
  category: string;
  ingredients: string[];
  preparation: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
}

export interface News {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  publishedAt: Date;
  category: 'weight_loss' | 'nutrition' | 'fitness' | 'health';
}

export interface UserStats {
  totalPoints: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  challengesCompleted: number;
  totalWeightLost: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}
