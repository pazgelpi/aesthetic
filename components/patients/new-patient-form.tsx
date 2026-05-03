'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { formatPhone } from '@/lib/utils'

export function NewPatientForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    first_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    notes: '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consentChecked) {
      toast.error('El consentimiento informado es obligatorio.')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data: professional } = await supabase
        .from('professionals')
        .select('clinic_id')
        .eq('user_id', user.id)
        .single()
      if (!professional) throw new Error('Profesional no encontrado')

      const { data: patient, error } = await supabase
        .from('patients')
        .insert({
          clinic_id: professional.clinic_id,
          full_name: form.full_name,
          first_name: form.first_name || form.full_name.split(' ')[0],
          email: form.email || null,
          phone_e164: formatPhone(form.phone),
          date_of_birth: form.date_of_birth || null,
          notes: form.notes || null,
          consent_given_at: new Date().toISOString(),
          status: 'active',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Paciente registrada correctamente.')
      router.push(`/patients/${patient.id}`)
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo *</Label>
              <Input
                id="full_name"
                placeholder="María González"
                value={form.full_name}
                onChange={(e) => set('full_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">Primer nombre (para mensajes)</Label>
              <Input
                id="first_name"
                placeholder="María"
                value={form.first_name}
                onChange={(e) => set('first_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp (con código país) *</Label>
              <Input
                id="phone"
                placeholder="+5491123456789"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Ej: +5491123456789</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="maria@email.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Fecha de nacimiento</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={(e) => set('date_of_birth', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas clínicas</Label>
            <Textarea
              id="notes"
              placeholder="Antecedentes, alergias, preferencias..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Consentimiento informado */}
          <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
            <h3 className="font-medium text-sm">Consentimiento informado</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              La paciente autoriza a la clínica a: (1) registrar y procesar datos personales y de
              salud con fines clínicos; (2) tomar fotografías antes y después del tratamiento para
              seguimiento médico; (3) recibir comunicaciones vía WhatsApp relacionadas con su
              tratamiento. Los datos se almacenan de forma segura y no se comparten con terceros.
              Conforme a la Ley de Habeas Data Argentina (Ley 25.326).
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="consent"
                checked={consentChecked}
                onCheckedChange={(v) => setConsentChecked(!!v)}
              />
              <Label htmlFor="consent" className="text-sm cursor-pointer">
                La paciente otorgó consentimiento informado verbalmente / por escrito
              </Label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !consentChecked}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
              ) : (
                'Registrar paciente'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
