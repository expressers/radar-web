import { Link, useParams } from 'react-router'
import { CoverImage, CategoryRow } from '@/components/feed/bits'
import { EventCard } from '@/components/feed/event-card'
import { LocalCard } from '@/components/feed/local-card'
import { CityMap } from '@/components/map/city-map'
import { BookmarkButton } from '@/components/social/actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery } from '@/hooks/use-query'
import { Q_ARTICLE } from '@/lib/queries'
import { coverOf, primaryCategory } from '@/lib/theme'
import { formatDate } from '@/lib/format'
import type { Article } from '@/lib/types'

export function ArticlePage() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useQuery<{ article: Article | null }>(Q_ARTICLE, {
    slug,
  })
  const article = data?.article

  if (loading) return <div className="h-80 animate-pulse rounded-[2rem] bg-secondary" />
  if (error || !article) {
    return <p className="text-muted-foreground">{error ?? 'Este texto não existe.'}</p>
  }

  const theme = primaryCategory(article.categories)
  const cover = coverOf({
    coverUrl: article.coverUrl,
    slug: article.slug,
    categories: article.categories,
  })

  return (
    <article className="mx-auto max-w-3xl">
      <div className="relative h-72 overflow-hidden rounded-[2rem] bg-night">
        <CoverImage src={cover} alt="" accent={theme.hex} className="absolute inset-0" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {formatDate(article.publishedAt)}
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{article.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link to={`/u/${article.author.username}`} className="flex items-center gap-2">
          <Avatar className="size-9">
            {article.author.avatarUrl && <AvatarImage src={article.author.avatarUrl} />}
            <AvatarFallback name={article.author.name} />
          </Avatar>
          <span className="text-sm font-medium">{article.author.name}</span>
        </Link>
        <BookmarkButton targetId={article.id} targetType="ARTICLE" />
      </div>
      <CategoryRow categories={article.categories} className="mt-4" />
      {article.excerpt && (
        <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{article.excerpt}</p>
      )}
      <div className="mt-6 space-y-4 text-lg leading-8">
        {article.body.split('\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {article.locals.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-2xl">Sítios neste texto</h2>
          <CityMap
            className="mb-4 h-[280px] w-full"
            pins={article.locals.map((local) => ({
              id: local.id,
              name: local.name,
              latitude: local.latitude,
              longitude: local.longitude,
              href: `/sitios/${local.slug}`,
              color: primaryCategory(local.categories).hex,
              subtitle: local.zone ?? local.city,
            }))}
          />
          <div className="grid gap-4">
            {article.locals.map((local) => (
              <LocalCard key={local.id} local={local} compact />
            ))}
          </div>
        </section>
      )}

      {article.events.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-2xl">Eventos</h2>
          <div className="grid gap-4">
            {article.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
