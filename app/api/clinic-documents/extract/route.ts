import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { documentId } = await req.json()
  if (!documentId) return Response.json({ error: 'Missing documentId' }, { status: 400 })

  const supabase = createAdminClient()

  // Mark as processing
  await supabase.from('clinic_documents').update({ status: 'processing' }).eq('id', documentId)

  try {
    const { data: doc } = await supabase
      .from('clinic_documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (!doc) return Response.json({ error: 'Document not found' }, { status: 404 })

    // Fetch file content
    const fileRes = await fetch(doc.file_url)
    const buffer = await fileRes.arrayBuffer()

    let extractedText = ''

    if (doc.filename.endsWith('.pdf')) {
      const pdfParseModule = await import('pdf-parse')
      // pdf-parse exports differently depending on the bundler
      const pdfParse = (pdfParseModule as unknown as { default: (buf: Buffer) => Promise<{ text: string }> }).default ?? pdfParseModule
      const data = await pdfParse(Buffer.from(buffer))
      extractedText = data.text
    } else {
      // Plain text / doc fallback
      extractedText = Buffer.from(buffer).toString('utf-8')
    }

    // Trim to ~50k chars to keep knowledge_base_text manageable
    extractedText = extractedText.slice(0, 50000)

    // Update doc
    await supabase.from('clinic_documents').update({
      extracted_text: extractedText,
      status: 'processed',
    }).eq('id', documentId)

    // Consolidate into clinic_profiles.knowledge_base_text
    const { data: allDocs } = await supabase
      .from('clinic_documents')
      .select('filename, extracted_text')
      .eq('clinic_id', doc.clinic_id)
      .eq('status', 'processed')

    const consolidated = (allDocs ?? [])
      .filter((d) => d.extracted_text)
      .map((d) => `=== ${d.filename} ===\n${d.extracted_text}`)
      .join('\n\n')

    await supabase.from('clinic_profiles').update({
      knowledge_base_text: consolidated,
      knowledge_base_updated_at: new Date().toISOString(),
    }).eq('clinic_id', doc.clinic_id)

    return Response.json({ ok: true })
  } catch (err: unknown) {
    await supabase.from('clinic_documents').update({
      status: 'failed',
      error_message: (err as Error).message,
    }).eq('id', documentId)
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
