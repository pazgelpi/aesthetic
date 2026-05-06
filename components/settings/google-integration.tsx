'use client'

import { useState, useTransition } from 'react'
import { Calendar, HardDrive, Mail, CheckCircle2, AlertCircle, Loader2, Unlink } from 'lucide-react'

interface Props {
  connected: boolean
  googleEmail?: string | null
}

const SERVICES = [
  {
    icon: Calendar,
    name: 'Google Calendar',
    desc: 'Crea eventos automáticos para tratamientos y re-tratamientos.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: HardDrive,
    name: 'Google Drive',
    desc: 'Exporta fotos e historias de progreso a carpetas organizadas.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Mail,
    name: 'Gmail',
    desc: 'Envía seguimientos por email, importa historia desde emails y envía reportes.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
]

export function GoogleIntegration({ connected, googleEmail }: Props) {
  const [isConnected, setIsConnected] = useState(connected)
  const [email, setEmail] = useState(googleEmail)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleDisconnect() {
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/auth/google/disconnect', { method: 'POST' })
      if (res.ok) {
        setIsConnected(false)
        setEmail(null)
      } else {
        setError('Error al desconectar. Intentá de nuevo.')
      }
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Google icon */}
          <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm shrink-0">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Ecosistema Google</h3>
            <p className="text-xs text-muted-foreground">Calendar · Drive · Gmail</p>
          </div>
        </div>

        {isConnected ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Conectado
          </div>
        ) : (
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0">
            Sin conectar
          </span>
        )}
      </div>

      {/* Services list */}
      <div className="space-y-3">
        {SERVICES.map(({ icon: Icon, name, desc, color, bg }) => (
          <div key={name} className="flex items-start gap-3">
            <div className={`shrink-0 w-8 h-8 rounded-lg ${bg} flex items-center justify-center mt-0.5`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold">{name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
            {isConnected && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1 ml-auto" />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Actions */}
      {isConnected ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Conectado como <span className="font-medium text-foreground">{email}</span>
          </p>
          <button
            onClick={handleDisconnect}
            disabled={isPending}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-rose-600 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}
            Desconectar cuenta de Google
          </button>
        </div>
      ) : (
        <a
          href="/api/auth/google/connect"
          className="flex items-center justify-center gap-2 w-full bg-foreground text-background text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Conectar con Google
        </a>
      )}
    </div>
  )
}
