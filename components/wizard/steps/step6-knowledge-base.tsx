'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ClinicDocument } from '@/types/database'
import { toast } from 'sonner'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react'

interface Props {
  clinicId: string
  documents: ClinicDocument[]
  onFinish: () => void
  onBack: () => void
  saving: boolean
}

export function Step6KnowledgeBase({ clinicId, documents: initialDocs, onFinish, onBack, saving }: Props) {
  const supabase = createClient()
  const [docs, setDocs] = useState(initialDocs)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (files: File[]) => {
    const validFiles = files.filter((f) => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} supera los 10MB`)
        return false
      }
      return true
    })
    if (validFiles.length === 0) return

    setUploading(true)
    setUploadProgress(10)

    for (const file of validFiles) {
      try {
        // Upload to Supabase Storage
        const path = `${clinicId}/docs/${Date.now()}-${file.name}`
        const { error: storageError } = await supabase.storage
          .from('clinic-documents')
          .upload(path, file)

        if (storageError) throw storageError

        const { data: { publicUrl } } = supabase.storage
          .from('clinic-documents')
          .getPublicUrl(path)

        setUploadProgress(50)

        // Register in DB
        const { data: doc, error: dbError } = await supabase
          .from('clinic_documents')
          .insert({
            clinic_id: clinicId,
            filename: file.name,
            file_url: publicUrl,
            document_type: 'protocol',
            status: 'uploaded',
          })
          .select()
          .single()

        if (dbError) throw dbError

        setDocs((prev) => [doc, ...prev])
        setUploadProgress(80)

        // Trigger extraction via API
        await fetch('/api/clinic-documents/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: doc.id }),
        })

        setUploadProgress(100)
        toast.success(`${file.name} subido correctamente`)
      } catch (err: unknown) {
        toast.error(`Error subiendo ${file.name}: ${(err as Error).message}`)
      }
    }

    setUploading(false)
    setUploadProgress(0)
  }, [clinicId, supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    multiple: true,
    disabled: uploading,
  })

  const statusIcon = (status: string) => {
    if (status === 'processed') return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (status === 'failed') return <AlertCircle className="h-4 w-4 text-red-500" />
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base de conocimiento (opcional)</CardTitle>
        <CardDescription>
          Subí tus protocolos, fichas técnicas y materiales de educación. La AI los usará para responder preguntas de tus pacientes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>Estos documentos alimentan las respuestas de la AI cuando una paciente hace una pregunta inesperada. No son visibles para las pacientes.</p>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">
            {isDragActive ? 'Soltá los archivos acá' : 'Arrastrá archivos o hacé clic para seleccionar'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, TXT — máximo 10MB por archivo</p>
        </div>

        {uploading && (
          <div className="space-y-1">
            <Progress value={uploadProgress} className="h-1.5" />
            <p className="text-xs text-muted-foreground text-center">Subiendo y procesando...</p>
          </div>
        )}

        {/* Document list */}
        {docs.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Documentos subidos ({docs.length})</p>
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm flex-1 truncate">{doc.filename}</span>
                <Badge variant="outline" className="text-xs shrink-0">
                  {doc.document_type ?? 'Protocolo'}
                </Badge>
                {statusIcon(doc.status)}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">← Atrás</Button>
          <Button onClick={onFinish} disabled={uploading || saving} className="flex-1">
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Finalizando...</> : '¡Finalizar configuración! ✓'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
