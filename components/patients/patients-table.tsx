'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { Treatment } from '@/types/database'
import { Search, Star, ChevronRight } from 'lucide-react'

interface PatientRow {
  id: string
  full_name: string
  phone_e164: string
  trafficLight: 'green' | 'yellow' | 'red'
  isVip: boolean
  lastTreatment: Treatment | null
  nextExpected: string | null
  pendingPhoto: boolean
}

const TRAFFIC_LIGHT = {
  green: { label: 'Normal', class: 'bg-green-500' },
  yellow: { label: 'Próxima', class: 'bg-yellow-400' },
  red: { label: 'Riesgo', class: 'bg-red-500' },
}

export function PatientsTable({ patients }: { patients: PatientRow[] }) {
  const [search, setSearch] = useState('')

  const filtered = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">Pacientes activas</CardTitle>
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {search ? 'No encontramos pacientes con ese nombre.' : 'No hay pacientes activas todavía.'}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((p) => (
              <Link key={p.id} href={`/patients/${p.id}`}>
                <div className="flex items-center gap-4 px-6 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  {/* Traffic light */}
                  <div
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${TRAFFIC_LIGHT[p.trafficLight].class}`}
                    title={TRAFFIC_LIGHT[p.trafficLight].label}
                  />

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{p.full_name}</span>
                      {p.isVip && (
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.phone_e164}</p>
                  </div>

                  {/* Last treatment */}
                  <div className="hidden md:block text-sm text-muted-foreground w-40 shrink-0">
                    {p.lastTreatment ? (
                      <span>
                        {p.lastTreatment.treatment_type === 'toxin' ? 'Toxina' : 'Filler'} ·{' '}
                        {formatDate(p.lastTreatment.treated_at, 'd MMM yyyy')}
                      </span>
                    ) : (
                      <span className="text-xs italic">Sin tratamientos</span>
                    )}
                  </div>

                  {/* Next expected */}
                  <div className="hidden lg:block w-32 shrink-0">
                    {p.nextExpected ? (
                      <Badge
                        variant="outline"
                        className={`text-xs ${p.trafficLight === 'red' ? 'border-red-300 text-red-600' : p.trafficLight === 'yellow' ? 'border-yellow-300 text-yellow-700' : ''}`}
                      >
                        {formatRelativeDate(p.nextExpected)}
                      </Badge>
                    ) : null}
                  </div>

                  {/* Pending photo badge */}
                  {p.pendingPhoto && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      📷 Foto pendiente
                    </Badge>
                  )}

                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
