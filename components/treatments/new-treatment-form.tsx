'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClinicProtocol } from '@/types/database'
import { toast } from 'sonner'
import { Loader2, Camera } from 'lucide-react'
import { addDays } from 'date-fns'

const TOXIN_AREAS = ['Frontal', 'Glabela', 'Patas de gallo', 'Bunny lines', 'Labio superior', 'Mentón', 'Platisma']
const FILLER_AREAS = ['Labios', 'Surcos nasogenianos', 'Pómulos', 'Ángulo mandibular', 'Ojeras', 'Mentón', 'Sienes']

interface Patient { id: string; full_name: string; first_name: string; phone_e164: string }

interface Props {
  patients: Patient[]
  protocols: ClinicProtocol[]
  professionalId: string
  clinicId: string
  preselectedPatientId?: string
}

export function NewTreatmentForm({ patients, protocols, professionalId, clinicId, preselectedPatientId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [treatmentType, setTreatmentType] = useState<'toxin' | 'filler'>('toxin')
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [form, setForm] = useState({
    patient_id: preselectedPatientId ?? '',
    product_brand: '',
    units_total: '',
    notes: '',
    treated_at: new Date().toISOString().split('T')[0],
  })

  const protocol = protocols.find((p) => p.treatment_type === treatmentType)
  const areas = treatmentType === 'toxin' ? TOXIN_AREAS : FILLER_AREAS

  function toggleArea(area: string) {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.patient_id) { toast.error('Seleccioná una paciente'); return }
    if (selectedAreas.length === 0) { toast.error('Seleccioná al menos un área tratada'); return }

    setLoading(true)
    try {
      const treatedAt = new Date(form.treated_at)
      const reTreatDays = protocol?.default_re_treatment_days ?? (treatmentType === 'toxin' ? 120 : 240)
      const expectedReAt = addDays(treatedAt, reTreatDays)

      const { data: treatment, error } = await supabase
        .from('treatments')
        .insert({
          patient_id: form.patient_id,
          clinic_id: clinicId,
          professional_id: professionalId,
          treatment_type: treatmentType,
          product_brand: form.product_brand || null,
          units_total: form.units_total ? Number(form.units_total) : null,
          areas_treated: selectedAreas,
          notes: form.notes || null,
          treated_at: treatedAt.toISOString(),
          expected_re_treatment_at: expectedReAt.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Schedule the 5 WhatsApp messages
      await fetch('/api/treatments/schedule-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentId: treatment.id }),
      })

      // Generate AI recommendations
      await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: form.patient_id, clinicId }),
      })

      toast.success('Tratamiento registrado. Mensajes WhatsApp programados.')
      router.push(`/treatments/${treatment.id}`)
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
          {/* Patient selection */}
          <div className="space-y-2">
            <Label>Paciente *</Label>
            <Select value={form.patient_id} onValueChange={(v) => setForm({ ...form, patient_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccioná una paciente..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Treatment type */}
          <div className="space-y-2">
            <Label>Tipo de tratamiento *</Label>
            <RadioGroup
              value={treatmentType}
              onValueChange={(v) => { setTreatmentType(v as 'toxin' | 'filler'); setSelectedAreas([]) }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { value: 'toxin', label: 'Toxina Botulínica' },
                { value: 'filler', label: 'Filler Facial' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${treatmentType === opt.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => { setTreatmentType(opt.value as 'toxin' | 'filler'); setSelectedAreas([]) }}
                >
                  <RadioGroupItem value={opt.value} id={`type-${opt.value}`} />
                  <Label htmlFor={`type-${opt.value}`} className="cursor-pointer font-medium">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Areas */}
          <div className="space-y-2">
            <Label>Áreas tratadas *</Label>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedAreas.includes(area)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marca del producto</Label>
              <Input
                value={form.product_brand}
                onChange={(e) => setForm({ ...form, product_brand: e.target.value })}
                placeholder={treatmentType === 'toxin' ? 'Botox' : 'Juvederm Ultra'}
              />
            </div>
            {treatmentType === 'toxin' && (
              <div className="space-y-2">
                <Label>Unidades totales</Label>
                <Input
                  type="number"
                  value={form.units_total}
                  onChange={(e) => setForm({ ...form, units_total: e.target.value })}
                  placeholder="50"
                  min={1}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Fecha del tratamiento</Label>
            <Input
              type="date"
              value={form.treated_at}
              onChange={(e) => setForm({ ...form, treated_at: e.target.value })}
            />
          </div>

          {protocol && (
            <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              Próximo retratamiento estimado: <strong>en {protocol.default_re_treatment_days} días</strong> según el protocolo de tu clínica.
            </div>
          )}

          <div className="space-y-2">
            <Label>Notas clínicas</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="Observaciones del tratamiento, respuesta de la paciente..."
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : (
                <><Camera className="mr-2 h-4 w-4" />Guardar y capturar fotos</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
