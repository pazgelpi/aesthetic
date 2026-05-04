import Link from 'next/link'
import {
  Sparkles, LayoutDashboard, MessageSquare, Camera, Mic2,
  AlertTriangle, Clock, CheckCircle2, ArrowRight, Users,
  Zap, Shield, ChevronRight,
} from 'lucide-react'

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[var(--sidebar)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[var(--sidebar-accent)]">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Aesthetic IQ</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="text-sm text-[var(--sidebar-muted-foreground)] hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Ingresar
          </Link>
          <Link
            href="/auth/login"
            className="text-sm font-medium bg-[var(--sidebar-accent)] text-white px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Empezar gratis
          </Link>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-[var(--sidebar)] pt-28 pb-20 px-5">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/80 text-xs font-medium px-3.5 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Beta · Gratis para las primeras clínicas
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
          El sistema operativo
          <br />
          <span className="text-[var(--sidebar-accent)]">de tu clínica estética</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Automatizá el seguimiento post-tratamiento, medí resultados reales
          y reactivá pacientes — sin esfuerzo manual.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 bg-[var(--sidebar-accent)] text-white font-semibold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            Probar gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:bg-white/5 font-medium px-7 py-3 rounded-xl transition-colors text-sm"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Metric pills */}
        <div className="flex flex-wrap justify-center gap-3 pt-6">
          {[
            { value: '5', label: 'mensajes automáticos' },
            { value: '3', label: 'fotos comparativas' },
            { value: '0', label: 'seguimientos olvidados' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/8 border border-white/10 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Brand bar ────────────────────────────────────────────────────────────────

function BrandBar() {
  const brands = ['Botox', 'Dysport', 'Xeomin', 'Juvederm', 'Restylane', 'Sculptra']
  return (
    <section className="border-y border-border bg-card py-4 px-5">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <span className="text-xs text-muted-foreground">Compatible con:</span>
        {brands.map(b => (
          <span key={b} className="text-sm font-medium text-muted-foreground/70">{b}</span>
        ))}
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────

function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      title: 'Seguimientos manuales por WhatsApp',
      desc: 'Horas perdidas buscando a quién le toca mensaje hoy. Pacientes que se olvidan porque nadie las siguió.',
    },
    {
      icon: Camera,
      color: 'text-sky-500',
      bg: 'bg-sky-50',
      title: 'Sin evidencia visual de resultados',
      desc: 'Es difícil convencer a una paciente de retratarse si no puede ver el antes y el después objetivamente.',
    },
    {
      icon: AlertTriangle,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      title: 'La paciente no vuelve sin un empujón',
      desc: 'El toxin dura 4 meses. Sin recordatorio en el momento justo, la paciente se va a la competencia.',
    },
  ]

  return (
    <section className="py-20 px-5 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">El problema</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            La medicina estética todavía funciona<br className="hidden sm:block" /> de forma artesanal
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {problems.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="bg-card rounded-2xl border border-border p-6 shadow-[0_1px_4px_oklch(0_0_0/0.05)]">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${bg} mb-4`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <h3 className="font-semibold text-sm mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesGrid() {
  const features = [
    {
      icon: LayoutDashboard,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      title: 'Dashboard traffic light',
      desc: 'Verde, amarillo o rojo por paciente. Sabés exactamente quién necesita atención hoy, sin revisar cada historial.',
    },
    {
      icon: MessageSquare,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      title: 'WhatsApp automático',
      desc: '5 mensajes generados por IA con tu voz y tono, enviados en los días clave: día 0, 3, 14, 30 y 90.',
    },
    {
      icon: Camera,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      title: 'Fotos antes / después',
      desc: 'La paciente sube las fotos desde su celular. La IA mide los resultados y genera un reporte comparativo.',
    },
    {
      icon: Mic2,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      title: 'Tu voz, no un bot',
      desc: 'Configurás el tono, el pronombre y ejemplos de cómo escribís. Cada mensaje suena auténtico a tu clínica.',
    },
  ]

  return (
    <section id="features" className="py-20 px-5 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">Features</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Todo lo que tu clínica necesita</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border p-6 hover:shadow-[0_4px_16px_oklch(0_0_0/0.07)] transition-shadow bg-background">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bg} mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Registrá el tratamiento',
      desc: 'Elegí qué se hizo, con qué producto y en qué áreas. Aesthetic IQ calcula automáticamente cuándo es el próximo retratamiento.',
    },
    {
      n: '2',
      title: 'Aesthetic IQ hace el seguimiento',
      desc: '5 mensajes de WhatsApp generados por IA — personalizados con tu voz — se envían en los días clave sin que hagas nada.',
    },
    {
      n: '3',
      title: 'Medí los resultados',
      desc: 'La IA compara las fotos pre y post, calcula métricas por área y genera un reporte para vos y para la paciente.',
    },
  ]

  return (
    <section className="py-20 px-5 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">Cómo funciona</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">3 pasos, y el resto es automático</h2>
        </div>
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-7 left-[calc(16.66%+1px)] right-[calc(16.66%+1px)] h-px bg-border" />
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="text-center relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)] text-white text-lg font-bold mb-4 relative z-10">
                  {n}
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── WhatsApp mockup ──────────────────────────────────────────────────────────

function WhatsAppFeature() {
  const messages = [
    { day: 'Día 0', text: 'Hola Valentina! Gracias por tu visita hoy ✨ Recordá no frotarte la zona tratada y evitá ejercicio intenso. Cualquier duda, acá estoy.' },
    { day: 'Día 3', text: '¿Cómo te sentís? Ya deberías estar notando los primeros resultados. Normal que en algunos casos tarde hasta 7 días. Avisame cómo te fue.' },
    { day: 'Día 14', text: 'Llegó el momento de ver los resultados! Subí tus fotos acá → [link] Son solo 3 fotitos y nos ayuda mucho a evaluar tu evolución.' },
    { day: 'Día 30', text: 'Un mes del tratamiento y los resultados deberían estar en su punto máximo. ¿Cómo te sentís con los cambios?' },
    { day: 'Día 90', text: 'Se acerca el momento ideal para tu próximo retratamiento. ¿Coordinamos turno?' },
  ]

  return (
    <section className="py-20 px-5 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <MessageSquare className="h-3.5 w-3.5" />
            WhatsApp Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            5 mensajes.<br />Cero esfuerzo.<br />
            <span className="text-[var(--primary)]">En tu voz.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Aesthetic IQ genera cada mensaje usando tu tono, tus expresiones y los protocolos de tu clínica.
            No suena a chatbot. Suena a vos.
          </p>
          <ul className="space-y-2">
            {['Generados por Claude AI (Anthropic)', 'Con tu pronombre y nivel de formalidad', 'Incluyen el link de fotos cuando corresponde', 'Se escalán a vos si la paciente responde algo importante'].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Mockup */}
        <div className="bg-[#111] rounded-3xl p-5 space-y-3 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">V</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Valentina López</p>
              <p className="text-[10px] text-white/40">paciente</p>
            </div>
          </div>
          {messages.map(({ day, text }) => (
            <div key={day} className="flex justify-end">
              <div className="max-w-[85%]">
                <p className="text-[10px] text-white/30 text-right mb-1">{day}</p>
                <div className="bg-emerald-600 rounded-2xl rounded-tr-sm px-3.5 py-2.5">
                  <p className="text-xs text-white leading-relaxed">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Dashboard mockup ─────────────────────────────────────────────────────────

function DashboardFeature() {
  const kpis = [
    { value: '23', label: 'Pacientes activas', color: 'text-violet-600', bg: 'bg-violet-50' },
    { value: '5', label: 'Por retratarse esta semana', color: 'text-amber-600', bg: 'bg-amber-50' },
    { value: '2', label: 'En riesgo de churn', color: 'text-rose-600', bg: 'bg-rose-50' },
    { value: '3', label: 'Foto post pendiente', color: 'text-sky-600', bg: 'bg-sky-50' },
  ]

  const patients = [
    { name: 'Valentina López', status: 'green', next: '18 may', vip: true },
    { name: 'Camila Torres', status: 'yellow', next: '22 may', vip: false },
    { name: 'Sofía Martínez', status: 'red', next: 'Vencido', vip: false },
    { name: 'Luciana García', status: 'green', next: '02 jun', vip: true },
  ]

  const statusColors: Record<string, string> = {
    green: 'bg-emerald-400',
    yellow: 'bg-amber-400',
    red: 'bg-rose-500',
  }

  return (
    <section className="py-20 px-5 bg-background">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Mockup */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-[0_8px_32px_oklch(0_0_0/0.08)] space-y-4 order-2 lg:order-1">
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {kpis.map(({ value, label, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3`}>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
          {/* Patient rows */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 grid grid-cols-[1fr_auto_auto] gap-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Paciente</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Próximo</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Estado</span>
            </div>
            {patients.map(({ name, status, next, vip }) => (
              <div key={name} className="px-4 py-2.5 grid grid-cols-[1fr_auto_auto] gap-3 items-center border-t border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium truncate">{name}</span>
                  {vip && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">VIP</span>}
                </div>
                <span className="text-[11px] text-muted-foreground">{next}</span>
                <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Text */}
        <div className="space-y-5 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard inteligente
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sabés quién necesita<br />atención
            <span className="text-[var(--primary)]"> antes de que ella lo pida.</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            El sistema de semáforo te muestra de un vistazo qué pacientes están en riesgo,
            cuáles se tienen que retratar esta semana, y cuáles llevan más de 90 días sin contacto.
          </p>
          <ul className="space-y-2">
            {['Vista de todos tus pacientes activos en un solo lugar', 'Alertas automáticas de churn y retratamiento', 'Identifica pacientes VIP (4+ tratamientos al año)', 'Foto post pendiente destacada en rojo'].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ─── Trust bar ────────────────────────────────────────────────────────────────

function TrustBar() {
  const items = [
    { icon: Zap, text: 'Setup en menos de 20 minutos' },
    { icon: Shield, text: 'Datos seguros con RLS y cifrado' },
    { icon: Users, text: 'Pensado para clínicas LATAM' },
  ]
  return (
    <section className="py-10 px-5 bg-card border-y border-border">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-center gap-8">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <span className="text-sm font-medium">{text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 px-5 bg-[var(--sidebar)]">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--sidebar-accent)] mb-2">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Empezá gratis hoy
        </h2>
        <p className="text-white/60 text-base">
          Beta abierta para clínicas. Sin tarjeta de crédito.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-[var(--sidebar-accent)] text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-base"
        >
          Crear mi cuenta
          <ChevronRight className="h-5 w-5" />
        </Link>
        <p className="text-white/30 text-xs">Solo necesitás tu email.</p>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[var(--sidebar)] border-t border-white/10 py-6 px-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--sidebar-accent)]">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-white/70">Aesthetic IQ</span>
        </div>
        <p className="text-xs text-white/30">© 2026 Aesthetic IQ · Todos los derechos reservados</p>
        <Link href="/auth/login" className="text-xs text-white/40 hover:text-white/70 transition-colors">
          Ingresar →
        </Link>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandBar />
        <ProblemSection />
        <FeaturesGrid />
        <HowItWorks />
        <WhatsAppFeature />
        <DashboardFeature />
        <TrustBar />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
