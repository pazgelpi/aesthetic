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

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    clinic_name: '',
    professional_name: '',
    city: '',
    phone: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('No autenticado')

      // Generate clinic ID client-side to avoid RLS SELECT check on INSERT...RETURNING
      const clinicId = crypto.randomUUID()

      // 1. Create clinic (no .select() to avoid the SELECT RLS check before professional exists)
      const { error: clinicError } = await supabase
        .from('clinics')
        .insert({
          id: clinicId,
          name: form.clinic_name,
          owner_email: user.email!,
          city: form.city || null,
          phone: form.phone || null,
        })

      if (clinicError) throw clinicError

      // 2. Create professional (owner)
      const { error: profError } = await supabase
        .from('professionals')
        .insert({
          clinic_id: clinicId,
          user_id: user.id,
          full_name: form.professional_name,
          role: 'owner',
        })

      if (profError) throw profError

      // 3. Create empty clinic profile (wizard_step = 0)
      const { error: profileError } = await supabase
        .from('clinic_profiles')
        .insert({
          clinic_id: clinicId,
          formality_level: 'friendly',
          pronoun_usage: 'voseo',
          emoji_usage: 'minimal',
          wizard_step: 0,
        })

      if (profileError) throw profileError

      toast.success('¡Clínica creada! Ahora configurá tu perfil.')
      router.push('/settings/clinic')
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Error al crear la clínica')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4">
            A
          </div>
          <h1 className="text-2xl font-bold">¡Bienvenida a Aesthetic IQ!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Primero, contanos un poco de tu clínica.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Datos básicos</CardTitle>
            <CardDescription>
              Podés editar todo esto después desde configuración.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic_name">Nombre de la clínica *</Label>
                <Input
                  id="clinic_name"
                  placeholder="Clínica Estética García"
                  value={form.clinic_name}
                  onChange={(e) => setForm({ ...form, clinic_name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professional_name">Tu nombre completo *</Label>
                <Input
                  id="professional_name"
                  placeholder="Dra. María García"
                  value={form.professional_name}
                  onChange={(e) => setForm({ ...form, professional_name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    placeholder="Buenos Aires"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+54 11 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Continuar →'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
