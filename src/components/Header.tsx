'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useSupabase } from '@/providers/SupabaseProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // 🔥 Agora usando SOMENTE o SupabaseProvider
  const { supabase, session, loading } = useSupabase()

  const user = session?.user ?? null
  const ADMIN_EMAIL = 'klaytsa3@gmail.com'

  useEffect(() => {
    setMounted(true)

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false)
  }

  const isAdmin = user?.email === ADMIN_EMAIL

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2A2A2A]/95 backdrop-blur-sm border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold">Emagrify</span>
            </div>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2A2A2A]/95 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          <button 
            onClick={() => handleNavigation('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold">Emagrify</span>
          </button>

          <div className="flex items-center gap-3">

            {/* TROCA DE TEMA */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun /> : <Moon />}
            </Button>

            {loading ? (
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full" />
            ) : user ? (
              <>
                {isAdmin && (
                  <Button onClick={() => handleNavigation('/admin')}>
                    Painel Admin
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-2 border-[#7BE4B7]">
                      <User className="text-[#7BE4B7]" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <div className="px-3 py-2 text-sm font-semibold">{user.email}</div>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => handleNavigation('/perfil')}>
                      <User className="w-4 h-4 mr-2" /> Meu Perfil
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleNavigation('/painel')}>
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Painel
                    </DropdownMenuItem>

                    {isAdmin && (
                      <DropdownMenuItem onClick={() => handleNavigation('/admin')}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Painel Admin
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigation('/login')}>
                  Entrar
                </Button>

                <Button onClick={() => handleNavigation('/checkout')}>
                  Assinar Agora
                </Button>
              </>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>

          </div>
        </div>
      </nav>
    </header>
  )
}
