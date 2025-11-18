'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  Calendar,
  ArrowLeft,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  photoUrl: string;
  notes?: string;
}

export default function MonitorProgresso() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    const savedEntries = localStorage.getItem('progressEntries');
    const savedTarget = localStorage.getItem('targetWeight');
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedTarget) {
      setTargetWeight(savedTarget);
    }
  }, []);

  // Salvar dados
  const saveData = (newEntries: ProgressEntry[], target?: string) => {
    localStorage.setItem('progressEntries', JSON.stringify(newEntries));
    if (target !== undefined) {
      localStorage.setItem('targetWeight', target);
    }
  };

  // Calcular estatísticas
  const calculateStats = () => {
    if (entries.length === 0) return null;

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    const totalWeightLoss = firstEntry.weight - lastEntry.weight;
    
    // Calcular tempo decorrido em meses
    const firstDate = new Date(firstEntry.date);
    const lastDate = new Date(lastEntry.date);
    const monthsDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    // Velocidade de perda de peso (kg/mês)
    const weightLossRate = monthsDiff > 0 ? totalWeightLoss / monthsDiff : 0;
    
    // Tempo estimado para atingir meta
    let estimatedMonths = 0;
    let estimatedDate = '';
    if (targetWeight && weightLossRate > 0) {
      const remainingWeight = lastEntry.weight - parseFloat(targetWeight);
      estimatedMonths = remainingWeight / weightLossRate;
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + Math.ceil(estimatedMonths));
      estimatedDate = futureDate.toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      });
    }

    return {
      totalWeightLoss,
      weightLossRate,
      estimatedMonths,
      estimatedDate,
      currentWeight: lastEntry.weight,
      startWeight: firstEntry.weight
    };
  };

  const stats = calculateStats();

  // Adicionar nova entrada
  const handleAddEntry = () => {
    if (!currentWeight || !photoPreview) {
      alert('Por favor, preencha o peso e adicione uma foto');
      return;
    }

    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: parseFloat(currentWeight),
      photoUrl: photoPreview,
      notes
    };

    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    saveData(newEntries, targetWeight);

    // Limpar formulário
    setCurrentWeight('');
    setPhotoPreview(null);
    setNotes('');
    setShowForm(false);
  };

  // Deletar entrada
  const handleDeleteEntry = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta entrada?')) {
      const newEntries = entries.filter(e => e.id !== id);
      setEntries(newEntries);
      saveData(newEntries);
    }
  };

  // Upload de foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvar meta de peso
  const handleSaveTarget = () => {
    saveData(entries, targetWeight);
    alert('Meta de peso salva com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7BE4B7]/10 via-white to-[#6ECBF5]/10">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#2A2A2A] hover:text-[#7BE4B7] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-[#2A2A2A]">Monitor de Progresso</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Meta de Peso */}
        <Card className="mb-8 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2A2A2A]">
              <Target className="w-6 h-6 text-[#7BE4B7]" />
              Defina sua Meta de Peso
            </CardTitle>
            <CardDescription>
              Configure seu peso alvo para calcular estimativas de progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="targetWeight">Peso Meta (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.0"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button 
                onClick={handleSaveTarget}
                className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90"
              >
                Salvar Meta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-lg bg-gradient-to-br from-[#7BE4B7]/10 to-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-[#7BE4B7]" />
                  Perda Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#7BE4B7]">
                  {stats.totalWeightLoss > 0 ? '-' : '+'}{Math.abs(stats.totalWeightLoss).toFixed(1)} kg
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  De {stats.startWeight.toFixed(1)}kg para {stats.currentWeight.toFixed(1)}kg
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-[#6ECBF5]/10 to-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#6ECBF5]" />
                  Velocidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#6ECBF5]">
                  {Math.abs(stats.weightLossRate).toFixed(2)} kg/mês
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.weightLossRate > 0 ? 'Perdendo' : 'Ganhando'} peso consistentemente
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-[#FF7A00]/10 to-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF7A00]" />
                  Tempo Estimado
                </CardTitle>
              </CardHeader>
              <CardContent>
                {targetWeight && stats.estimatedMonths > 0 ? (
                  <>
                    <div className="text-4xl font-bold text-[#FF7A00]">
                      {Math.ceil(stats.estimatedMonths)} meses
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Meta prevista para {stats.estimatedDate}
                    </p>
                  </>
                ) : (
                  <div className="text-sm text-gray-600">
                    Configure sua meta de peso para ver a estimativa
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Botão Adicionar Entrada */}
        {!showForm && (
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90"
            >
              <Camera className="w-5 h-5 mr-2" />
              Adicionar Nova Entrada
            </Button>
          </div>
        )}

        {/* Formulário de Nova Entrada */}
        {showForm && (
          <Card className="mb-8 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#2A2A2A]">Nova Entrada de Progresso</CardTitle>
              <CardDescription>
                Adicione uma foto e seu peso atual para acompanhar sua evolução
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload de Foto */}
              <div>
                <Label htmlFor="photo">Foto de Progresso</Label>
                <div className="mt-2">
                  {photoPreview ? (
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-full max-w-md mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setPhotoPreview(null)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Clique para fazer upload</span>
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Peso Atual */}
              <div>
                <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 75.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Notas Opcionais */}
              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  placeholder="Como você está se sentindo?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddEntry}
                  className="flex-1 bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Salvar Entrada
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setPhotoPreview(null);
                    setCurrentWeight('');
                    setNotes('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline de Entradas */}
        {entries.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhuma entrada ainda
              </h3>
              <p className="text-gray-500 mb-6">
                Comece a registrar seu progresso para acompanhar sua evolução
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90"
              >
                <Camera className="w-5 h-5 mr-2" />
                Adicionar Primeira Entrada
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2A2A2A] mb-4">
              Histórico de Progresso
            </h2>
            {[...entries]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry, index) => (
                <Card key={entry.id} className="border-none shadow-lg overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Foto */}
                    <div className="relative">
                      <img 
                        src={entry.photoUrl} 
                        alt={`Progresso ${entry.date}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-4 left-4 bg-[#7BE4B7] text-white">
                          Mais Recente
                        </Badge>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-[#6ECBF5]" />
                            <span className="text-lg font-semibold text-[#2A2A2A]">
                              {new Date(entry.date).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="text-4xl font-bold text-[#7BE4B7]">
                            {entry.weight.toFixed(1)} kg
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {entry.notes && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-gray-700">{entry.notes}</p>
                        </div>
                      )}

                      {/* Comparação com entrada anterior */}
                      {index < entries.length - 1 && (() => {
                        const previousEntry = [...entries]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[index + 1];
                        const diff = previousEntry.weight - entry.weight;
                        
                        return (
                          <div className="flex items-center gap-2">
                            {diff > 0 ? (
                              <>
                                <TrendingDown className="w-5 h-5 text-green-500" />
                                <span className="text-green-600 font-medium">
                                  -{diff.toFixed(1)} kg desde a última entrada
                                </span>
                              </>
                            ) : diff < 0 ? (
                              <>
                                <TrendingUp className="w-5 h-5 text-orange-500" />
                                <span className="text-orange-600 font-medium">
                                  +{Math.abs(diff).toFixed(1)} kg desde a última entrada
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-600">
                                Peso mantido desde a última entrada
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
