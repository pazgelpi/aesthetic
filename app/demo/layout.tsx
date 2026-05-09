import Link from 'next/link'
import { LayoutDashboard, Users, Syringe, Sparkles, Globe } from 'lucide-react'
import { DemoBanner } from '@/components/demo/demo-banner'
import { DEMO_CLINIC, DEMO_PROFESSIONAL } from '@/lib/demo/data'

const navItems = [
  { href: '/demo', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/demo/patients', icon: Users, label: 'Pacientes' },
  { href: '/demo/treatments', icon: Syringe, label: 'Tratamientos' },
  { href: '/demo/portal', icon: Globe, label: 'Portal paciente' },
]

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DemoBanner />
      <div className="flex flex-1 overflow-hidden">
        {/* Demo sidebar */}
        <aside className="flex flex-col w-60 shrink-0 bg-[var(--sidebar)]">
          <div className="px-5 py-5 border-b border-[var(--sidebar-border)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--sidebar-accent)] shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--sidebar-foreground)] truncate leading-tight">
                  {DEMO_CLINIC.name}
                </p>
                <p className="text-[10px] text-[var(--sidebar-foreground)]/40 truncate">Demo interactiva</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-[var(--sidebar-foreground)]/60 hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/20"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-[var(--sidebar-border)]">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-white">VR</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--sidebar-foreground)] truncate">{DEMO_PROFESSIONAL.full_name}</p>
                <p className="text-[10px] text-[var(--sidebar-foreground)]/40">Cuenta demo</p>
              </div>
            </div>
            <div className="mt-3 px-3">
              <a
                href="mailto:hola@aestheticiq.app?subject=Quiero%20una%20demo%20en%20vivo"
                className="block w-full text-center text-[11px] font-semibold text-white bg-violet-600 hover:bg-violet-700 py-2 rounded-xl transition-colors"
              >
                Pedir demo en vivo →
              </a>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
