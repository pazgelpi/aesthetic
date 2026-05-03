'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface Props {
  data: { clinic_name: string; city: string; phone: string; primary_color: string; brand_story: string }
  onNext: (data: Partial<typeof props.data>) => void
  saving: boolean
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = {} as Props

export function Step1Branding({ data, onNext, saving }: Props) {
  const [form, setForm] = useState(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding básico</CardTitle>
        <CardDescription>
          Esta información aparece en los mensajes y en el portal de tus pacientes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="clinic_name">Nombre de la clínica *</Label>
          <Input
            id="clinic_name"
            value={form.clinic_name}
            onChange={(e) => setForm({ ...form, clinic_name: e.target.value })}
            placeholder="Clínica Estética García"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Buenos Aires"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono de contacto</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+54 11 ..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_story">¿Qué hace única a tu clínica? (2-3 frases)</Label>
          <Textarea
            id="brand_story"
            value={form.brand_story}
            onChange={(e) => setForm({ ...form, brand_story: e.target.value })}
            placeholder="En nuestra clínica priorizamos resultados naturales con técnica francesa, usando solo productos de primera línea. Acompañamos a cada paciente con seguimiento personalizado..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">La AI usa esto para dar contexto en cada mensaje.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary_color">Color de marca</Label>
          <div className="flex items-center gap-3">
            <input
              id="primary_color"
              type="color"
              value={form.primary_color}
              onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">{form.primary_color}</span>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={() => onNext(form)}
          disabled={!form.clinic_name || saving}
        >
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Siguiente →'}
        </Button>
      </CardContent>
    </Card>
  )
}
