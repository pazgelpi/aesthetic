export default function PortalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Link no válido</h1>
        <p className="text-muted-foreground">
          Este link ya no está disponible o expiró. Contactá a tu profesional para recibir uno nuevo.
        </p>
      </div>
    </div>
  )
}
