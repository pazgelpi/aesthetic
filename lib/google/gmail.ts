import { google } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'

function encodeEmail(to: string, subject: string, html: string, fromName?: string): string {
  const from = fromName ? `"${fromName}" <me>` : 'me'
  const raw = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(html).toString('base64'),
  ].join('\r\n')
  return Buffer.from(raw).toString('base64url')
}

export async function sendEmail(
  auth: OAuth2Client,
  opts: { to: string; subject: string; html: string; fromName?: string },
) {
  const gmail = google.gmail({ version: 'v1', auth })
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodeEmail(opts.to, opts.subject, opts.html, opts.fromName) },
  })
}

export interface GmailThread {
  id: string
  snippet: string
  body: string
}

export async function searchThreads(
  auth: OAuth2Client,
  query: string,
  maxResults = 20,
): Promise<GmailThread[]> {
  const gmail = google.gmail({ version: 'v1', auth })

  const { data: list } = await gmail.users.threads.list({
    userId: 'me',
    q: query,
    maxResults,
  })

  if (!list.threads?.length) return []

  const threads = await Promise.all(
    list.threads.map(async (t) => {
      const { data: thread } = await gmail.users.threads.get({
        userId: 'me',
        id: t.id!,
        format: 'full',
      })

      const parts = thread.messages?.flatMap((m) => m.payload?.parts ?? [m.payload!]) ?? []
      const bodyParts = parts.filter((p) => p?.mimeType === 'text/plain' || p?.mimeType === 'text/html')
      const body = bodyParts
        .map((p) => {
          const data = p?.body?.data
          if (!data) return ''
          try { return Buffer.from(data, 'base64').toString('utf-8') } catch { return '' }
        })
        .join('\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      return { id: t.id!, snippet: thread.snippet ?? '', body: body.slice(0, 3000) }
    }),
  )

  return threads
}

export function buildFollowUpHtml(opts: {
  messageText: string
  clinicName: string
  patientFirstName: string
}): string {
  const { messageText, clinicName, patientFirstName } = opts
  const paragraphs = messageText.split('\n').filter(Boolean).map((p) => `<p style="margin:0 0 12px 0">${p}</p>`).join('')
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a1a">
    <p style="font-size:12px;color:#888;margin:0 0 24px 0;text-transform:uppercase;letter-spacing:1px">${clinicName}</p>
    ${paragraphs}
    <p style="font-size:11px;color:#aaa;margin-top:32px;border-top:1px solid #eee;padding-top:16px">
      Este mensaje fue enviado por Aesthetic IQ en nombre de ${clinicName}.<br>
      Hola ${patientFirstName}, podés responder directamente a este email.
    </p>
  </body></html>`
}

export function buildProgressReportHtml(opts: {
  title: string
  narrative: string
  highlightValue: string
  highlightLabel: string
  ctaText: string
  clinicName: string
  imageUrl?: string
}): string {
  const { title, narrative, highlightValue, highlightLabel, ctaText, clinicName, imageUrl } = opts
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
  <body style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;background:#18142a;color:#fff">
    <p style="font-size:11px;color:rgba(255,255,255,0.4);margin:0 0 20px 0;text-transform:uppercase;letter-spacing:1px">${clinicName}</p>
    <h1 style="font-size:22px;margin:0 0 16px 0;line-height:1.3">✨ ${title}</h1>
    <div style="background:#7c3aed;display:inline-block;padding:8px 16px;border-radius:12px;margin-bottom:16px">
      <span style="font-size:28px;font-weight:900">${highlightValue}</span>
    </div>
    <p style="color:rgba(255,255,255,0.6);margin:0 0 16px 0;font-size:14px">${highlightLabel}</p>
    <p style="color:rgba(255,255,255,0.8);line-height:1.6;margin:0 0 20px 0">${narrative}</p>
    ${imageUrl ? `<img src="${imageUrl}" style="width:100%;border-radius:12px;margin-bottom:20px" alt="Historia de progreso">` : ''}
    <p style="color:rgba(255,255,255,0.5);font-style:italic;font-size:13px;border-top:1px solid rgba(255,255,255,0.1);padding-top:16px">"${ctaText}"</p>
    <p style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:24px">Generado por Aesthetic IQ · ${clinicName}</p>
  </body></html>`
}
