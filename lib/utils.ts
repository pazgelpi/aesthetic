import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Patient, Treatment, PatientWithStatus } from '@/types/database'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = "d 'de' MMMM, yyyy") {
  return format(new Date(date), fmt, { locale: es })
}

export function formatRelativeDate(date: string | Date) {
  const days = differenceInDays(new Date(date), new Date())
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  if (days === -1) return 'Ayer'
  if (days > 0) return `En ${days} días`
  return `Hace ${Math.abs(days)} días`
}

export function calculateTrafficLight(
  patient: Patient,
  lastTreatment: Treatment | null,
  pendingPhotoResponses: number
): 'green' | 'yellow' | 'red' {
  if (!lastTreatment) return 'green'

  const now = new Date()
  const expectedAt = lastTreatment.expected_re_treatment_at
    ? new Date(lastTreatment.expected_re_treatment_at)
    : null

  // Churn: overdue by 30+ days
  if (expectedAt && differenceInDays(now, expectedAt) > 30) return 'red'
  // Churn: no photo response after 21 days of photo request
  if (pendingPhotoResponses >= 1) return 'red'

  // Upcoming: ≤ 21 days to next treatment
  if (expectedAt && differenceInDays(expectedAt, now) <= 21) return 'yellow'

  return 'green'
}

export function isVip(treatments: Treatment[]): boolean {
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  return treatments.filter(t => new Date(t.treated_at) >= oneYearAgo).length > 3
}

export function getSeason(): 'verano' | 'otoño' | 'invierno' | 'primavera' {
  const month = new Date().getMonth() + 1
  // Southern hemisphere (Argentina)
  if (month >= 12 || month <= 2) return 'verano'
  if (month >= 3 && month <= 5) return 'otoño'
  if (month >= 6 && month <= 8) return 'invierno'
  return 'primavera'
}

export function formatPhone(phone: string): string {
  // Ensure E.164 format for Argentina
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('549')) return `+${digits}`
  if (digits.startsWith('54')) return `+${digits}`
  if (digits.startsWith('0')) return `+549${digits.slice(1)}`
  return `+549${digits}`
}

export function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}...` : str
}
