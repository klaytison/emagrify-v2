"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Trash2 } from "lucide-react";

export default function EditTreinoAdmin() {
  const { id } = useParams();
  const router = useRouter();
  const { supabase } = useSupabase();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [treino, setTreino] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState("");

  // 🔹 Carregar treino ao abrir a página
  useEffect(() => {
    async function loadWorkout() {
      const { data, error } = await supabase
        .from("workouts_catalog")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setTreino(data);
        setTitle(data.title);
        setCategory(data.category);
        setLevel(data.level);
        setDuration(data.duration);
        setCalories(data.calories);
        setImageUrl(data.image_url || "");
        setDescription(data.description || "");
        setExercises(data.exercises || "");
      }

      setLoading(false);
    }

    loadWorkout();
  }, [supabase, id]);

  // 🔹 Salvar alterações
  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("workouts_catalog")
      .update({
        title,
        category,
        level,
        duration: Number(duration),
        calories: Number(calories),
        image_url: imageUrl,
        description,
        exercises,
      })
      .eq("id", id);

    setSaving(false);

    if (!error) {
      alert("Treino atualizado com sucesso!");
      router.refresh();
    } else {
      alert("Erro ao salvar treino.");
    }
  }

  // 🔹 Excluir treino
  async function handleDelete() {
    const confirmDelete = confirm("Tem certeza que deseja excluir este treino?");
    if (!confirmDelete) return;

    setDeleting(true);

    const { error } = await supabase
      .from("workouts_catalog")
      .delete()
      .eq("id", id);

    setDeleting(false);

    if (!error) {
      alert("Treino excluído!");
      router.push("/admin");
    } else {
      alert("Erro ao excluir treino.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Editar Treino</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Título */}
            <div>
              <label className="text-sm text-gray-400">Título</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="text-sm text-gray-400">Categoria</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Nível */}
            <div>
              <label className="text-sm text-gray-400">Nível</label>
              <Input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Duração */}
            <div>
              <label className="text-sm text-gray-400">Duração (minutos)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Calorias */}
            <div>
              <label className="text-sm text-gray-400">Calorias estimadas</label>
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Imagem */}
            <div>
              <label className="text-sm text-gray-400">URL da Imagem</label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="text-sm text-gray-400">Descrição</label>
              <Textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Exercícios */}
            <div>
              <label className="text-sm text-gray-400">
                Exercícios (um por linha)
              </label>
              <Textarea
                rows={6}
                value={exercises}
                onChange={(e) => setExercises(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Botões */}
            <div className="flex justify-between pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {saving ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>

              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                {deleting ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
