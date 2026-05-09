'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function DemoBanner() {
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <div
      className="w-full flex items-center justify-between gap-3 px-4 py-2 text-xs font-medium shrink-0"
      style={{ background: 'oklch(0.97 0.008 90)', borderBottom: '1px solid oklch(0.90 0.015 90)' }}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          DEMO
        </span>
        <span className="text-muted-foreground">
          Estás viendo la demo de Aesthetic IQ · datos ficticios · sin efecto real
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="mailto:hola@aestheticiq.app?subject=Quiero%20una%20demo%20en%20vivo"
          className="hidden sm:inline-flex items-center gap-1.5 bg-[var(--sidebar)] text-white rounded-lg px-3 py-1 text-[11px] font-semibold hover:opacity-90 transition-opacity"
        >
          Pedir demo en vivo →
        </a>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
