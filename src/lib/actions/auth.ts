'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const ADMIN_EMAIL = 'klaytsa3@gmail.com'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nome = formData.get('nome') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    const { error: profileError } = await supabase
      .from('usuarios_perfil')
      .insert({
        user_id: authData.user.id,
        nome,
      })

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
    }

    await supabase.from('historico_acao').insert({
      user_id: authData.user.id,
      tipo: 'cadastro',
      descricao: 'Conta criada com sucesso',
    })

    revalidatePath('/', 'layout')
    return { success: true }
  }

  return { error: 'Erro ao criar conta' }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await supabase.from('historico_acao').insert({
      user_id: data.user.id,
      tipo: 'login',
      descricao: 'Login realizado',
    })

    revalidatePath('/', 'layout')
    
    if (data.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { success: true, redirect: '/admin' }
    }
    
    return { success: true, redirect: '/' }
  }

  return { error: 'Erro ao fazer login' }
}

export async function signOut() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    await supabase.from('historico_acao').insert({
      user_id: user.id,
      tipo: 'logout',
      descricao: 'Logout realizado',
    })
  }

  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/confirm`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { data: { user }, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (user) {
    await supabase.from('historico_acao').insert({
      user_id: user.id,
      tipo: 'senha_alterada',
      descricao: 'Senha alterada com sucesso',
    })
  }

  return { success: true }
}
