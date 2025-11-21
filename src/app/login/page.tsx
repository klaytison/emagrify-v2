"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Heart } from "lucide-react";

const ADMIN_EMAIL = "klaytsa3@gmail.com";
const LOGIN_TIMEOUT = 15000;

function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Agora usamos SOMENTE o supabase vindo do Provider
  const { supabase } = useSupabase();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Tempo limite excedido.");
      toast.error("Erro ao conectar");
    }, LOGIN_TIMEOUT);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      clearTimeout(timeoutId);

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        toast.error("Credenciais inválidas");
        return;
      }

      if (data.session && data.user) {
        toast.success("Login realizado!");

        // Registrar histórico
        await supabase.from("historico_acao").insert({
          user_id: data.user.id,
          tipo: "login",
          descricao: "Login realizado",
        });

        // Redirecionar baseado no email
        if (data.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setError("Erro ao conectar com o servidor.");
      toast.error("Erro inesperado");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7BE4B7]/10 via-white dark:via-[#2A2A2A] to-[#6ECBF5]/10 p-4">
      <Card className="w-full max-w-md border-[#F4F4F4] dark:border-gray-700 bg-white dark:bg-[#2A2A2A]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-[#2A2A2A] dark:text-white">
            Login
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Entre com suas credenciais
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required disabled={loading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required disabled={loading} />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white">
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm">
              <button type="button" onClick={() => router.push("/reset-password")} className="text-[#6ECBF5] hover:underline">
                Esqueceu a senha?
              </button>
              <br />
              <button type="button" onClick={() => router.push("/signup")} className="text-[#6ECBF5] hover:underline mt-2">
                Criar conta
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
