import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { parseClinicHistory, ParsedHistoryResult } from '@/lib/ai/parse-clinic-history'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]
  if (!files.length) return Response.json({ error: 'No files provided' }, { status: 400 })

  const results: ParsedHistoryResult[] = []

  for (const file of files) {
    let text = ''

    if (file.name.endsWith('.pdf')) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const pdfParseModule = await import('pdf-parse')
      const pdfParse = (pdfParseModule as unknown as { default: (buf: Buffer) => Promise<{ text: string }> }).default ?? pdfParseModule
      const data = await pdfParse(buffer)
      text = data.text
    } else {
      text = await file.text()
    }

    if (!text.trim()) continue

    const result = await parseClinicHistory(text, file.name)
    results.push(result)
  }

  // Merge all results, re-index temp_ids to avoid collisions across files
  const allPatients = results.flatMap((r, fi) =>
    r.patients.map((p) => ({ ...p, temp_id: `f${fi}_${p.temp_id}`, source_file: r.source_file }))
  )
  const allTreatments = results.flatMap((r, fi) =>
    r.treatments.map((t) => ({ ...t, patient_temp_id: `f${fi}_${t.patient_temp_id}` }))
  )

  return Response.json({ patients: allPatients, treatments: allTreatments })
}
