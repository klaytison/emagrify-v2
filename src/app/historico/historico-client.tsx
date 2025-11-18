'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'

interface HistoricoClientProps {
  history: Array<{
    id: string
    tipo: string
    descricao: string
    created_at: string
  }>
}

export default function HistoricoClient({ history }: HistoricoClientProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/perfil'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Ações</h1>
        </div>

        {/* Histórico */}
        <Card>
          <CardHeader>
            <CardTitle>Todas as Atividades</CardTitle>
            <CardDescription>
              Registro completo de todas as suas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma atividade registrada ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          {item.tipo}
                        </span>
                      </div>
                      <p className="text-gray-600">{item.descricao}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 md:mt-0 text-sm text-gray-500">
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
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Ações</CardDescription>
              <CardTitle className="text-3xl">{history.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Primeira Ação</CardDescription>
              <CardTitle className="text-lg">
                {history.length > 0
                  ? new Date(history[history.length - 1].created_at).toLocaleDateString('pt-BR')
                  : '-'}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Última Ação</CardDescription>
              <CardTitle className="text-lg">
                {history.length > 0
                  ? new Date(history[0].created_at).toLocaleDateString('pt-BR')
                  : '-'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
