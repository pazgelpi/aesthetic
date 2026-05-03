'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { ClinicProfile, ClinicProtocol, ClinicDocument } from '@/types/database'
import { Step1Branding } from './steps/step1-branding'
import { Step2Tone } from './steps/step2-tone'
import { Step3VoiceSamples } from './steps/step3-voice-samples'
import { Step4Signature } from './steps/step4-signature'
import { Step5Protocols } from './steps/step5-protocols'
import { Step6KnowledgeBase } from './steps/step6-knowledge-base'
import { Check } from 'lucide-react'

const STEPS = [
  { label: 'Branding' },
  { label: 'Tono' },
  { label: 'Voz' },
  { label: 'Firma' },
  { label: 'Protocolos' },
  { label: 'Documentos' },
]

interface Props {
  clinic: { id: string; name: string; city: string | null; phone: string | null }
  profile: ClinicProfile | null
  protocols: ClinicProtocol[]
  documents: ClinicDocument[]
  clinicId: string
  professionalName: string
}

export function ClinicWizard({ clinic, profile, protocols, documents, clinicId, professionalName }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(profile?.wizard_step ?? 0)
  const [saving, setSaving] = useState(false)

  // Accumulated state across steps
  const [wizardData, setWizardData] = useState({
    // Step 1
    clinic_name: clinic.name,
    city: clinic.city ?? '',
    phone: clinic.phone ?? '',
    primary_color: profile?.primary_color ?? '#7C3AED',
    brand_story: profile?.brand_story ?? '',
    // Step 2
    formality_level: profile?.formality_level ?? 'friendly',
    pronoun_usage: profile?.pronoun_usage ?? 'voseo',
    emoji_usage: profile?.emoji_usage ?? 'minimal',
    // Step 3
    voice_sample_1: profile?.voice_sample_1 ?? '',
    voice_sample_2: profile?.voice_sample_2 ?? '',
    voice_sample_3: profile?.voice_sample_3 ?? '',
    // Step 4
    signature_template: profile?.signature_template ?? `Soy {professional_first_name} de {clinic_name}`,
    // Protocols populated in step 5
  })

  async function saveCurrentStep(data: Partial<typeof wizardData>) {
    setSaving(true)
    const merged = { ...wizardData, ...data }
    setWizardData(merged)

    try {
      // Update clinic basic info
      if (data.clinic_name || data.city !== undefined || data.phone !== undefined) {
        await supabase.from('clinics').update({
          name: merged.clinic_name,
          city: merged.city || null,
          phone: merged.phone || null,
        }).eq('id', clinicId)
      }

      // Upsert clinic profile
      const profileData = {
        clinic_id: clinicId,
        formality_level: merged.formality_level as 'formal' | 'casual' | 'friendly',
        pronoun_usage: merged.pronoun_usage as 'voseo' | 'tuteo' | 'usted',
        emoji_usage: merged.emoji_usage as 'none' | 'minimal' | 'moderate',
        voice_sample_1: merged.voice_sample_1 || null,
        voice_sample_2: merged.voice_sample_2 || null,
        voice_sample_3: merged.voice_sample_3 || null,
        primary_color: merged.primary_color,
        brand_story: merged.brand_story || null,
        signature_template: merged.signature_template,
        wizard_step: currentStep + 1,
      }

      const { error } = await supabase
        .from('clinic_profiles')
        .upsert(profileData, { onConflict: 'clinic_id' })

      if (error) throw error
    } catch (err: unknown) {
      toast.error((err as Error).message)
      setSaving(false)
      return false
    }

    setSaving(false)
    return true
  }

  async function handleNext(data: Partial<typeof wizardData>) {
    const ok = await saveCurrentStep(data)
    if (!ok) return
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete wizard
      await supabase.from('clinic_profiles').update({
        wizard_completed_at: new Date().toISOString(),
        wizard_step: STEPS.length,
      }).eq('clinic_id', clinicId)
      toast.success('¡Configuración completada! Ya podés empezar a usar Aesthetic IQ.')
      router.push('/dashboard')
    }
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(0, s - 1))
  }

  const progress = ((currentStep) / STEPS.length) * 100
  const isCompleted = !!profile?.wizard_completed_at

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Paso {currentStep + 1} de {STEPS.length}</span>
          <span>{STEPS[currentStep]?.label}</span>
        </div>
        <Progress value={isCompleted ? 100 : progress} className="h-1.5" />
        <div className="flex gap-1">
          {STEPS.map((step, i) => (
            <button
              key={i}
              onClick={() => i <= currentStep && setCurrentStep(i)}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i < currentStep || isCompleted
                  ? 'bg-primary cursor-pointer'
                  : i === currentStep
                  ? 'bg-primary/40'
                  : 'bg-muted'
              }`}
              title={step.label}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      {currentStep === 0 && (
        <Step1Branding
          data={wizardData}
          onNext={(d) => handleNext(d)}
          saving={saving}
        />
      )}
      {currentStep === 1 && (
        <Step2Tone
          data={wizardData}
          onNext={(d) => handleNext(d)}
          onBack={handleBack}
          saving={saving}
        />
      )}
      {currentStep === 2 && (
        <Step3VoiceSamples
          data={wizardData}
          onNext={(d) => handleNext(d)}
          onBack={handleBack}
          saving={saving}
        />
      )}
      {currentStep === 3 && (
        <Step4Signature
          data={wizardData}
          clinicName={wizardData.clinic_name}
          professionalName={professionalName}
          onNext={(d) => handleNext(d)}
          onBack={handleBack}
          saving={saving}
        />
      )}
      {currentStep === 4 && (
        <Step5Protocols
          clinicId={clinicId}
          protocols={protocols}
          onNext={() => handleNext({})}
          onBack={handleBack}
          saving={saving}
        />
      )}
      {currentStep === 5 && (
        <Step6KnowledgeBase
          clinicId={clinicId}
          documents={documents}
          onFinish={() => handleNext({})}
          onBack={handleBack}
          saving={saving}
        />
      )}
    </div>
  )
}
