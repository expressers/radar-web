import { Link, useParams } from 'react-router'
import { ExternalLink, MapPin, Phone } from 'lucide-react'
import { CoverImage, CategoryRow } from '@/components/feed/bits'
import { EventCard } from '@/components/feed/event-card'
import { CityMap, mapsDirUrl } from '@/components/map/city-map'
import { BookmarkButton, FollowButton, InviteButton } from '@/components/social/actions'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/use-query'
import { Q_LOCAL } from '@/lib/queries'
import { coverOf, primaryCategory } from '@/lib/theme'
import type { Local } from '@/lib/types'

export function LocalPage() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useQuery<{ local: Local | null }>(Q_LOCAL, { slug })
  const local = data?.local

  if (loading) return <div className="h-80 animate-pulse rounded-[2rem] bg-secondary" />
  if (error || !local) {
    return <p className="text-muted-foreground">{error ?? 'Este sítio não existe.'}</p>
  }

  const theme = primaryCategory(local.categories)
  const cover = coverOf({
    coverUrl: local.coverUrl,
    slug: local.slug,
    categories: local.categories,
  })

  return (
    <article>
      <div className="relative h-[min(56vh,480px)] overflow-hidden rounded-[2rem] bg-night">
        <CoverImage src={cover} alt="" accent={theme.hex} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
        <div className="absolute bottom-0 p-6 text-cream sm:p-8">
          <CategoryRow categories={local.categories} />
          <h1 className="mt-3 font-display text-4xl sm:text-6xl">{local.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-cream/80">
            <MapPin className="size-4" />
            {[local.address, local.zone, local.city].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FollowButton targetId={local.id} targetType="LOCAL" />
        <BookmarkButton targetId={local.id} targetType="LOCAL" />
        <InviteButton targetId={local.id} targetType="LOCAL" label={local.name} />
      </div>

      {local.description && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/90">
          {local.description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        {local.phone && (
          <Button asChild variant="outline" size="sm">
            <a href={`tel:${local.phone}`}>
              <Phone />
              {local.phone}
            </a>
          </Button>
        )}
        {local.website && (
          <Button asChild variant="outline" size="sm">
            <a href={local.website} target="_blank" rel="noreferrer">
              <ExternalLink />
              Site
            </a>
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <Link to={`/casas/${local.organization.slug}`}>{local.organization.name}</Link>
        </Button>
      </div>

      {local.taxiLinks && local.taxiLinks.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-2xl">Como chegar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Abre o pedido no teu serviço de táxi. A origem usa a tua posição quando o mapa a tiver.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {local.taxiLinks.map((t) => (
              <Button key={t.url} asChild variant="pulse" size="sm">
                <a href={t.url} target="_blank" rel="noreferrer">
                  {t.label}
                </a>
              </Button>
            ))}
            <Button asChild variant="outline" size="sm">
              <a href={mapsDirUrl(local.latitude, local.longitude)} target="_blank" rel="noreferrer">
                Abrir no mapa
              </a>
            </Button>
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-display text-2xl">No mapa</h2>
        <CityMap
          className="h-[320px] w-full"
          zoom={15}
          pins={[
            {
              id: local.id,
              name: local.name,
              latitude: local.latitude,
              longitude: local.longitude,
              color: theme.hex,
              subtitle: [local.address, local.zone, local.city].filter(Boolean).join(' · '),
            },
          ]}
        />
      </section>

      {(local.events ?? []).length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl">O que acontece aqui</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {local.events!.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
