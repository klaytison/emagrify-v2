'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import { signOut } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, LogOut, History } from 'lucide-react'

interface ProfileClientProps {
  profile: {
    nome: string | null
    foto: string | null
    bio: string | null
    email: string | undefined
  }
  history: Array<{
    id: string
    tipo: string
    descricao: string
    created_at: string
  }>
}

export default function ProfileClient({ profile, history }: ProfileClientProps) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    if (result?.success) {
      setSuccess(true)
      setEditing(false)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/historico'}
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/painel'}
            >
              Painel
            </Button>
            <Button
              variant="destructive"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Perfil Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.foto || undefined} />
                <AvatarFallback>
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.nome || 'Sem nome'}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-500">Bio</Label>
                  <p className="mt-1">{profile.bio || 'Nenhuma bio adicionada'}</p>
                </div>
                <Button onClick={() => setEditing(true)}>
                  Editar Perfil
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    name="nome"
                    defaultValue={profile.nome || ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foto">URL da Foto</Label>
                  <Input
                    id="foto"
                    name="foto"
                    type="url"
                    defaultValue={profile.foto || ''}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile.bio || ''}
                    rows={4}
                  />
                </div>
                {success && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    Perfil atualizado com sucesso!
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Histórico Recente */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas 5 ações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-gray-500">Nenhuma atividade registrada</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.tipo}</p>
                      <p className="text-sm text-gray-600">{item.descricao}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {history.length > 5 && (
              <Button
                variant="link"
                onClick={() => window.location.href = '/historico'}
                className="mt-4"
              >
                Ver histórico completo
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
