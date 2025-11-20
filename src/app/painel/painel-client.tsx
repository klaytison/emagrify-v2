'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/Header'
import { User, History, LayoutDashboard } from 'lucide-react'

interface PainelClientProps {
  user: {
    id: string
    email?: string
  }
}

export default function PainelClient({ user }: PainelClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel Principal</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Bem-vindo, {user.email}</p>
          </div>

          {/* Cards de Navegação */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800" onClick={() => router.push('/perfil')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">Meu Perfil</CardTitle>
                    <CardDescription className="dark:text-gray-400">Ver e editar informações</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gerencie suas informações pessoais, foto e biografia
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800" onClick={() => router.push('/historico')}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <History className="w-6 h-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">Histórico</CardTitle>
                    <CardDescription className="dark:text-gray-400">Suas atividades</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Veja o registro completo de todas as suas ações no sistema
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <LayoutDashboard className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">Dashboard</CardTitle>
                    <CardDescription className="dark:text-gray-400">Visão geral</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Estatísticas e resumo das suas atividades
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Informações do Sistema */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Sobre o Sistema</CardTitle>
              <CardDescription className="dark:text-gray-400">Sistema de autenticação com Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Funcionalidades</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>✓ Autenticação segura</li>
                    <li>✓ Gerenciamento de perfil</li>
                    <li>✓ Histórico de ações</li>
                    <li>✓ Recuperação de senha</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Segurança</h3>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>✓ Row Level Security (RLS)</li>
                    <li>✓ Proteção de rotas</li>
                    <li>✓ Sessões seguras</li>
                    <li>✓ Dados criptografados</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
