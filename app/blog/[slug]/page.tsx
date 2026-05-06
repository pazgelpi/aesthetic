import { notFound } from 'next/navigation'
import Link from 'next/link'
import { posts, getPostBySlug, CATEGORY_LABELS, CATEGORY_COLORS, getFeaturedPosts } from '@/lib/blog/posts'
import { Sparkles, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} · Aesthetic IQ`,
    description: post.excerpt,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getFeaturedPosts(3).filter((p) => p.slug !== slug).slice(0, 2)
  const c = CATEGORY_COLORS[post.category]

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
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Méd·ica
            </Link>
            <Link href="/auth/login" className="text-sm font-medium bg-[var(--primary)] text-white px-4 py-1.5 rounded-xl hover:opacity-90 transition-opacity">
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero band */}
      <div
        className="h-48 sm:h-64"
        style={{
          background: post.category === 'investigacion'
            ? 'linear-gradient(135deg, oklch(0.12 0.03 290) 0%, oklch(0.22 0.08 300) 100%)'
            : post.category === 'entrevistas'
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

      <main className="max-w-6xl mx-auto px-5 -mt-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">
          {/* Article */}
          <article className="bg-card rounded-3xl border border-border p-8 sm:p-12 shadow-[0_4px_24px_oklch(0_0_0/0.06)]">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                {CATEGORY_LABELS[post.category]}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {post.readingTime} min de lectura
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">{formatDate(post.publishedAt)}</span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 pb-8 mb-8 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                {post.author.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-sm max-w-none text-foreground
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-4
                prose-ul:text-muted-foreground prose-ul:space-y-2
                prose-li:leading-relaxed
                prose-strong:text-foreground prose-strong:font-semibold
                prose-em:italic
                prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:pb-2
                prose-td:py-2 prose-td:pr-4 prose-td:border-b prose-td:border-border
                [&_table]:w-full [&_table]:border-collapse [&_thead]:border-b-2 [&_thead]:border-border"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 pt-0">
            {/* CTA */}
            <div className="rounded-2xl bg-[var(--sidebar)] p-6 space-y-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--sidebar-accent)] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                Automatizá el seguimiento de tus pacientes
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Aesthetic IQ implementa todo lo que leíste: seguimiento digital, análisis de fotos y mensajes en tu voz.
              </p>
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 bg-[var(--sidebar-accent)] text-white text-xs font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity w-full"
              >
                Probar gratis <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">También te puede interesar</p>
                {related.map((rel) => {
                  const rc = CATEGORY_COLORS[rel.category]
                  return (
                    <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group block">
                      <div className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}>
                          {CATEGORY_LABELS[rel.category]}
                        </span>
                        <p className="text-xs font-semibold mt-2 leading-snug group-hover:text-[var(--primary)] transition-colors" style={{ fontFamily: 'var(--font-playfair)' }}>
                          {rel.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{rel.readingTime} min</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </aside>
        </div>
      </main>

      <div className="max-w-6xl mx-auto px-5 py-12 mt-6">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Méd·ica
        </Link>
      </div>
    </div>
  )
}
