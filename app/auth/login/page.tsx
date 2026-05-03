'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      toast.error('Error al enviar el link: ' + error.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
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
                  Te enviamos un link mágico a tu email — sin contraseñas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Recibir link de acceso'
                    )}
                  </Button>
                </form>
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
                <p className="text-xs text-muted-foreground mt-1">
                  El link expira en 10 minutos.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSent(false)}
              >
                Volver
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
