import Link from 'next/link'
import { posts, CATEGORY_LABELS, CATEGORY_COLORS, BlogCategory } from '@/lib/blog/posts'
import { Sparkles, Clock, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recursos · Aesthetic IQ',
  description: 'Investigación, entrevistas y guías de formulaciones para profesionales de la medicina estética.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPage() {
  const categories = Array.from(new Set(posts.map((p) => p.category))) as BlogCategory[]

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[var(--sidebar-accent)] flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Aesthetic IQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Inicio</Link>
            <span className="text-xs font-medium text-muted-foreground/50" style={{ fontFamily: 'var(--font-playfair)' }}>Méd·ica</span>
            <Link href="/auth/login" className="text-sm font-medium bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity">
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-16">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.22 0.06 290)' }}>
              Méd·ica
            </span>
            <span className="text-muted-foreground text-sm">—</span>
            <span className="text-sm text-muted-foreground">El editorial para profesionales de estética</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Pensado por profesionales,<br />para profesionales
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Investigación clínica, entrevistas con especialistas, guías de formulaciones y análisis de la tecnología que está cambiando la medicina estética en Latinoamérica.
          </p>
        </div>

        {/* Category filter — static for SSR, no JS needed */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const c = CATEGORY_COLORS[cat]
            return (
              <span key={cat} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                {CATEGORY_LABELS[cat]}
              </span>
            )
          })}
        </div>

        {/* Featured article */}
        <div className="mb-10">
          <Link href={`/blog/${posts[0].slug}`} className="group block">
            <div className="grid lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden border border-border hover:shadow-[0_8px_40px_oklch(0_0_0/0.1)] transition-shadow">
              <div
                className="lg:col-span-2 min-h-[240px] lg:min-h-auto"
                style={{ background: 'linear-gradient(135deg, oklch(0.12 0.03 290) 0%, oklch(0.22 0.08 300) 100%)' }}
              />
              <div className="lg:col-span-3 p-8 bg-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[posts[0].category].bg} ${CATEGORY_COLORS[posts[0].category].text} ${CATEGORY_COLORS[posts[0].category].border}`}>
                      {CATEGORY_LABELS[posts[0].category]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {posts[0].readingTime} min
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight mb-3 group-hover:text-[var(--primary)] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {posts[0].title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{posts[0].excerpt}</p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-xs font-medium">{posts[0].author}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(posts[0].publishedAt)}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-[var(--primary)] group-hover:gap-2 transition-all">
                    Leer <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Article grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => {
            const c = CATEGORY_COLORS[post.category]
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="h-full rounded-2xl border border-border bg-card hover:shadow-[0_4px_20px_oklch(0_0_0/0.07)] transition-shadow overflow-hidden">
                  <div
                    className="h-32"
                    style={{
                      background: post.category === 'entrevistas'
                        ? 'linear-gradient(135deg, oklch(0.15 0.03 10) 0%, oklch(0.25 0.06 350) 100%)'
                        : post.category === 'formulaciones'
                        ? 'linear-gradient(135deg, oklch(0.15 0.03 80) 0%, oklch(0.22 0.05 60) 100%)'
                        : post.category === 'papers'
                        ? 'linear-gradient(135deg, oklch(0.12 0.03 240) 0%, oklch(0.20 0.05 220) 100%)'
                        : post.category === 'tecnologia'
                        ? 'linear-gradient(135deg, oklch(0.12 0.03 160) 0%, oklch(0.20 0.06 140) 100%)'
                        : 'linear-gradient(135deg, oklch(0.13 0.03 50) 0%, oklch(0.22 0.06 30) 100%)',
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
                    <h3 className="font-bold text-sm mb-2 group-hover:text-[var(--primary)] transition-colors leading-snug" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{post.author}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </main>

      {/* CTA footer */}
      <div className="border-t border-border bg-card">
        <div className="max-w-4xl mx-auto px-5 py-16 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            ¿Querés ver todo esto en tu clínica?
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Aesthetic IQ es el sistema de seguimiento que implementa todo lo que leíste — automatizado, en tu voz.
          </p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-medium px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm">
            Probar gratis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
