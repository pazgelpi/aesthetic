'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2 } from 'lucide-react'

interface ToneData {
  formality_level: 'formal' | 'casual' | 'friendly'
  pronoun_usage: 'voseo' | 'tuteo' | 'usted'
  emoji_usage: 'none' | 'minimal' | 'moderate'
}
interface Props {
  data: ToneData
  onNext: (data: Partial<ToneData>) => void
  onBack: () => void
  saving: boolean
}

export function Step2Tone({ data, onNext, onBack, saving }: Props) {
  const [form, setForm] = useState(data)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tono de comunicación</CardTitle>
        <CardDescription>
          Definí cómo la AI va a hablarle a tus pacientes en cada mensaje.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">¿Cómo te dirigís a tus pacientes?</Label>
          <RadioGroup
            value={form.pronoun_usage}
            onValueChange={(v) => setForm({ ...form, pronoun_usage: v as ToneData['pronoun_usage'] })}
            className="space-y-2"
          >
            {[
              { value: 'voseo', label: 'De vos (voseo argentino)', desc: '"Hola Mariana, ¿cómo te sentís?"' },
              { value: 'tuteo', label: 'De tú (tuteo)', desc: '"Hola Mariana, ¿cómo te sientes?"' },
              { value: 'usted', label: 'De usted (formal)', desc: '"Hola Mariana, ¿cómo se siente usted?"' },
            ].map((opt) => (
              <div key={opt.value} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setForm({ ...form, pronoun_usage: opt.value as ToneData['pronoun_usage'] })}>
                <RadioGroupItem value={opt.value} id={`pronoun-${opt.value}`} className="mt-0.5" />
                <div>
                  <Label htmlFor={`pronoun-${opt.value}`} className="cursor-pointer font-medium">{opt.label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{opt.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Nivel de formalidad</Label>
          <RadioGroup
            value={form.formality_level}
            onValueChange={(v) => setForm({ ...form, formality_level: v as ToneData['formality_level'] })}
            className="space-y-2"
          >
            {[
              { value: 'formal', label: 'Formal y profesional', desc: 'Distancia clínica, terminología médica.' },
              { value: 'casual', label: 'Casual pero respetuoso', desc: 'Equilibrio entre cercanía y profesionalismo.' },
              { value: 'friendly', label: 'Cálido y cercano', desc: 'Como una amiga que entiende de estética.' },
            ].map((opt) => (
              <div key={opt.value} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setForm({ ...form, formality_level: opt.value as ToneData['formality_level'] })}>
                <RadioGroupItem value={opt.value} id={`formality-${opt.value}`} className="mt-0.5" />
                <div>
                  <Label htmlFor={`formality-${opt.value}`} className="cursor-pointer font-medium">{opt.label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Uso de emojis</Label>
          <RadioGroup
            value={form.emoji_usage}
            onValueChange={(v) => setForm({ ...form, emoji_usage: v as ToneData['emoji_usage'] })}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { value: 'none', label: 'Ninguno', example: 'Sin emojis' },
              { value: 'minimal', label: 'Mínimo', example: '1-2 ocasionales' },
              { value: 'moderate', label: 'Moderado', example: '1-3 por mensaje' },
            ].map((opt) => (
              <div key={opt.value}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-colors ${form.emoji_usage === opt.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setForm({ ...form, emoji_usage: opt.value as ToneData['emoji_usage'] })}>
                <RadioGroupItem value={opt.value} id={`emoji-${opt.value}`} className="sr-only" />
                <Label htmlFor={`emoji-${opt.value}`} className="cursor-pointer font-medium text-sm">{opt.label}</Label>
                <p className="text-xs text-muted-foreground">{opt.example}</p>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">← Atrás</Button>
          <Button onClick={() => onNext(form)} disabled={saving} className="flex-1">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Siguiente →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
