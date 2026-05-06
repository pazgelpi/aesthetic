'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Syringe,
  Settings,
  LogOut,
  MessageSquare,
  Sparkles,
  FolderUp,
} from 'lucide-react'
import { Clinic, Professional } from '@/types/database'
import { toast } from 'sonner'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/patients', icon: Users, label: 'Pacientes' },
  { href: '/treatments', icon: Syringe, label: 'Tratamientos' },
  { href: '/messages', icon: MessageSquare, label: 'Mensajes' },
  { href: '/import', icon: FolderUp, label: 'Importar historia' },
]

interface AppSidebarProps {
  clinic: Pick<Clinic, 'name' | 'id'>
  professional: Pick<Professional, 'full_name' | 'role'>
}

export function AppSidebar({ clinic, professional }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Sesión cerrada')
    router.push('/auth/login')
  }

  const initials = professional.full_name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-[var(--sidebar)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--sidebar-accent)] shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[var(--sidebar-foreground)] truncate leading-tight">
              {clinic.name}
            </p>
            <p className="text-[10px] text-[var(--sidebar-muted-foreground)] leading-tight">
              Aesthetic IQ
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--sidebar-muted-foreground)]">
          Menú
        </p>
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-[var(--sidebar-accent)] text-white'
                    : 'text-[var(--sidebar-muted-foreground)] hover:bg-[var(--sidebar-muted)] hover:text-[var(--sidebar-foreground)]'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[var(--sidebar-border)] space-y-0.5">
        <Link href="/settings/clinic">
          <div
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              pathname.startsWith('/settings')
                ? 'bg-[var(--sidebar-accent)] text-white'
                : 'text-[var(--sidebar-muted-foreground)] hover:bg-[var(--sidebar-muted)] hover:text-[var(--sidebar-foreground)]'
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            Configuración
          </div>
        </Link>

        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--sidebar-muted)] shrink-0">
            <span className="text-xs font-semibold text-[var(--sidebar-foreground)]">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--sidebar-foreground)] truncate">
              {professional.full_name}
            </p>
            <p className="text-[10px] text-[var(--sidebar-muted-foreground)] capitalize">
              {professional.role}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[var(--sidebar-muted-foreground)] hover:text-[var(--sidebar-foreground)] transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
