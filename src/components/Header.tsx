'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useSupabase
 } from '@/context/AuthContext'
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
  const { user, loading, signOut } = useSupabase
()

  const ADMIN_EMAIL = 'klaytsa3@gmail.com'

  useEffect(() => {
    setMounted(true)
    
    // Carregar preferência de tema
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Log para debug - ver quando o user muda
  useEffect(() => {
    console.log('Header - User changed:', user?.email, 'Loading:', loading)
  }, [user, loading])

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
    await signOut()
    window.location.href = '/'
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false)
  }

  const isAdmin = user?.email === ADMIN_EMAIL

  // Previne hidratação até que o componente esteja montado no cliente
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2A2A2A]/95 backdrop-blur-sm border-b border-[#F4F4F4] dark:border-gray-700">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold text-[#2A2A2A] dark:text-white">Emagrify</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#2A2A2A] dark:text-gray-300"
                aria-label="Alternar tema"
                disabled
              >
                <Moon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#2A2A2A]/95 backdrop-blur-sm border-b border-[#F4F4F4] dark:border-gray-700">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => handleNavigation('/')} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7BE4B7] to-[#6ECBF5] flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-[#2A2A2A] dark:text-white">Emagrify</span>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Botão de Trocar Tema */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] hover:bg-[#7BE4B7]/10 transition-colors"
              aria-label="Alternar tema"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Renderizar baseado no estado de loading e user */}
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-[#F4F4F4] dark:bg-gray-700 animate-pulse" />
            ) : user ? (
              // Estado logado (comum ou admin)
              <>
                {isAdmin && (
                  <Button 
                    className="bg-gradient-to-r from-[#FF7A00] to-[#7BE4B7] text-white hover:opacity-90 hidden md:inline-flex transition-opacity"
                    onClick={() => handleNavigation('/admin')}
                  >
                    Painel Admin
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full border-2 border-[#7BE4B7] hover:bg-[#7BE4B7]/10 transition-colors"
                    >
                      <User className="w-5 h-5 text-[#7BE4B7]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#2A2A2A] border-[#F4F4F4] dark:border-gray-700">
                    <div className="px-2 py-1.5 text-sm font-semibold text-[#2A2A2A] dark:text-white">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator className="bg-[#F4F4F4] dark:bg-gray-700" />
                    <DropdownMenuItem onClick={() => handleNavigation('/perfil')} className="text-[#2A2A2A] dark:text-white hover:bg-[#7BE4B7]/10">
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/painel')} className="text-[#2A2A2A] dark:text-white hover:bg-[#7BE4B7]/10">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Painel
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => handleNavigation('/admin')} className="text-[#FF7A00] dark:text-[#FF7A00] hover:bg-[#FF7A00]/10">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Painel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-[#F4F4F4] dark:bg-gray-700" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Estado NÃO logado
              <>
                <Button 
                  variant="ghost" 
                  className="text-[#2A2A2A] dark:text-gray-300 hidden md:inline-flex hover:text-[#7BE4B7] transition-colors"
                  onClick={() => handleNavigation('/login')}
                >
                  Entrar
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#7BE4B7] to-[#6ECBF5] text-white hover:opacity-90 hidden md:inline-flex transition-opacity"
                  onClick={() => handleNavigation('/checkout')}
                >
                  Assinar Agora
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#2A2A2A] dark:text-gray-300 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Carregando...</div>
            ) : user ? (
              <>
                <button 
                  onClick={() => {
                    handleNavigation('/perfil')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] transition-colors"
                >
                  Meu Perfil
                </button>
                <button 
                  onClick={() => {
                    handleNavigation('/painel')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] transition-colors"
                >
                  Painel
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => {
                      handleNavigation('/admin')
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-[#FF7A00] font-semibold hover:opacity-80 transition-opacity"
                  >
                    Painel Admin
                  </button>
                )}
                <button 
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-red-600 font-semibold hover:opacity-80 transition-opacity"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    handleNavigation('/login')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-[#2A2A2A] dark:text-gray-300 hover:text-[#7BE4B7] transition-colors"
                >
                  Entrar
                </button>
                <button 
                  onClick={() => {
                    handleNavigation('/checkout')
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-[#7BE4B7] font-semibold hover:opacity-80 transition-opacity"
                >
                  Assinar Agora
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
