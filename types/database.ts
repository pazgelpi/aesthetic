export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// Makes any field whose type includes `null` optional in Insert/Update contexts
type NullableToOptional<T> = {
  [K in keyof T as null extends T[K] ? K : never]?: T[K]
} & {
  [K in keyof T as null extends T[K] ? never : K]: T[K]
}

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          name: string
          owner_email: string
          phone: string | null
          address: string | null
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['clinics']['Row'], 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Database['public']['Tables']['clinics']['Insert']>
        Relationships: []
      }
      professionals: {
        Row: {
          id: string
          clinic_id: string
          user_id: string
          full_name: string
          role: 'owner' | 'professional'
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['professionals']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['professionals']['Insert']>
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          clinic_id: string
          full_name: string
          first_name: string
          email: string | null
          phone_e164: string
          date_of_birth: string | null
          consent_given_at: string | null
          consent_signature_url: string | null
          notes: string | null
          status: 'active' | 'paused' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Database['public']['Tables']['patients']['Insert']>
        Relationships: []
      }
      clinic_profiles: {
        Row: {
          id: string
          clinic_id: string
          formality_level: 'formal' | 'casual' | 'friendly'
          pronoun_usage: 'voseo' | 'tuteo' | 'usted'
          emoji_usage: 'none' | 'minimal' | 'moderate'
          voice_sample_1: string | null
          voice_sample_2: string | null
          voice_sample_3: string | null
          logo_url: string | null
          primary_color: string | null
          brand_story: string | null
          signature_template: string | null
          knowledge_base_text: string | null
          knowledge_base_updated_at: string | null
          wizard_step: number
          wizard_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['clinic_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Database['public']['Tables']['clinic_profiles']['Insert']>
        Relationships: []
      }
      clinic_protocols: {
        Row: {
          id: string
          clinic_id: string
          treatment_type: 'toxin' | 'filler'
          preferred_brands: string[] | null
          typical_areas: string[] | null
          default_re_treatment_days: number
          contraindications: string[] | null
          pre_treatment_instructions: string | null
          post_treatment_immediate: string | null
          post_treatment_week: string | null
          post_treatment_long_term: string | null
          recommended_products: string | null
          patient_education_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['clinic_protocols']['Row'], 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Database['public']['Tables']['clinic_protocols']['Insert']>
        Relationships: []
      }
      clinic_documents: {
        Row: {
          id: string
          clinic_id: string
          filename: string
          file_url: string
          document_type: 'protocol' | 'education' | 'product_info' | 'other' | null
          extracted_text: string | null
          status: 'uploaded' | 'processing' | 'processed' | 'failed'
          error_message: string | null
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['clinic_documents']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['clinic_documents']['Insert']>
        Relationships: []
      }
      treatments: {
        Row: {
          id: string
          patient_id: string
          clinic_id: string
          professional_id: string
          treatment_type: 'toxin' | 'filler'
          product_brand: string | null
          units_total: number | null
          areas_treated: string[]
          notes: string | null
          treated_at: string
          expected_re_treatment_at: string | null
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['treatments']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['treatments']['Insert']>
        Relationships: []
      }
      photo_sessions: {
        Row: {
          id: string
          treatment_id: string
          session_type: 'pre' | 'post_14d' | 'post_30d'
          photo_front_url: string | null
          photo_contracted_url: string | null
          photo_45_url: string | null
          landmarks_front_json: Json | null
          landmarks_contracted_json: Json | null
          landmarks_45_json: Json | null
          alignment_quality_score: number | null
          capture_metadata: Json | null
          captured_at: string
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['photo_sessions']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['photo_sessions']['Insert']>
        Relationships: []
      }
      capture_tokens: {
        Row: {
          id: string
          treatment_id: string
          patient_id: string
          token: string
          purpose: 'post_photo' | 'patient_portal'
          expires_at: string
          used_at: string | null
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['capture_tokens']['Row'], 'id' | 'created_at' | 'token'>>
        Update: Partial<Database['public']['Tables']['capture_tokens']['Insert']>
        Relationships: []
      }
      comparisons: {
        Row: {
          id: string
          treatment_id: string
          pre_session_id: string
          post_session_id: string
          metrics_json: Json
          ai_synthesis_patient: string
          ai_synthesis_clinic: string
          diff_overlay_url: string | null
          shareable_image_url: string | null
          generated_at: string
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['comparisons']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['comparisons']['Insert']>
        Relationships: []
      }
      scheduled_messages: {
        Row: {
          id: string
          clinic_id: string
          patient_id: string
          treatment_id: string | null
          template_type: string
          scheduled_for: string
          generated_message: string | null
          generated_at: string | null
          status: 'scheduled' | 'generated' | 'sent' | 'failed' | 'cancelled'
          sent_at: string | null
          twilio_message_sid: string | null
          patient_response: string | null
          patient_responded_at: string | null
          escalated_to_clinic: boolean
          escalated_at: string | null
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['scheduled_messages']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['scheduled_messages']['Insert']>
        Relationships: []
      }
      recommendations: {
        Row: {
          id: string
          patient_id: string
          clinic_id: string
          treatment_id: string | null
          recommendation_type: 'next_treatment' | 'product' | 'home_care' | 'lifestyle'
          title: string
          description: string
          rationale: string | null
          suggested_at: string
          expires_at: string | null
          status: 'active' | 'accepted' | 'dismissed' | 'completed'
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['recommendations']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['recommendations']['Insert']>
        Relationships: []
      }
      message_templates: {
        Row: {
          id: string
          template_type: string
          trigger_offset_days: number | null
          prompt_instructions: string
          is_active: boolean
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['message_templates']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['message_templates']['Insert']>
        Relationships: []
      }
      adherence_logs: {
        Row: {
          id: string
          patient_id: string
          clinic_id: string
          logged_at: string
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['adherence_logs']['Row'], 'id' | 'created_at'>>
        Update: Partial<Database['public']['Tables']['adherence_logs']['Insert']>
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          actor_type: 'professional' | 'patient_token' | 'system' | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: NullableToOptional<Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>>
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience types
export type Clinic = Database['public']['Tables']['clinics']['Row']
export type Professional = Database['public']['Tables']['professionals']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type ClinicProfile = Database['public']['Tables']['clinic_profiles']['Row']
export type ClinicProtocol = Database['public']['Tables']['clinic_protocols']['Row']
export type ClinicDocument = Database['public']['Tables']['clinic_documents']['Row']
export type Treatment = Database['public']['Tables']['treatments']['Row']
export type PhotoSession = Database['public']['Tables']['photo_sessions']['Row']
export type CaptureToken = Database['public']['Tables']['capture_tokens']['Row']
export type Comparison = Database['public']['Tables']['comparisons']['Row']
export type ScheduledMessage = Database['public']['Tables']['scheduled_messages']['Row']
export type Recommendation = Database['public']['Tables']['recommendations']['Row']
export type MessageTemplate = Database['public']['Tables']['message_templates']['Row']

export type TreatmentType = 'toxin' | 'filler'
export type PatientStatus = 'active' | 'paused' | 'archived'

export type PatientWithStatus = Patient & {
  trafficLight: 'green' | 'yellow' | 'red'
  isVip: boolean
  lastTreatment: Treatment | null
  nextExpected: string | null
  pendingPhoto: boolean
}

export interface Metrics {
  glabela_pre_intensity: number
  glabela_post_intensity: number
  glabela_change_pct: number
  frontal_pre_intensity: number
  frontal_post_intensity: number
  frontal_change_pct: number
  patas_gallo_left_pre: number
  patas_gallo_left_post: number
  patas_gallo_left_change_pct: number
  patas_gallo_right_pre: number
  patas_gallo_right_post: number
  patas_gallo_right_change_pct: number
  symmetry_score_pre: number
  symmetry_score_post: number
  symmetry_change: number
  alignment_quality: number
}
