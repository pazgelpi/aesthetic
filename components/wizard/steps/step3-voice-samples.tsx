'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Info } from 'lucide-react'

interface Props {
  data: { voice_sample_1: string; voice_sample_2: string; voice_sample_3: string }
  onNext: (data: Partial<typeof props.data>) => void
  onBack: () => void
  saving: boolean
}
const props = {} as Props

export function Step3VoiceSamples({ data, onNext, onBack, saving }: Props) {
  const [form, setForm] = useState(data)

  const allValid = [form.voice_sample_1, form.voice_sample_2, form.voice_sample_3]
    .every((s) => s.trim().length >= 30)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Muestras de tu voz</CardTitle>
        <CardDescription>
          Pegá 3 mensajes reales que le hayas mandado a una paciente. La AI va a aprender tu estilo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>
            Podés copiar mensajes de WhatsApp directamente. No importa si mencionan nombres de
            pacientes — solo usamos el estilo de escritura, no el contenido personal.
          </p>
        </div>

        {([
          { key: 'voice_sample_1', label: 'Mensaje 1', placeholder: 'Ej: "Hola! Ya pasaron 5 días de tu sesión. Recordá no tocarte la zona tratada y usar SPF todos los días 🌸 Cualquier cosita me avisás!"' },
          { key: 'voice_sample_2', label: 'Mensaje 2', placeholder: 'Ej: "Mariana! Tu toxina está en su mejor momento ahora. Si notás algo raro en la simetría, escribime. Sino nos vemos en 4 meses. Caro"' },
          { key: 'voice_sample_3', label: 'Mensaje 3', placeholder: 'Ej: "Llegó el verano y hay que doblar el cuidado del SPF ☀️ Si querés un turno para retoque, esta semana tengo disponibilidad"' },
        ] as const).map((item) => (
          <div key={item.key} className="space-y-2">
            <Label htmlFor={item.key}>{item.label} *</Label>
            <Textarea
              id={item.key}
              value={form[item.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [item.key]: e.target.value })}
              placeholder={item.placeholder}
              rows={3}
            />
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">Mínimo 30 caracteres</p>
              <p className={`text-xs ${form[item.key as keyof typeof form].trim().length >= 30 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {form[item.key as keyof typeof form].trim().length} caracteres
              </p>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">← Atrás</Button>
          <Button onClick={() => onNext(form)} disabled={!allValid || saving} className="flex-1">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Siguiente →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
