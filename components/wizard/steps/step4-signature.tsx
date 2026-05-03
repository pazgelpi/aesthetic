'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface Props {
  data: { signature_template: string }
  clinicName: string
  professionalName: string
  onNext: (data: { signature_template: string }) => void
  onBack: () => void
  saving: boolean
}

export function Step4Signature({ data, clinicName, professionalName, onNext, onBack, saving }: Props) {
  const [signature, setSignature] = useState(data.signature_template)

  const firstName = professionalName.split(' ')[0]
  const preview = signature
    .replace('{professional_first_name}', firstName)
    .replace('{clinic_name}', clinicName)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firma de mensajes</CardTitle>
        <CardDescription>
          Cada mensaje termina con esta firma. Usá las variables para que sea dinámica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="signature">Plantilla de firma</Label>
          <Input
            id="signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Soy {professional_first_name} de {clinic_name}"
          />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Variables disponibles:</p>
            <p><code className="bg-muted px-1 rounded">{'{professional_first_name}'}</code> → {firstName}</p>
            <p><code className="bg-muted px-1 rounded">{'{clinic_name}'}</code> → {clinicName}</p>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vista previa del mensaje</p>
          <div className="bg-white rounded-lg p-3 text-sm shadow-sm border">
            <p className="text-muted-foreground">Hola Mariana 🌸 Ya van 5 días de tu sesión...</p>
            <p className="mt-2 text-foreground font-medium">{preview}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Ejemplos de firmas:</p>
          <div className="flex flex-wrap gap-2">
            {[
              `Soy {professional_first_name} de {clinic_name}`,
              `Con cariño, {professional_first_name} ❤️`,
              `Un abrazo, {professional_first_name} — {clinic_name}`,
            ].map((s) => (
              <button
                key={s}
                onClick={() => setSignature(s)}
                className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">← Atrás</Button>
          <Button onClick={() => onNext({ signature_template: signature })} disabled={!signature || saving} className="flex-1">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Siguiente →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
