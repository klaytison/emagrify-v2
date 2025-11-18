import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { addHistoryEntry } from '@/lib/actions/history'
import PainelClient from './painel-client'

export default async function PainelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Registrar acesso ao painel
  await addHistoryEntry('acesso_painel', 'Acessou o painel principal')

  return <PainelClient user={user} />
}
