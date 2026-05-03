import { NewPatientForm } from '@/components/patients/new-patient-form'

export default function NewPatientPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nueva paciente</h1>
        <p className="text-sm text-muted-foreground">
          Completá los datos para registrar a la paciente.
        </p>
      </div>
      <NewPatientForm />
    </div>
  )
}
