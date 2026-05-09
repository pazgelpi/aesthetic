import Link from 'next/link'
import { DEMO_TREATMENTS, DEMO_PATIENTS } from '@/lib/demo/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

export default function DemoTreatmentsPage() {
  return (
    <div className="p-7 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Tratamientos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Historial de tratamientos en esta demo</p>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Todos los tratamientos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {DEMO_TREATMENTS.map(t => {
              const patient = DEMO_PATIENTS.find(p => p.id === t.patient_id)
              return (
                <Link key={t.id} href={`/demo/treatments/${t.id}`}>
                  <div className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{patient?.full_name}</span>
                        <Badge variant={t.treatment_type === 'toxin' ? 'default' : 'secondary'} className="text-xs">
                          {t.treatment_type === 'toxin' ? 'Toxina' : 'Filler'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.areas_treated.join(', ')}</p>
                    </div>
                    <span className="text-sm text-muted-foreground hidden md:block">{formatDate(t.treated_at)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
