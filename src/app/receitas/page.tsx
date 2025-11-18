'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, Search, Clock, ChefHat, Droplets, Coffee, Salad, Soup, Cookie } from 'lucide-react';
import Link from 'next/link';

const recipes = [
  // SUCOS DETOX E FUNCIONAIS
  {
    id: 1,
    name: 'Suco Verde Detox',
    category: 'Sucos Detox',
    calories: 85,
    protein: 3,
    carbs: 18,
    fats: 0.5,
    prepTime: 5,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop',
    ingredients: ['1 maçã verde', '1 folha couve', 'Suco de 1 limão', '1 pedaço gengibre', '200ml água'],
  },
  {
    id: 2,
    name: 'Suco de Abacaxi com Hortelã',
    category: 'Sucos Detox',
    calories: 95,
    protein: 1,
    carbs: 22,
    fats: 0.3,
    prepTime: 5,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop',
    ingredients: ['2 fatias abacaxi', '5 folhas hortelã', '200ml água gelada', 'Gelo'],
  },
  {
    id: 3,
    name: 'Suco Vermelho Antioxidante',
    category: 'Sucos Detox',
    calories: 78,
    protein: 2,
    carbs: 17,
    fats: 0.4,
    prepTime: 5,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    ingredients: ['1 beterraba pequena', '1 cenoura', '1 laranja', '1 pedaço gengibre'],
  },
  {
    id: 4,
    name: 'Suco de Melancia com Limão',
    category: 'Sucos Detox',
    calories: 62,
    protein: 1,
    carbs: 14,
    fats: 0.2,
    prepTime: 3,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=400&h=300&fit=crop',
    ingredients: ['2 fatias melancia', 'Suco de 1 limão', 'Hortelã', 'Gelo'],
  },

  // CHÁS PARA EMAGRECER
  {
    id: 5,
    name: 'Chá Verde com Gengibre',
    category: 'Chás',
    calories: 5,
    protein: 0,
    carbs: 1,
    fats: 0,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    ingredients: ['1 sachê chá verde', '1 pedaço gengibre', '300ml água quente', 'Limão (opcional)'],
  },
  {
    id: 6,
    name: 'Chá de Hibisco',
    category: 'Chás',
    calories: 3,
    protein: 0,
    carbs: 0.5,
    fats: 0,
    prepTime: 8,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1597318130878-5a5d8f6f6c3d?w=400&h=300&fit=crop',
    ingredients: ['2 colheres hibisco seco', '300ml água fervente', 'Canela (opcional)'],
  },
  {
    id: 7,
    name: 'Chá de Canela com Maçã',
    category: 'Chás',
    calories: 12,
    protein: 0,
    carbs: 3,
    fats: 0,
    prepTime: 12,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    ingredients: ['2 paus canela', '1/2 maçã fatiada', '300ml água', 'Cravo (opcional)'],
  },
  {
    id: 8,
    name: 'Chá Branco Termogênico',
    category: 'Chás',
    calories: 2,
    protein: 0,
    carbs: 0.3,
    fats: 0,
    prepTime: 7,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop',
    ingredients: ['1 sachê chá branco', '1 rodela limão', '300ml água 80°C'],
  },

  // SALADAS SABOROSAS
  {
    id: 9,
    name: 'Salada Caesar Fit',
    category: 'Saladas',
    calories: 245,
    protein: 28,
    carbs: 12,
    fats: 9,
    prepTime: 15,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    ingredients: ['Alface romana', '150g frango grelhado', 'Parmesão light', 'Molho caesar light', 'Croutons integrais'],
  },
  {
    id: 10,
    name: 'Salada Caprese',
    category: 'Saladas',
    calories: 198,
    protein: 12,
    carbs: 8,
    fats: 14,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop',
    ingredients: ['2 tomates', '150g mussarela de búfala light', 'Manjericão fresco', 'Azeite', 'Vinagre balsâmico'],
  },
  {
    id: 11,
    name: 'Salada de Quinoa',
    category: 'Saladas',
    calories: 285,
    protein: 14,
    carbs: 38,
    fats: 8,
    prepTime: 20,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=300&fit=crop',
    ingredients: ['100g quinoa cozida', 'Tomate cereja', 'Pepino', 'Cebola roxa', 'Azeite', 'Limão'],
  },
  {
    id: 12,
    name: 'Salada Tropical',
    category: 'Saladas',
    calories: 165,
    protein: 8,
    carbs: 24,
    fats: 5,
    prepTime: 12,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    ingredients: ['Mix de folhas', 'Manga', 'Abacaxi', 'Castanhas', 'Molho de maracujá'],
  },
  {
    id: 13,
    name: 'Salada Mediterrânea',
    category: 'Saladas',
    calories: 220,
    protein: 10,
    carbs: 18,
    fats: 12,
    prepTime: 15,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    ingredients: ['Alface', 'Tomate', 'Pepino', 'Azeitonas', 'Queijo feta light', 'Azeite'],
  },

  // PRATOS NUTRITIVOS
  {
    id: 14,
    name: 'Frango Grelhado com Legumes',
    category: 'Pratos Nutritivos',
    calories: 340,
    protein: 42,
    carbs: 22,
    fats: 10,
    prepTime: 30,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    ingredients: ['200g peito frango', 'Brócolis', 'Cenoura', 'Abobrinha', 'Temperos naturais'],
  },
  {
    id: 15,
    name: 'Salmão ao Forno',
    category: 'Pratos Nutritivos',
    calories: 385,
    protein: 38,
    carbs: 8,
    fats: 22,
    prepTime: 25,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    ingredients: ['200g salmão', 'Limão', 'Alho', 'Ervas', 'Aspargos'],
  },
  {
    id: 16,
    name: 'Omelete de Claras',
    category: 'Pratos Nutritivos',
    calories: 185,
    protein: 24,
    carbs: 8,
    fats: 6,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    ingredients: ['5 claras', 'Tomate', 'Cebola', 'Espinafre', 'Queijo cottage'],
  },
  {
    id: 17,
    name: 'Tilápia com Purê de Couve-flor',
    category: 'Pratos Nutritivos',
    calories: 295,
    protein: 36,
    carbs: 15,
    fats: 9,
    prepTime: 35,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1580959375944-1ab5b8c78f5e?w=400&h=300&fit=crop',
    ingredients: ['200g tilápia', 'Couve-flor', 'Alho', 'Azeite', 'Temperos'],
  },
  {
    id: 18,
    name: 'Strogonoff Fit de Frango',
    category: 'Pratos Nutritivos',
    calories: 320,
    protein: 38,
    carbs: 28,
    fats: 8,
    prepTime: 30,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    ingredients: ['300g frango', 'Cogumelos', 'Iogurte grego', 'Mostarda', 'Arroz integral'],
  },
  {
    id: 19,
    name: 'Carne Moída com Legumes',
    category: 'Pratos Nutritivos',
    calories: 310,
    protein: 32,
    carbs: 20,
    fats: 12,
    prepTime: 25,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop',
    ingredients: ['200g carne moída magra', 'Cenoura', 'Vagem', 'Tomate', 'Cebola'],
  },

  // LANCHES RÁPIDOS
  {
    id: 20,
    name: 'Wrap de Frango',
    category: 'Lanches',
    calories: 285,
    protein: 28,
    carbs: 32,
    fats: 6,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    ingredients: ['Tortilha integral', '100g frango desfiado', 'Alface', 'Tomate', 'Molho light'],
  },
  {
    id: 21,
    name: 'Sanduíche Natural',
    category: 'Lanches',
    calories: 245,
    protein: 18,
    carbs: 28,
    fats: 8,
    prepTime: 8,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop',
    ingredients: ['Pão integral', 'Peito peru', 'Queijo branco', 'Alface', 'Tomate'],
  },
  {
    id: 22,
    name: 'Tapioca Fit',
    category: 'Lanches',
    calories: 195,
    protein: 12,
    carbs: 32,
    fats: 3,
    prepTime: 7,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1619740455993-9e0c79b29c01?w=400&h=300&fit=crop',
    ingredients: ['3 colheres goma tapioca', 'Queijo cottage', 'Tomate seco', 'Orégano'],
  },
  {
    id: 23,
    name: 'Panqueca de Banana',
    category: 'Lanches',
    calories: 215,
    protein: 14,
    carbs: 28,
    fats: 6,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=300&fit=crop',
    ingredients: ['1 banana', '2 ovos', 'Aveia', 'Canela', 'Mel'],
  },
  {
    id: 24,
    name: 'Crepioca Proteica',
    category: 'Lanches',
    calories: 225,
    protein: 22,
    carbs: 24,
    fats: 5,
    prepTime: 8,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    ingredients: ['2 ovos', '2 colheres tapioca', 'Frango desfiado', 'Queijo light'],
  },
  {
    id: 25,
    name: 'Pasta de Atum',
    category: 'Lanches',
    calories: 165,
    protein: 20,
    carbs: 8,
    fats: 6,
    prepTime: 5,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop',
    ingredients: ['1 lata atum', 'Iogurte grego', 'Cebolinha', 'Torradas integrais'],
  },

  // SOPAS NUTRITIVAS
  {
    id: 26,
    name: 'Sopa de Legumes',
    category: 'Sopas',
    calories: 125,
    protein: 6,
    carbs: 22,
    fats: 2,
    prepTime: 30,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    ingredients: ['Cenoura', 'Batata', 'Abobrinha', 'Chuchu', 'Caldo caseiro'],
  },
  {
    id: 27,
    name: 'Caldo Verde Fit',
    category: 'Sopas',
    calories: 145,
    protein: 8,
    carbs: 18,
    fats: 4,
    prepTime: 25,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=400&h=300&fit=crop',
    ingredients: ['Couve', 'Batata', 'Cebola', 'Alho', 'Linguiça de frango light'],
  },
  {
    id: 28,
    name: 'Sopa de Abóbora',
    category: 'Sopas',
    calories: 110,
    protein: 4,
    carbs: 20,
    fats: 2,
    prepTime: 35,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop',
    ingredients: ['Abóbora', 'Cebola', 'Alho', 'Gengibre', 'Caldo de legumes'],
  },
  {
    id: 29,
    name: 'Sopa de Lentilha',
    category: 'Sopas',
    calories: 185,
    protein: 12,
    carbs: 28,
    fats: 3,
    prepTime: 40,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    ingredients: ['Lentilha', 'Cenoura', 'Tomate', 'Cebola', 'Temperos'],
  },
  {
    id: 30,
    name: 'Canja de Frango Light',
    category: 'Sopas',
    calories: 165,
    protein: 18,
    carbs: 20,
    fats: 3,
    prepTime: 35,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    ingredients: ['Frango', 'Arroz integral', 'Cenoura', 'Batata', 'Hortelã'],
  },

  // SOBREMESAS LEVES
  {
    id: 31,
    name: 'Mousse de Maracujá Light',
    category: 'Sobremesas',
    calories: 95,
    protein: 8,
    carbs: 12,
    fats: 2,
    prepTime: 15,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    ingredients: ['Polpa maracujá', 'Iogurte grego', 'Gelatina incolor', 'Adoçante'],
  },
  {
    id: 32,
    name: 'Gelatina com Frutas',
    category: 'Sobremesas',
    calories: 65,
    protein: 4,
    carbs: 12,
    fats: 0.5,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    ingredients: ['Gelatina diet', 'Morangos', 'Kiwi', 'Uvas'],
  },
  {
    id: 33,
    name: 'Brigadeiro Fit',
    category: 'Sobremesas',
    calories: 85,
    protein: 6,
    carbs: 10,
    fats: 3,
    prepTime: 12,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    ingredients: ['Cacau em pó', 'Leite condensado zero', 'Creme de ricota', 'Granulado'],
  },
  {
    id: 34,
    name: 'Sorvete de Banana',
    category: 'Sobremesas',
    calories: 105,
    protein: 3,
    carbs: 24,
    fats: 1,
    prepTime: 5,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    ingredients: ['2 bananas congeladas', 'Cacau', 'Canela'],
  },
  {
    id: 35,
    name: 'Pudim de Chia',
    category: 'Sobremesas',
    calories: 125,
    protein: 6,
    carbs: 16,
    fats: 5,
    prepTime: 10,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop',
    ingredients: ['3 colheres chia', 'Leite vegetal', 'Frutas vermelhas', 'Mel'],
  },
  {
    id: 36,
    name: 'Bolo de Caneca Fit',
    category: 'Sobremesas',
    calories: 145,
    protein: 12,
    carbs: 18,
    fats: 4,
    prepTime: 5,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    ingredients: ['1 ovo', '2 colheres aveia', 'Cacau', 'Fermento', 'Adoçante'],
  },
  {
    id: 37,
    name: 'Paleta Mexicana de Frutas',
    category: 'Sobremesas',
    calories: 75,
    protein: 2,
    carbs: 16,
    fats: 0.5,
    prepTime: 8,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1557142046-c704a3afc913?w=400&h=300&fit=crop',
    ingredients: ['Morangos', 'Manga', 'Água de coco', 'Limão'],
  },
  {
    id: 38,
    name: 'Brownie Proteico',
    category: 'Sobremesas',
    calories: 165,
    protein: 15,
    carbs: 18,
    fats: 5,
    prepTime: 25,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    ingredients: ['Whey chocolate', 'Cacau', 'Banana', 'Ovos', 'Aveia'],
  },
  {
    id: 39,
    name: 'Pavê Light de Morango',
    category: 'Sobremesas',
    calories: 135,
    protein: 10,
    carbs: 18,
    fats: 3,
    prepTime: 20,
    difficulty: 'medium',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
    ingredients: ['Morangos', 'Iogurte grego', 'Biscoito integral', 'Gelatina'],
  },
  {
    id: 40,
    name: 'Cookies de Aveia',
    category: 'Sobremesas',
    calories: 115,
    protein: 6,
    carbs: 16,
    fats: 4,
    prepTime: 20,
    difficulty: 'easy',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    ingredients: ['Aveia', 'Banana', 'Pasta amendoim', 'Gotas chocolate 70%'],
  },
];

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todas', icon: Utensils },
    { value: 'Sucos Detox', label: 'Sucos', icon: Droplets },
    { value: 'Chás', label: 'Chás', icon: Coffee },
    { value: 'Saladas', label: 'Saladas', icon: Salad },
    { value: 'Pratos Nutritivos', label: 'Pratos', icon: ChefHat },
    { value: 'Lanches', label: 'Lanches', icon: Utensils },
    { value: 'Sopas', label: 'Sopas', icon: Soup },
    { value: 'Sobremesas', label: 'Sobremesas', icon: Cookie },
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] via-white to-[#E8F5E9]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#2A2A2A]">Emagrify</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">Voltar</Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white mb-4 px-4 py-2">
              🍽️ 40 Receitas para Emagrecimento
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2A2A2A] mb-4">
              Receitas Saudáveis e Deliciosas
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sucos detox, chás, saladas, pratos nutritivos, lanches rápidos, sopas e sobremesas leves
            </p>
          </div>

          {/* Search */}
          <Card className="border-none shadow-lg mb-8 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar receitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  className={
                    selectedCategory === cat.value
                      ? 'bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white border-none'
                      : 'bg-white hover:bg-gray-50'
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Recipes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="border-none shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105 bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={
                        recipe.difficulty === 'easy'
                          ? 'bg-[#7BE4B7] text-white'
                          : 'bg-[#FF7A00] text-white'
                      }
                    >
                      {recipe.difficulty === 'easy' ? 'Fácil' : 'Médio'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <Badge className="bg-white/90 text-[#2A2A2A] text-xs">
                      {recipe.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-[#2A2A2A] text-lg">{recipe.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {recipe.prepTime} min
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-gradient-to-br from-[#7BE4B7]/20 to-[#7BE4B7]/10 rounded-lg p-2">
                      <div className="text-sm font-bold text-[#7BE4B7]">{recipe.calories}</div>
                      <div className="text-xs text-gray-600">kcal</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#FF7A00]/20 to-[#FF7A00]/10 rounded-lg p-2">
                      <div className="text-sm font-bold text-[#FF7A00]">{recipe.protein}g</div>
                      <div className="text-xs text-gray-600">prot</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#6ECBF5]/20 to-[#6ECBF5]/10 rounded-lg p-2">
                      <div className="text-sm font-bold text-[#6ECBF5]">{recipe.carbs}g</div>
                      <div className="text-xs text-gray-600">carb</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#7BE4B7]/20 to-[#7BE4B7]/10 rounded-lg p-2">
                      <div className="text-sm font-bold text-[#7BE4B7]">{recipe.fats}g</div>
                      <div className="text-xs text-gray-600">gord</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#2A2A2A] mb-2 text-sm">Ingredientes:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                        <li key={idx}>• {ingredient}</li>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <li className="text-[#7BE4B7] font-medium">
                          + {recipe.ingredients.length - 3} mais...
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:shadow-lg transition-all">
                    Ver Receita
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">Nenhuma receita encontrada</p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 text-center">
            <Card className="border-none shadow-lg bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">
                  {filteredRecipes.length} Receitas Disponíveis
                </h3>
                <p className="text-white/90">
                  Todas focadas em emagrecimento saudável e sustentável
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
