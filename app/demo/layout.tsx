import Link from 'next/link'
import { LayoutDashboard, Users, Syringe, Globe, MessageCircle, Package } from 'lucide-react'
import { DemoBanner } from '@/components/demo/demo-banner'
import { DEMO_CLINIC, DEMO_PROFESSIONAL } from '@/lib/demo/data'

const navItems = [
  { href: '/demo', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/demo/patients', icon: Users, label: 'Pacientes' },
  { href: '/demo/treatments', icon: Syringe, label: 'Tratamientos' },
  { href: '/demo/stock', icon: Package, label: 'Stock' },
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
              {/* Logo mark — terracota */}
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                style={{ background: 'var(--terracota)' }}
              >
                <span
                  className="text-white font-normal leading-none"
                  style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontSize: 18 }}
                >
                  æ
                </span>
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm text-[var(--sidebar-foreground)] truncate leading-tight"
                  style={{ fontFamily: 'var(--font-instrument-serif)' }}
                >
                  {DEMO_CLINIC.name}
                </p>
                <p
                  className="truncate"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(251,248,242,0.35)',
                  }}
                >
                  Demo interactiva
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-[var(--sidebar-foreground)]/60 hover:text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/20"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-[var(--sidebar-border)] space-y-3">
            {/* WhatsApp connection status */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-emerald-400 leading-tight">WhatsApp conectado</p>
                <p className="text-[9px] leading-tight" style={{ color: 'rgba(34,197,94,0.5)' }}>+54 11 4455-6677</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            </div>

            {/* Professional info */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--champagne)' }}
              >
                <span
                  className="text-sm leading-none"
                  style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', color: 'var(--ink)' }}
                >
                  v
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--sidebar-foreground)] truncate">{DEMO_PROFESSIONAL.full_name}</p>
                <p className="text-[10px] text-[var(--sidebar-foreground)]/40">Cuenta demo</p>
              </div>
            </div>

            <div className="px-3">
              <a
                href="mailto:hola@aestheticiq.app?subject=Quiero%20una%20demo%20en%20vivo"
                className="block w-full text-center text-[11px] font-semibold text-white py-2 rounded-lg transition-colors bg-[#b5704f] hover:bg-[#8a4f33]"
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
