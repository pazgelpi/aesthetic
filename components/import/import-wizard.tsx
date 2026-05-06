'use client'

import { useState, useRef } from 'react'
import { ExtractedPatient, ExtractedTreatment } from '@/lib/ai/parse-clinic-history'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Upload, Loader2, CheckCircle2, X, FileText, Users, Sparkles, ChevronRight, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  clinicId: string
}

type PatientRow = ExtractedPatient & { include: boolean; source_file?: string }
type Step = 'upload' | 'parsing' | 'preview' | 'confirming' | 'done'

const CONFIDENCE_LABEL: Record<string, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}
const CONFIDENCE_COLOR: Record<string, string> = {
  high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-rose-50 text-rose-700 border-rose-200',
}
const TREATMENT_LABEL: Record<string, string> = {
  toxin: 'Toxina Botulínica',
  filler: 'Filler',
  unknown: 'Desconocido',
}

export function ImportWizard({ clinicId }: Props) {
  const [step, setStep] = useState<Step>('upload')
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [patients, setPatients] = useState<PatientRow[]>([])
  const [treatments, setTreatments] = useState<ExtractedTreatment[]>([])
  const [importResult, setImportResult] = useState({ patients_created: 0, treatments_created: 0 })
  const [gmailLoading, setGmailLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return
    const accepted = Array.from(newFiles).filter((f) =>
      f.name.endsWith('.txt') || f.name.endsWith('.pdf')
    )
    if (accepted.length < newFiles.length) {
      toast.warning('Solo se aceptan archivos .txt y .pdf')
    }
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...accepted.filter((f) => !names.has(f.name))]
    })
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  async function handleParse() {
    if (!files.length) return
    setStep('parsing')
    const form = new FormData()
    files.forEach((f) => form.append('files', f))

    try {
      const res = await fetch('/api/import/parse', { method: 'POST', body: form })
      if (!res.ok) throw new Error('Error al analizar los archivos')
      const data = await res.json()
      setPatients((data.patients ?? []).map((p: ExtractedPatient & { source_file?: string }) => ({ ...p, include: true })))
      setTreatments(data.treatments ?? [])
      setStep('preview')
    } catch (e) {
      toast.error((e as Error).message)
      setStep('upload')
    }
  }

  function togglePatient(tempId: string) {
    setPatients((prev) => prev.map((p) => p.temp_id === tempId ? { ...p, include: !p.include } : p))
  }

  async function handleGmailImport() {
    setGmailLoading(true)
    setStep('parsing')
    try {
      const res = await fetch('/api/import/gmail')
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (res.status === 400) throw new Error('Tu cuenta de Google no está conectada. Conectala en Configuración.')
        throw new Error((err as { error?: string }).error ?? 'Error al leer Gmail')
      }
      const data = await res.json()
      if ((data.patients ?? []).length === 0) {
        toast.info(`Se escanearon ${data.threadsScanned} emails pero no se encontraron pacientes.`)
        setStep('upload')
        return
      }
      setPatients((data.patients ?? []).map((p: ExtractedPatient & { source_file?: string }) => ({ ...p, include: true, source_file: 'Gmail' })))
      setTreatments(data.treatments ?? [])
      setStep('preview')
    } catch (e) {
      toast.error((e as Error).message)
      setStep('upload')
    } finally {
      setGmailLoading(false)
    }
  }

  async function handleConfirm() {
    setStep('confirming')
    try {
      const res = await fetch('/api/import/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicId, patients, treatments }),
      })
      if (!res.ok) throw new Error('Error al importar los datos')
      const data = await res.json()
      setImportResult(data)
      setStep('done')
    } catch (e) {
      toast.error((e as Error).message)
      setStep('preview')
    }
  }

  const includedCount = patients.filter((p) => p.include).length
  const includedTempIds = new Set(patients.filter((p) => p.include).map((p) => p.temp_id))
  const includedTreatments = treatments.filter(
    (t) => includedTempIds.has(t.patient_temp_id) && t.treatment_type !== 'unknown'
  )

  // ── Step: upload ─────────────────────────────────────────────────────────
  if (step === 'upload') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Importar historia clínica</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Subí tus chats de WhatsApp exportados o archivos de notas. La IA extrae pacientes y tratamientos automáticamente.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
            dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Arrastrá archivos o hacé click para seleccionar</p>
          <p className="text-xs text-muted-foreground mt-1">
            WhatsApp exports (.txt), documentos de notas (.txt), archivos PDF
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f) => (
              <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 truncate">{f.name}</span>
                <span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
                <button onClick={(e) => { e.stopPropagation(); removeFile(f.name) }} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 text-sm text-violet-700 space-y-1">
          <p className="font-medium">¿Cómo exportar el chat de WhatsApp?</p>
          <p className="text-violet-600">Abrí el chat → Más opciones → Exportar chat → Sin archivos multimedia → compartí el .txt</p>
        </div>

        <Button onClick={handleParse} disabled={!files.length} className="w-full rounded-xl">
          <Sparkles className="h-4 w-4 mr-2" />
          Analizar con IA
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">o importar desde</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGmailImport}
          disabled={gmailLoading}
          className="w-full flex items-center justify-center gap-2.5 border border-border rounded-xl py-3 text-sm font-medium hover:bg-muted/40 transition-colors disabled:opacity-50"
        >
          {gmailLoading
            ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            : <Mail className="h-4 w-4 text-rose-500" />}
          Importar desde Gmail
          <span className="text-xs text-muted-foreground font-normal">(últimos 2 años)</span>
        </button>
      </div>
    )
  }

  // ── Step: parsing ─────────────────────────────────────────────────────────
  if (step === 'parsing') {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 pt-20">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg">Analizando tu historia clínica</p>
          <p className="text-sm text-muted-foreground mt-1">La IA está leyendo los archivos y extrayendo pacientes y tratamientos…</p>
        </div>
      </div>
    )
  }

  // ── Step: preview ─────────────────────────────────────────────────────────
  if (step === 'preview') {
    if (patients.length === 0) {
      return (
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-xl font-semibold">Sin resultados</h1>
          <p className="text-sm text-muted-foreground">No se encontraron pacientes ni tratamientos en los archivos subidos.</p>
          <Button variant="outline" onClick={() => setStep('upload')}>Volver e intentar con otros archivos</Button>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Revisá lo que encontró la IA</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Se encontraron <strong>{patients.length} pacientes</strong> y <strong>{treatments.length} tratamientos</strong>.
            Destildá los que no quieras importar.
          </p>
        </div>

        <div className="space-y-3">
          {patients.map((p) => {
            const ptTreatments = treatments.filter((t) => t.patient_temp_id === p.temp_id)
            return (
              <div
                key={p.temp_id}
                className={`rounded-2xl border p-4 transition-opacity ${p.include ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={p.include}
                    onChange={() => togglePatient(p.temp_id)}
                    className="mt-1 h-4 w-4 accent-violet-600 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{p.full_name}</p>
                      {p.phone && <span className="text-xs text-muted-foreground">{p.phone}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CONFIDENCE_COLOR[p.confidence]}`}>
                        Confianza {CONFIDENCE_LABEL[p.confidence]}
                      </span>
                    </div>

                    {ptTreatments.length > 0 ? (
                      <div className="mt-2 space-y-1.5">
                        {ptTreatments.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {TREATMENT_LABEL[t.treatment_type] ?? t.treatment_type}
                            </Badge>
                            {t.areas_treated.length > 0 && (
                              <span>{t.areas_treated.join(', ')}</span>
                            )}
                            {t.treated_at && (
                              <span className="text-muted-foreground/60">
                                {t.treated_at}{t.date_approximate ? ' (aprox.)' : ''}
                              </span>
                            )}
                            {t.treatment_type === 'unknown' && (
                              <span className="text-amber-600">· No se importará (tipo desconocido)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">Sin tratamientos detectados</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="sticky bottom-0 bg-background pt-3 pb-1 border-t space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            Se importarán <strong>{includedCount}</strong> pacientes y <strong>{includedTreatments.length}</strong> tratamientos
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep('upload')} className="rounded-xl">
              Volver
            </Button>
            <Button onClick={handleConfirm} disabled={includedCount === 0} className="flex-1 rounded-xl">
              Confirmar importación
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: confirming ─────────────────────────────────────────────────────
  if (step === 'confirming') {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 pt-20">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <p className="font-semibold text-lg">Importando datos…</p>
      </div>
    )
  }

  // ── Step: done ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center gap-6 pt-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">¡Historia importada!</h1>
        <p className="text-muted-foreground mt-2">
          Se crearon <strong>{importResult.patients_created} pacientes</strong> nuevos
          y <strong>{importResult.treatments_created} tratamientos</strong>.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Los pacientes duplicados fueron vinculados automáticamente.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => { setStep('upload'); setFiles([]); setPatients([]); setTreatments([]) }} className="rounded-xl">
          Importar más archivos
        </Button>
        <Button asChild className="rounded-xl">
          <a href="/patients">
            <Users className="h-4 w-4 mr-2" />
            Ver pacientes
          </a>
        </Button>
      </div>
    </div>
  )
}
