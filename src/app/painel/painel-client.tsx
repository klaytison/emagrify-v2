'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signOut } from '@/lib/actions/auth'
import { User, History, LogOut, LayoutDashboard } from 'lucide-react'

interface PainelClientProps {
  user: {
    id: string
    email?: string
  }
}

export default function PainelClient({ user }: PainelClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Principal</h1>
            <p className="text-gray-600 mt-1">Bem-vindo, {user.email}</p>
          </div>
          <Button variant="destructive" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/perfil'}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Meu Perfil</CardTitle>
                  <CardDescription>Ver e editar informações</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Gerencie suas informações pessoais, foto e biografia
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/historico'}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <History className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Histórico</CardTitle>
                  <CardDescription>Suas atividades</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Veja o registro completo de todas as suas ações no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <LayoutDashboard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>Visão geral</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Estatísticas e resumo das suas atividades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre o Sistema</CardTitle>
            <CardDescription>Sistema de autenticação com Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Funcionalidades</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Autenticação segura</li>
                  <li>✓ Gerenciamento de perfil</li>
                  <li>✓ Histórico de ações</li>
                  <li>✓ Recuperação de senha</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Segurança</h3>
                <ul className="text-sm text-green-700 space-y-1">
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
  )
}
