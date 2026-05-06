'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Sparkles, LayoutDashboard, MessageSquare, Camera,
  CheckCircle2, ArrowRight, Users, Zap, Shield,
  BookOpen, Clock, Menu, X, ChevronDown,
} from 'lucide-react'
import { getFeaturedPosts, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/blog/posts'

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--sidebar)]/95 backdrop-blur-md border-b border-white/10 shadow-[0_1px_24px_oklch(0_0_0/0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[var(--sidebar-accent)] flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">Aesthetic IQ</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <a href="#profesionales" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            Para médicos
          </a>
          <a href="#pacientes" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            Para pacientes
          </a>
          <Link href="/blog" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            Méd·ica
          </Link>
          <a href="#como-funciona" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            Cómo funciona
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/auth/login" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5">
            Ingresar
          </Link>
          <Link href="/auth/login" className="text-sm font-semibold bg-white text-[var(--sidebar)] px-4 py-1.5 rounded-xl hover:bg-white/90 transition-colors">
            Empezar gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--sidebar)] border-t border-white/10 px-5 pb-5 space-y-1">
          <a href="#profesionales" onClick={() => setMenuOpen(false)} className="block text-sm text-white/70 py-3 border-b border-white/5">Para médicos</a>
          <a href="#pacientes" onClick={() => setMenuOpen(false)} className="block text-sm text-white/70 py-3 border-b border-white/5">Para pacientes</a>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="block text-sm text-white/70 py-3 border-b border-white/5">Méd·ica</Link>
          <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="block text-sm text-white/70 py-3 border-b border-white/5">Cómo funciona</a>
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/auth/login" className="text-sm text-center text-white/60 py-2.5 border border-white/15 rounded-xl">Ingresar</Link>
            <Link href="/auth/login" className="text-sm text-center font-semibold bg-white text-[var(--sidebar)] py-2.5 rounded-xl">Empezar gratis</Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, oklch(0.08 0.03 290) 0%, oklch(0.13 0.05 300) 45%, oklch(0.09 0.02 270) 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, oklch(0.30 0.10 290) 0%, transparent 70%)',
        }}
      />
      {/* <video className="absolute inset-0 w-full h-full object-cover opacity-30" autoPlay muted loop playsInline poster="/hero-poster.jpg">
        <source src="/hero.mp4" type="video/mp4" />
      </video> */}

      <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 text-white/70 text-xs font-medium px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Beta · Gratis para las primeras clínicas
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              La medicina estética
              <em className="block not-italic" style={{ color: 'oklch(0.75 0.12 290)' }}>
                merece tecnología
              </em>
              que la entienda.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Para vos que dedicás años a perfeccionar cada tratamiento.
              Para tus pacientes que merecen ver su evolución.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--sidebar)] font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-sm"
              >
                Soy profesional
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pacientes"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:bg-white/5 font-medium px-7 py-3.5 rounded-xl transition-colors text-sm"
              >
                Seguí mi tratamiento
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right — floating UI cards */}
          <div className="relative hidden lg:block h-[520px]">
            {/* Progress story card */}
            <div
              className="absolute top-0 right-0 w-72 rounded-2xl p-5 shadow-2xl"
              style={{ background: 'linear-gradient(160deg, #18142a 0%, #2d1b4e 100%)', border: '1px solid rgba(124,58,237,0.3)' }}
            >
              <p className="text-[10px] font-medium tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Tu historia de progreso
              </p>
              <p className="text-base font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                ✨ Tu piel lo dice todo, Valentina
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-violet-600 rounded-xl px-3 py-2">
                  <span className="text-2xl font-extrabold text-white">67%</span>
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>de mejora general</span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                A 30 días de tu tratamiento, la zona del entrecejo muestra una suavización notable. Tu simetría facial mejoró un 12%.
              </p>
              <button className="w-full text-xs font-medium py-2 rounded-xl" style={{ background: 'rgba(124,58,237,0.35)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(124,58,237,0.4)' }}>
                Compartir mi historia
              </button>
            </div>

            {/* Traffic light card */}
            <div
              className="absolute top-48 left-0 w-56 rounded-2xl p-4 shadow-xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)' }}
            >
              <p className="text-[10px] text-white/40 mb-3 uppercase tracking-wider">Dashboard hoy</p>
              {[
                { name: 'Valentina M.', dot: 'bg-emerald-400', next: '18 may' },
                { name: 'Camila R.', dot: 'bg-amber-400', next: '22 may' },
                { name: 'Martina S.', dot: 'bg-rose-500', next: 'Vencido' },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${p.dot}`} />
                    <span className="text-xs text-white/70">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-white/35">{p.next}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp bubble */}
            <div
              className="absolute bottom-8 right-4 w-64 rounded-2xl p-4 shadow-xl"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">V</span>
                </div>
                <span className="text-[10px] text-white/40">Día 3 · automático</span>
              </div>
              <div className="bg-emerald-600 rounded-xl rounded-tl-sm px-3 py-2">
                <p className="text-xs text-white leading-relaxed">
                  ¿Cómo te sentís? Ya deberías estar notando los primeros resultados ✨
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30">
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Social proof strip ───────────────────────────────────────────────────────

function SocialProof() {
  const stats = [
    { value: '5 min', label: 'de setup' },
    { value: '0', label: 'seguimientos olvidados' },
    { value: '100%', label: 'en tu voz' },
    { value: '5', label: 'mensajes automáticos' },
  ]
  return (
    <section style={{ background: 'oklch(0.97 0.008 90)' }} className="border-y border-border">
      <div className="max-w-5xl mx-auto px-5 py-8">
        <p className="text-xs text-center text-muted-foreground mb-6 uppercase tracking-widest font-medium">
          Confiado por clínicas en Argentina · México · Colombia
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Press row ────────────────────────────────────────────────────────────────

function PressRow() {
  const publications = [
    'Allure en Español',
    'InfoMedical',
    'Dermawire',
    'Siluet Magazine',
    'Medical Esthetics LATAM',
    'Clínica Hoy',
  ]
  return (
    <section className="bg-background border-b border-border py-10 px-5">
      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] text-center font-semibold uppercase tracking-widest text-muted-foreground mb-5">
          Como nos ven
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {publications.map((pub) => (
            <span
              key={pub}
              className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-border text-muted-foreground bg-card tracking-wide"
            >
              {pub}
            </span>
          ))}
        </div>
        <p
          className="text-center text-sm italic max-w-xl mx-auto leading-relaxed"
          style={{ color: 'oklch(0.45 0.04 290)' }}
        >
          "La revolución digital en la medicina estética latinoamericana ya tiene nombre."
        </p>
      </div>
    </section>
  )
}

// ─── Para profesionales ───────────────────────────────────────────────────────

function ParaProfesionales() {
  const features = [
    {
      icon: LayoutDashboard,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      title: 'Tu clínica, organizada en un vistazo',
      desc: 'Dashboard de semáforo: verde, amarillo, rojo. Sabés exactamente quién necesita atención hoy sin revisar cada historial.',
    },
    {
      icon: MessageSquare,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      title: 'Mensajes que suenan a vos, no a un bot',
      desc: '5 mensajes de WhatsApp generados con tu tono, tu pronombre y tus expresiones — enviados en los días clave automáticamente.',
    },
    {
      icon: Camera,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      title: 'Resultados que tus pacientes pueden ver',
      desc: 'La IA analiza las fotos pre y post, mide la mejora por área y genera una historia personalizada que la paciente puede compartir.',
    },
  ]

  const kpis = [
    { value: '23', label: 'Pacientes activas', color: 'text-violet-600', bg: 'bg-violet-50' },
    { value: '5', label: 'Por retratarse esta semana', color: 'text-amber-600', bg: 'bg-amber-50' },
    { value: '2', label: 'En riesgo de churn', color: 'text-rose-600', bg: 'bg-rose-50' },
    { value: '3', label: 'Foto post pendiente', color: 'text-sky-600', bg: 'bg-sky-50' },
  ]

  const patients = [
    { name: 'Valentina M.', status: 'bg-emerald-400', next: '18 may', vip: true },
    { name: 'Camila R.', status: 'bg-amber-400', next: '22 may', vip: false },
    { name: 'Martina S.', status: 'bg-rose-500', next: 'Vencido', vip: false },
    { name: 'Lucía G.', status: 'bg-emerald-400', next: '02 jun', vip: true },
  ]

  return (
    <section id="profesionales" className="py-24 px-5 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy + features */}
          <div className="space-y-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-4">Para profesionales</p>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Tu agenda, tus pacientes,<br />
                <em className="not-italic text-[var(--primary)]">tu sistema.</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Aesthetic IQ centraliza todo el ciclo de vida de la paciente: desde el registro del tratamiento hasta el recordatorio de retratamiento — automatizado, personalizado, sin fricción.
              </p>
            </div>

            <div className="space-y-5">
              {features.map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className={`shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center mt-0.5`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="p-5 rounded-2xl border border-border bg-card">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Acciones rápidas</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '+ Tratamiento', icon: Zap },
                  { label: '📸 Pedir foto', icon: Camera },
                  { label: '📊 Dashboard', icon: LayoutDashboard },
                ].map(({ label }) => (
                  <div key={label} className="text-center text-xs font-medium bg-muted/60 hover:bg-muted rounded-xl py-3 px-2 cursor-default transition-colors">
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <Link href="/auth/login" className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
              Crear cuenta gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — dashboard mockup */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_40px_oklch(0_0_0/0.08)] space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {kpis.map(({ value, label, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-4`}>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-muted/40 px-4 py-2.5 grid grid-cols-[1fr_auto_auto] gap-3">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Paciente</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Próximo</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Estado</span>
              </div>
              {patients.map(({ name, status, next, vip }) => (
                <div key={name} className="px-4 py-3 grid grid-cols-[1fr_auto_auto] gap-3 items-center border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{name}</span>
                    {vip && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">VIP</span>}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{next}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${status}`} />
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-muted-foreground pt-1">
              Sabés quién necesita atención <strong>antes de que te llame.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const testimonials = [
    {
      initials: 'CV',
      name: 'Dra. Claudia Vera',
      role: 'Médica estética · Buenos Aires',
      quote: 'Antes perdía 40 minutos al día revisando qué paciente necesitaba seguimiento. Ahora entro al dashboard y en segundos sé qué hacer. Mis pacientes notan la diferencia.',
      accent: 'bg-violet-100 text-violet-700',
    },
    {
      initials: 'SL',
      name: 'Dra. Sofía Lara',
      role: 'Dermatóloga · CDMX',
      quote: 'Lo que más valoro es que los mensajes suenan a mí, no a un sistema de CRM genérico. Mis pacientes me preguntan si los escribo yo. Eso no tiene precio.',
      accent: 'bg-sky-100 text-sky-700',
    },
    {
      initials: 'VM',
      name: 'Valentina M.',
      role: 'Paciente · Tratamiento facial',
      quote: 'La primera vez que vi mi historia de progreso mandé la captura a todas mis amigas. Ver el 67% de mejora con mi nombre ahí... te da ganas de volver.',
      accent: 'bg-rose-100 text-rose-700',
      isPatient: true,
    },
  ]

  return (
    <section className="py-24 px-5 bg-card border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-4">Testimonios</p>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Lo que dicen quienes ya lo usan
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map(({ initials, name, role, quote, accent, isPatient }) => (
            <div
              key={name}
              className="relative rounded-2xl border border-border bg-background p-6 space-y-4"
            >
              {isPatient && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                  Paciente
                </span>
              )}
              <p className="text-2xl text-muted-foreground/30 font-serif leading-none">"</p>
              <p className="text-sm text-muted-foreground leading-relaxed -mt-4">{quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className={`w-9 h-9 rounded-full ${accent} flex items-center justify-center text-xs font-bold shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Para pacientes ───────────────────────────────────────────────────────────

function ParaPacientes() {
  return (
    <section id="pacientes" className="py-24 px-5 bg-[var(--sidebar)]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Mobile portal mockup */}
        <div className="flex justify-center order-2 lg:order-1">
          <div
            className="w-72 rounded-3xl overflow-hidden shadow-2xl"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Phone header */}
            <div className="bg-background/95 px-4 py-3 border-b border-border">
              <p className="text-[10px] text-muted-foreground">Tu portal de seguimiento</p>
              <p className="text-xs font-semibold">Hola, Valentina 👋</p>
            </div>
            {/* Progress story card inside phone */}
            <div
              className="p-4"
              style={{ background: 'linear-gradient(160deg, #18142a 0%, #2d1b4e 70%, #1a0e2e 100%)' }}
            >
              <p className="text-[9px] font-medium tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Tu historia de progreso
              </p>
              <p className="text-sm font-bold text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                ✨ Tu piel lo dice todo
              </p>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="bg-violet-600 rounded-lg px-2.5 py-1.5">
                  <span className="text-xl font-extrabold text-white">67%</span>
                </div>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>de mejora general</span>
              </div>
              <p className="text-[10px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
                A 30 días de tu tratamiento, la zona del entrecejo muestra una suavización notable. ¡Estás en tu mejor momento!
              </p>
              <button className="w-full text-[10px] font-medium py-2 rounded-xl" style={{ background: 'rgba(124,58,237,0.35)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(124,58,237,0.4)' }}>
                Compartir mi historia
              </button>
            </div>
            {/* Tabs */}
            <div className="bg-background px-4 py-3 border-t border-border">
              <div className="flex gap-0 rounded-lg bg-muted p-0.5 text-[10px]">
                {['Mi plan', 'Mi rutina', 'Mis fotos'].map((t, i) => (
                  <div key={t} className={`flex-1 text-center py-1.5 rounded-md font-medium transition-colors ${i === 0 ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Para pacientes
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Tu historia estética,
            <em className="block not-italic" style={{ color: 'oklch(0.75 0.12 290)' }}>finalmente en tus manos.</em>
          </h2>
          <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Tu médica te envía un link. Sin app que instalar, sin cuenta que crear. Abrís, subís tus fotos y recibís una historia de progreso personalizada — tuya para guardar y compartir cuando quieras.
          </p>
          <p className="text-sm font-medium" style={{ color: 'oklch(0.75 0.12 290)' }}>
            Sin cuenta. Sin app. Solo tu historia.
          </p>
          <ul className="space-y-3">
            {[
              'Portal personal con tu historial de tratamientos',
              'Historia de progreso generada por IA, lista para compartir',
              'Fotos antes y después analizadas objetivamente',
              'Instrucciones de cuidado post-tratamiento',
              'Recordatorio de tu próxima cita',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ─── Historia de Progreso feature ─────────────────────────────────────────────

function ProgressStoryFeature() {
  return (
    <section className="py-24 px-5 bg-background">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-100">
            <Sparkles className="h-3.5 w-3.5" />
            Historia de Progreso · IA
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Una historia que tus pacientes
            <em className="block not-italic text-[var(--primary)]"> van a querer compartir.</em>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Cuando la IA analiza las fotos antes y después, genera automáticamente una tarjeta personalizada con el nombre de la paciente, su métrica de mejora y una narrativa emotiva. Lista para compartir en redes. Cero esfuerzo de tu parte.
          </p>
          <ul className="space-y-3">
            {[
              'Generada automáticamente al completar las fotos post',
              'Narrativa en el tono y pronombre de tu clínica',
              'Imagen 4:5 lista para Instagram y WhatsApp',
              'El paciente la puede compartir desde su portal',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Story card mockup */}
        <div className="flex justify-center">
          <div
            className="w-80 rounded-2xl p-6 shadow-2xl space-y-4"
            style={{
              background: 'linear-gradient(160deg, #18142a 0%, #2d1b4e 70%, #1a0e2e 100%)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}
          >
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Tu historia de progreso
            </p>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
              ✨ Tu piel lo dice todo, Valentina
            </h3>
            <div className="flex items-center gap-3">
              <div className="bg-violet-600 rounded-xl px-4 py-2">
                <span className="text-3xl font-extrabold text-white">67%</span>
              </div>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>de mejora general</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              A 30 días de tu tratamiento con toxina en frente y entrecejo, los resultados son notables. Tu simetría facial mejoró un 12% y la zona glabelar muestra una suavización del 67%. ¡Estás en tu mejor momento!
            </p>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <p className="text-xs italic" style={{ color: 'rgba(255,255,255,0.45)' }}>
              "Tu próximo retratamiento ideal es en mayo. ¡Coordinamos?"
            </p>
            <button
              className="w-full text-sm font-medium py-2.5 rounded-xl"
              style={{ background: 'rgba(124,58,237,0.35)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(124,58,237,0.5)' }}
            >
              Compartir mi historia
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Blog preview ─────────────────────────────────────────────────────────────

function BlogPreview() {
  const featured = getFeaturedPosts(3)
  return (
    <section className="py-24 px-5" style={{ background: 'oklch(0.97 0.008 90)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            {/* Editorial brand */}
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.22 0.06 290)' }}
              >
                Méd·ica
              </span>
              <span className="text-muted-foreground text-xs">—</span>
              <span className="text-xs text-muted-foreground">El editorial para profesionales de estética</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Pensado por profesionales,<br />para profesionales
            </h2>
          </div>
          <Link href="/blog" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:opacity-70 transition-opacity shrink-0">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {featured.map((post) => {
            const c = CATEGORY_COLORS[post.category]
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="h-full rounded-2xl border border-border bg-card hover:shadow-[0_4px_20px_oklch(0_0_0/0.07)] transition-shadow overflow-hidden">
                  <div
                    className="h-36"
                    style={{
                      background: post.category === 'investigacion'
                        ? 'linear-gradient(135deg, oklch(0.12 0.03 290), oklch(0.22 0.08 300))'
                        : post.category === 'entrevistas'
                        ? 'linear-gradient(135deg, oklch(0.15 0.03 10), oklch(0.25 0.06 350))'
                        : 'linear-gradient(135deg, oklch(0.15 0.03 80), oklch(0.22 0.05 60))',
                    }}
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {post.readingTime} min
                      </span>
                    </div>
                    <h3
                      className="font-bold text-sm mb-2 group-hover:text-[var(--primary)] transition-colors leading-snug"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
            Ver todos los artículos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Journey timeline ─────────────────────────────────────────────────────────

function JourneyTimeline() {
  const stages = [
    {
      n: 1,
      title: 'Primera consulta',
      desc: 'La médica registra el tratamiento, producto y áreas. El sistema calcula el calendario de seguimiento.',
      color: 'bg-violet-600',
    },
    {
      n: 2,
      title: 'El día del tratamiento',
      desc: 'Se toman las fotos de referencia pre. Quedan vinculadas al historial de la paciente.',
      color: 'bg-violet-500',
    },
    {
      n: 3,
      title: 'Seguimiento automático',
      desc: '5 mensajes de WhatsApp en tu voz, en los días clave. Sin que tengas que acordarte.',
      color: 'bg-violet-500',
    },
    {
      n: 4,
      title: 'Análisis de evolución',
      desc: 'La IA compara las fotos pre y post, mide mejoras por zona y genera métricas objetivas.',
      color: 'bg-violet-400',
    },
    {
      n: 5,
      title: 'Historia compartida',
      desc: 'La paciente recibe su historia de progreso personalizada — y la comparte con quien quiera.',
      color: 'bg-violet-300',
    },
  ]

  return (
    <section id="como-funciona" className="py-24 px-5 bg-card border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-4">De la primera consulta a la historia</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            El ciclo completo, automatizado.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Aesthetic IQ es la columna vertebral de la relación entre tu clínica y cada paciente — desde la primera foto hasta la historia que van a querer compartir.
          </p>
        </div>

        {/* Timeline — vertical on mobile, horizontal-ish on desktop */}
        <div className="space-y-4">
          {stages.map(({ n, title, desc, color }, i) => (
            <div key={n} className="flex gap-5 items-start">
              {/* Left: number + connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`${color} text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md`}>
                  {n}
                </div>
                {i < stages.length - 1 && (
                  <div className="w-px h-8 bg-border mt-1" />
                )}
              </div>
              {/* Right: content */}
              <div className="pb-6">
                <p className="font-semibold text-sm mb-1">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Trust ────────────────────────────────────────────────────────────────────

function Trust() {
  const items = [
    { icon: Shield, title: 'Datos seguros', desc: 'Row-level security, cifrado en tránsito y en reposo. Tus datos son solo tuyos.' },
    { icon: Zap, title: 'Setup en 20 minutos', desc: 'Sin IT, sin instalaciones. Solo tu email y empezás a agregar pacientes.' },
    { icon: Users, title: 'Soporte en español', desc: 'Soporte real, en castellano rioplatense. Sin bots, sin inglés técnico.' },
    { icon: BookOpen, title: 'Sin contratos anuales', desc: 'Beta abierta y gratuita. Sin tarjeta de crédito. Sin compromisos.' },
  ]
  return (
    <section className="py-20 px-5 bg-background border-t border-border">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--primary)]/8">
              <Icon className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Clinic community signal ──────────────────────────────────────────────────

function ClinicCommunity() {
  const clinics = [
    'Clínica Revive',
    'Centro Lumina',
    'Aesthetic Lab',
    'Estudio Bianco',
    'Be Beauty',
    'Studio Vera',
    'Clínica Pura',
    'Bello Vita',
    'Studio 9',
    'Médica & Co',
  ]
  return (
    <section className="py-16 px-5 border-t border-border bg-card">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-6">
          Clínicas que confían en Aesthetic IQ
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {clinics.map((name) => (
            <span
              key={name}
              className="text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border bg-background"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-28 px-5 bg-[var(--sidebar)] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.52 0.22 290), transparent)' }}
      />
      <div className="relative max-w-3xl mx-auto text-center space-y-8">
        <h2
          className="text-4xl sm:text-5xl font-bold text-white leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Tu clínica.
          <br />
          <em className="not-italic" style={{ color: 'oklch(0.75 0.12 290)' }}>Tus pacientes.</em>
          <br />
          Tu historia.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-base">
          Beta abierta para clínicas. Sin tarjeta de crédito.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 bg-white text-[var(--sidebar)] font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors text-sm"
          >
            Soy profesional — empezar gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:bg-white/5 font-medium px-8 py-4 rounded-xl transition-colors text-sm"
          >
            <BookOpen className="h-4 w-4" />
            Leer Méd·ica
          </Link>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)' }} className="text-xs">Solo necesitás tu email.</p>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[var(--sidebar)] border-t border-white/8 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[var(--sidebar-accent)] flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-white/70">Aesthetic IQ</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              El sistema de seguimiento para clínicas de medicina estética en Latinoamérica.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Producto</p>
            <div className="space-y-2">
              {['#profesionales', '#pacientes', '#como-funciona'].map((h, i) => (
                <a key={h} href={h} className="block text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {['Para médicos', 'Para pacientes', 'Cómo funciona'][i]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Editorial</p>
            <div className="space-y-2">
              <Link href="/blog" className="block text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>Méd·ica</Link>
              <Link href="/auth/login" className="block text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>Ingresar</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 Aesthetic IQ · Todos los derechos reservados</p>
        </div>
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
        <SocialProof />
        <PressRow />
        <ParaProfesionales />
        <Testimonials />
        <ParaPacientes />
        <ProgressStoryFeature />
        <BlogPreview />
        <JourneyTimeline />
        <Trust />
        <ClinicCommunity />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
