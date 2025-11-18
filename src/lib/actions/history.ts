'use server'

import { createClient } from '@/lib/supabase/server'

export async function getHistory() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('historico_acao')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }

  return data
}

export async function addHistoryEntry(tipo: string, descricao: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Não autenticado' }
  }

  const { error } = await supabase.from('historico_acao').insert({
    user_id: user.id,
    tipo,
    descricao,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
