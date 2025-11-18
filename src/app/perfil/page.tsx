import { getProfile } from '@/lib/actions/profile'
import { getHistory } from '@/lib/actions/history'
import { redirect } from 'next/navigation'
import ProfileClient from './profile-client'

export default async function PerfilPage() {
  const profile = await getProfile()
  
  if (!profile) {
    redirect('/login')
  }

  const history = await getHistory()

  return <ProfileClient profile={profile} history={history} />
}
