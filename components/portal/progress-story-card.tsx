'use client'

import { useState } from 'react'
import { StoryOutput } from '@/lib/ai/generate-progress-story'
import { Share2, Download, Mail, Loader2, CheckCircle2 } from 'lucide-react'

interface Props {
  story: StoryOutput
  treatmentId: string
  token: string
  patientEmail?: string | null
}

export function ProgressStoryCard({ story, treatmentId, token, patientEmail }: Props) {
  const imageUrl = `/api/progress-story/${treatmentId}/image?token=${token}`
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: story.title, text: story.narrative, url: imageUrl })
        return
      } catch {
        // fall through
      }
    }
    window.open(imageUrl, '_blank')
  }

  async function handleEmailSend() {
    if (!patientEmail || emailSent || emailLoading) return
    setEmailLoading(true)
    try {
      const res = await fetch('/api/reports/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentId, recipientType: 'patient' }),
      })
      if (res.ok) setEmailSent(true)
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #18142a 0%, #2d1b4e 70%, #1a0e2e 100%)' }}
    >
      <div className="p-5 space-y-4">
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Tu historia de progreso
        </p>

        <h3 className="text-xl font-bold leading-snug" style={{ color: '#ffffff' }}>
          ✨ {story.title}
        </h3>

        <div className="flex items-center gap-3">
          <div className="rounded-xl px-4 py-2 text-center" style={{ background: '#7c3aed' }}>
            <span className="text-3xl font-extrabold" style={{ color: '#ffffff' }}>
              {story.highlightValue}
            </span>
          </div>
          <span className="text-sm leading-tight" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {story.highlightLabel}
          </span>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {story.narrative}
        </p>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />

        <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
          &ldquo;{story.ctaText}&rdquo;
        </p>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-80 active:opacity-60"
          style={{ background: 'rgba(124,58,237,0.35)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(124,58,237,0.5)' }}
        >
          {typeof navigator !== 'undefined' && 'share' in navigator
            ? <Share2 className="h-4 w-4" />
            : <Download className="h-4 w-4" />}
          Compartir mi historia
        </button>

        {/* Email button — only shown if patient has email */}
        {patientEmail && (
          <button
            onClick={handleEmailSend}
            disabled={emailLoading || emailSent}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {emailLoading
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : emailSent
              ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              : <Mail className="h-3.5 w-3.5" />}
            {emailSent ? 'Historia enviada por email' : 'Enviar por email'}
          </button>
        )}
      </div>
    </div>
  )
}
