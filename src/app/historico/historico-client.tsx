'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Tag } from 'lucide-react'
import Header from '@/components/Header'

interface HistoricoClientProps {
  history: Array<{
    id: string
    tipo: string
    descricao: string
    created_at: string
  }>
}

export default function HistoricoClient({ history }: HistoricoClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Histórico de Ações</h1>
          </div>

          {/* Histórico */}
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Todas as Atividades</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Registro completo de todas as suas ações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma atividade registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.tipo}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{item.descricao}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-3 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(item.created_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-gray-400">Total de Ações</CardDescription>
                <CardTitle className="text-3xl dark:text-white">{history.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-gray-400">Primeira Ação</CardDescription>
                <CardTitle className="text-lg dark:text-white">
                  {history.length > 0
                    ? new Date(history[history.length - 1].created_at).toLocaleDateString('pt-BR')
                    : '-'}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-gray-400">Última Ação</CardDescription>
                <CardTitle className="text-lg dark:text-white">
                  {history.length > 0
                    ? new Date(history[0].created_at).toLocaleDateString('pt-BR')
                    : '-'}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
