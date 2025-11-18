'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Não autenticado' }
  }

  const nome = formData.get('nome') as string
  const foto = formData.get('foto') as string
  const bio = formData.get('bio') as string

  const { error } = await supabase
    .from('usuarios_perfil')
    .update({
      nome,
      foto,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Registrar no histórico
  await supabase.from('historico_acao').insert({
    user_id: user.id,
    tipo: 'perfil_atualizado',
    descricao: 'Perfil atualizado com sucesso',
  })

  revalidatePath('/perfil')
  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('usuarios_perfil')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }

  return { ...data, email: user.email }
}
