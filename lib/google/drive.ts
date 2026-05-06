import { google } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'

async function getOrCreateFolder(
  drive: ReturnType<typeof google.drive>,
  name: string,
  parentId?: string,
): Promise<string> {
  const query = [
    `name = '${name.replace(/'/g, "\\'")}'`,
    `mimeType = 'application/vnd.google-apps.folder'`,
    `trashed = false`,
    parentId ? `'${parentId}' in parents` : `'root' in parents`,
  ].join(' and ')

  const { data } = await drive.files.list({ q: query, fields: 'files(id)', pageSize: 1 })
  if (data.files && data.files.length > 0) return data.files[0].id!

  const { data: folder } = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined,
    },
    fields: 'id',
  })
  return folder.id!
}

export async function uploadFileToDrive(
  auth: OAuth2Client,
  opts: {
    patientName: string
    treatmentLabel: string
    treatedAt: string
    fileName: string
    buffer: Buffer
    mimeType: string
    subfolder?: 'pre' | 'post' | 'historia'
  },
): Promise<{ fileId: string; webViewLink: string }> {
  const drive = google.drive({ version: 'v3', auth })

  const date = new Date(opts.treatedAt).toISOString().slice(0, 10)
  const rootId = await getOrCreateFolder(drive, 'Aesthetic IQ')
  const patientId = await getOrCreateFolder(drive, opts.patientName, rootId)
  const treatmentId = await getOrCreateFolder(drive, `${opts.treatmentLabel} — ${date}`, patientId)
  const targetId = opts.subfolder
    ? await getOrCreateFolder(drive, opts.subfolder, treatmentId)
    : treatmentId

  const { data: file } = await drive.files.create({
    requestBody: { name: opts.fileName, parents: [targetId] },
    media: { mimeType: opts.mimeType, body: opts.buffer },
    fields: 'id, webViewLink',
  })

  return { fileId: file.id!, webViewLink: file.webViewLink! }
}

export async function uploadUrlToDrive(
  auth: OAuth2Client,
  opts: {
    patientName: string
    treatmentLabel: string
    treatedAt: string
    fileName: string
    sourceUrl: string
    mimeType: string
    subfolder?: 'pre' | 'post' | 'historia'
  },
): Promise<{ fileId: string; webViewLink: string }> {
  const res = await fetch(opts.sourceUrl)
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return uploadFileToDrive(auth, { ...opts, buffer })
}
