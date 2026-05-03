'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [mode, setMode] = useState<'magic' | 'password'>('magic')
  const supabase = createClient()

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) { toast.error('Error: ' + error.message); return }
    setSent(true)
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setLoading(false); toast.error('Email o contraseña incorrectos'); return }
    // Check if onboarding is needed
    if (data.user) {
      const { data: prof } = await supabase.from('professionals').select('clinic_id').eq('user_id', data.user.id).single()
      if (!prof) { router.push('/onboarding'); return }
      const { data: profile } = await supabase.from('clinic_profiles').select('wizard_completed_at').eq('clinic_id', prof.clinic_id).single()
      if (!profile?.wizard_completed_at) { router.push('/settings/clinic'); return }
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4">
            A
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Aesthetic IQ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema operativo de relación clínica-paciente
          </p>
        </div>

        <Card className="shadow-lg">
          {!sent ? (
            <>
              <CardHeader>
                <CardTitle>Ingresá a tu cuenta</CardTitle>
                <CardDescription>
                  {mode === 'magic'
                    ? 'Te enviamos un link mágico a tu email — sin contraseñas.'
                    : 'Ingresá con tu email y contraseña.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mode === 'magic' ? (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email profesional</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="dra.garcia@clinica.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</> : 'Recibir link de acceso'}
                    </Button>
                    <button type="button" onClick={() => setMode('password')} className="w-full text-xs text-muted-foreground hover:underline text-center">
                      Prefiero ingresar con contraseña
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handlePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email2">Email</Label>
                      <Input
                        id="email2"
                        type="email"
                        placeholder="dra.garcia@clinica.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ingresando...</> : 'Ingresar'}
                    </Button>
                    <button type="button" onClick={() => setMode('magic')} className="w-full text-xs text-muted-foreground hover:underline text-center">
                      Volver a magic link
                    </button>
                  </form>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="py-8 text-center space-y-4">
              <div className="text-4xl">✉️</div>
              <div>
                <h3 className="font-semibold text-lg">Revisá tu email</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Enviamos un link de acceso a{' '}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">El link expira en 10 minutos.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>Volver</Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
