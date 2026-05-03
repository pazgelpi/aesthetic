'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClinicProtocol } from '@/types/database'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const DEFAULT_AREAS = {
  toxin: ['Frontal', 'Glabela', 'Patas de gallo', 'Bunny lines', 'Labio superior', 'Mentón', 'Platisma'],
  filler: ['Labios', 'Surcos nasogenianos', 'Pómulos', 'Ángulo mandibular', 'Ojeras', 'Mentón', 'Sienes'],
}

interface Props {
  clinicId: string
  protocols: ClinicProtocol[]
  onNext: () => void
  onBack: () => void
  saving: boolean
}

function emptyProtocol(type: 'toxin' | 'filler'): Partial<ClinicProtocol> {
  return {
    treatment_type: type,
    default_re_treatment_days: type === 'toxin' ? 120 : 240,
    preferred_brands: [],
    typical_areas: [],
    contraindications: [],
    pre_treatment_instructions: '',
    post_treatment_immediate: '',
    post_treatment_week: '',
    post_treatment_long_term: '',
    recommended_products: '',
    patient_education_text: '',
  }
}

export function Step5Protocols({ clinicId, protocols, onNext, onBack, saving: parentSaving }: Props) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)

  const existingToxin = protocols.find((p) => p.treatment_type === 'toxin')
  const existingFiller = protocols.find((p) => p.treatment_type === 'filler')

  const [toxin, setToxin] = useState<Partial<ClinicProtocol>>(existingToxin ?? emptyProtocol('toxin'))
  const [filler, setFiller] = useState<Partial<ClinicProtocol>>(existingFiller ?? emptyProtocol('filler'))

  function toggleArea(type: 'toxin' | 'filler', area: string) {
    if (type === 'toxin') {
      const areas = toxin.typical_areas ?? []
      setToxin({ ...toxin, typical_areas: areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area] })
    } else {
      const areas = filler.typical_areas ?? []
      setFiller({ ...filler, typical_areas: areas.includes(area) ? areas.filter((a) => a !== area) : [...areas, area] })
    }
  }

  async function saveProtocols() {
    setSaving(true)
    try {
      for (const [proto, type] of [[toxin, 'toxin'], [filler, 'filler']] as const) {
        const upsertData = {
          clinic_id: clinicId,
          treatment_type: type,
          default_re_treatment_days: proto.default_re_treatment_days ?? (type === 'toxin' ? 120 : 240),
          preferred_brands: proto.preferred_brands,
          typical_areas: proto.typical_areas,
          contraindications: proto.contraindications,
          pre_treatment_instructions: proto.pre_treatment_instructions,
          post_treatment_immediate: proto.post_treatment_immediate,
          post_treatment_week: proto.post_treatment_week,
          post_treatment_long_term: proto.post_treatment_long_term,
          recommended_products: proto.recommended_products,
          patient_education_text: proto.patient_education_text,
        }
        const { error } = await supabase.from('clinic_protocols').upsert(upsertData, { onConflict: 'clinic_id,treatment_type' })
        if (error) throw error
      }
      toast.success('Protocolos guardados')
      onNext()
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocolos de tratamiento</CardTitle>
        <CardDescription>
          Configurá los parámetros de cada tipo de tratamiento. La AI los usa para personalizar indicaciones y mensajes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="toxin">
          <TabsList className="w-full mb-5">
            <TabsTrigger value="toxin" className="flex-1">Toxina Botulínica</TabsTrigger>
            <TabsTrigger value="filler" className="flex-1">Filler Facial</TabsTrigger>
          </TabsList>

          {(['toxin', 'filler'] as const).map((type) => {
            const proto = type === 'toxin' ? toxin : filler
            const setProto = type === 'toxin' ? setToxin : setFiller
            return (
              <TabsContent key={type} value={type} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Marcas que usás</Label>
                    <Input
                      value={(proto.preferred_brands ?? []).join(', ')}
                      onChange={(e) => setProto({ ...proto, preferred_brands: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                      placeholder={type === 'toxin' ? 'Botox, Dysport, Xeomin' : 'Juvederm, Restylane, Stylage'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Días entre retratamientos</Label>
                    <Input
                      type="number"
                      value={proto.default_re_treatment_days}
                      onChange={(e) => setProto({ ...proto, default_re_treatment_days: Number(e.target.value) })}
                      min={30} max={365}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Áreas que tratás</Label>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_AREAS[type].map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArea(type, area)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          (proto.typical_areas ?? []).includes(area)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instrucciones pre-tratamiento</Label>
                  <Textarea value={proto.pre_treatment_instructions ?? ''} onChange={(e) => setProto({ ...proto, pre_treatment_instructions: e.target.value })} rows={2} placeholder="No consumir alcohol 48h antes, evitar medicación anticoagulante..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Post-tratamiento inmediato (0-3 días)</Label>
                    <Textarea value={proto.post_treatment_immediate ?? ''} onChange={(e) => setProto({ ...proto, post_treatment_immediate: e.target.value })} rows={2} placeholder="No masajear zona, aplicar frío si hay hematoma..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Primera semana</Label>
                    <Textarea value={proto.post_treatment_week ?? ''} onChange={(e) => setProto({ ...proto, post_treatment_week: e.target.value })} rows={2} placeholder="SPF 50 diario, evitar sol directo..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Mantenimiento a largo plazo</Label>
                  <Textarea value={proto.post_treatment_long_term ?? ''} onChange={(e) => setProto({ ...proto, post_treatment_long_term: e.target.value })} rows={2} placeholder="Rutina de skincare recomendada, frecuencia de retratamientos..." />
                </div>
                <div className="space-y-2">
                  <Label>Productos que recomendás</Label>
                  <Textarea value={proto.recommended_products ?? ''} onChange={(e) => setProto({ ...proto, recommended_products: e.target.value })} rows={2} placeholder="Isdin FotoUltra 50+, vitamina C Skinceuticals..." />
                </div>
                <div className="space-y-2">
                  <Label>Texto de educación al paciente</Label>
                  <Textarea value={proto.patient_education_text ?? ''} onChange={(e) => setProto({ ...proto, patient_education_text: e.target.value })} rows={3} placeholder="Explicación sencilla del tratamiento para la paciente..." />
                </div>
              </TabsContent>
            )
          })}
        </Tabs>

        <div className="flex gap-3 mt-5">
          <Button variant="outline" onClick={onBack} className="flex-1">← Atrás</Button>
          <Button onClick={saveProtocols} disabled={saving || parentSaving} className="flex-1">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Siguiente →'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
