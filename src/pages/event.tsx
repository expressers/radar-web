import { Link, useParams } from 'react-router'
import { MapPin } from 'lucide-react'
import { CoverImage, CategoryRow } from '@/components/feed/bits'
import { CityMap, mapsDirUrl } from '@/components/map/city-map'
import { BookmarkButton, InviteButton } from '@/components/social/actions'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/use-query'
import { Q_EVENT } from '@/lib/queries'
import { coverOf, primaryCategory } from '@/lib/theme'
import { formatPrice, formatWhen } from '@/lib/format'
import type { Event } from '@/lib/types'

export function EventPage() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useQuery<{ event: Event | null }>(Q_EVENT, { slug })
  const event = data?.event

  if (loading) return <div className="h-80 animate-pulse rounded-[2rem] bg-secondary" />
  if (error || !event) {
    return <p className="text-muted-foreground">{error ?? 'Este evento não existe.'}</p>
  }

  const theme = primaryCategory(event.categories)
  const cover = coverOf({
    coverUrl: event.coverUrl,
    slug: event.slug,
    categories: event.categories,
  })

  return (
    <article>
      <div className="relative h-[min(56vh,480px)] overflow-hidden rounded-[2rem] bg-night">
        <CoverImage src={cover} alt="" accent={theme.hex} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
        <div className="absolute bottom-0 p-6 text-cream sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-cream/80">
            {formatWhen(event.startsAt)}
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-6xl">{event.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-cream/80">
            <MapPin className="size-4" />
            {event.local.name}
            {event.local.zone ? ` · ${event.local.zone}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <BookmarkButton targetId={event.id} targetType="EVENT" />
        <InviteButton targetId={event.id} targetType="EVENT" label={event.title} />
        <span className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
          {formatPrice(event.priceMin, event.priceMax)}
        </span>
      </div>

      <CategoryRow categories={event.categories} className="mt-4" />

      {event.description && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{event.description}</p>
      )}

      <Link
        to={`/sitios/${event.local.slug}`}
        className="mt-8 block rounded-[1.5rem] border border-border bg-card p-5 transition hover:shadow-md"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          O sítio
        </p>
        <p className="font-display text-2xl">{event.local.name}</p>
        <p className="text-sm text-muted-foreground">
          {[event.local.zone, event.local.city].filter(Boolean).join(' · ')}
        </p>
      </Link>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">No mapa</h2>
          <Button asChild variant="outline" size="sm">
            <a
              href={mapsDirUrl(event.local.latitude, event.local.longitude)}
              target="_blank"
              rel="noreferrer"
            >
              Como chegar
            </a>
          </Button>
        </div>
        <CityMap
          className="h-[320px] w-full"
          zoom={15}
          pins={[
            {
              id: event.local.id,
              name: event.local.name,
              latitude: event.local.latitude,
              longitude: event.local.longitude,
              href: `/sitios/${event.local.slug}`,
              color: theme.hex,
              subtitle: event.title,
            },
          ]}
        />
      </section>
    </article>
  )
}
