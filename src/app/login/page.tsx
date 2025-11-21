"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Heart } from 'lucide-react'

const ADMIN_EMAIL = 'klaytsa3@gmail.com'
const LOGIN_TIMEOUT = 15000 // 15 segundos

function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const { refreshSession } = useAuth()

  useEffect(() => {
    // Limpar listeners ao desmontar
    return () => {
      setLoading(false)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Timeout para evitar loading infinito
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Tempo limite excedido. Verifique sua conexão e tente novamente.')
      toast.error('Erro ao conectar. Tente novamente.')
    }, LOGIN_TIMEOUT)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      clearTimeout(timeoutId)

      if (signInError) {
        console.error('Erro de autenticação:', signInError)
        setError(signInError.message || 'Erro ao fazer login')
        setLoading(false)
        toast.error('Credenciais inválidas')
        return
      }

      if (data.session && data.user) {
        // Login bem-sucedido
        console.log('Login bem-sucedido:', data.user.email)
        
        // Registrar no histórico
        try {
          await supabase.from('historico_acao').insert({
            user_id: data.user.id,
            tipo: 'login',
            descricao: 'Login realizado',
          })
        } catch (histError) {
          console.error('Erro ao registrar histórico:', histError)
        }

        // Aguardar um pouco para garantir que a sessão foi salva
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Atualizar contexto de autenticação
        await refreshSession()

        // Aguardar mais um pouco para garantir que o contexto foi atualizado
        await new Promise(resolve => setTimeout(resolve, 300))

        // Redirecionar baseado no email
        if (data.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          toast.success('Bem-vindo, Admin!')
          window.location.href = '/admin'
        } else {
          toast.success('Login realizado com sucesso!')
          window.location.href = '/'
        }
      } else {
        setError('Erro ao fazer login. Tente novamente.')
        setLoading(false)
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Erro inesperado no login:', err)
      setError('Erro ao conectar com o servidor. Tente novamente.')
      setLoading(false)
      toast.error('Erro ao conectar. Tente novamente.')
    }
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
          <CardTitle className="text-2xl text-[#2A2A2A] dark:text-white">Login</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#2A2A2A] dark:text-white">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                disabled={loading}
                className="border-[#F4F4F4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#2A2A2A] dark:text-white focus:border-[#7BE4B7] focus:ring-[#7BE4B7]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#2A2A2A] dark:text-white">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Sua senha"
                disabled={loading}
                className="border-[#F4F4F4] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#2A2A2A] dark:text-white focus:border-[#7BE4B7] focus:ring-[#7BE4B7]"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90 transition-opacity" 
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="flex flex-col gap-2 text-center text-sm">
              <button
                type="button"
                onClick={() => router.push('/reset-password')}
                className="text-[#6ECBF5] hover:text-[#7BE4B7] hover:underline transition-colors"
                disabled={loading}
              >
                Esqueceu a senha?
              </button>
              <div className="text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/signup')}
                  className="text-[#6ECBF5] hover:text-[#7BE4B7] hover:underline transition-colors"
                  disabled={loading}
                >
                  Criar conta
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
