import { Link } from 'react-router'
import { MapPin } from 'lucide-react'
import { CoverImage, CategoryRow } from '@/components/feed/bits'
import { coverOf, primaryCategory } from '@/lib/theme'
import { formatPrice, formatWhen } from '@/lib/format'
import type { Event } from '@/lib/types'
import { cn } from '@/lib/utils'

export function EventCard({
  event,
  featured = false,
  distanceMeters,
  className,
}: {
  event: Event
  featured?: boolean
  distanceMeters?: number
  className?: string
}) {
  const theme = primaryCategory(event.categories)
  const cover = coverOf({
    coverUrl: event.coverUrl,
    slug: event.slug,
    categories: event.categories,
  })

  return (
    <Link
      to={`/acontece/${event.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-night text-cream shadow-lg transition-transform hover:-translate-y-0.5',
        featured ? 'min-h-[420px]' : 'min-h-[280px]',
        className,
      )}
    >
      <CoverImage
        src={cover}
        alt=""
        accent={theme.hex}
        className="absolute inset-0"
      />
      <div className="relative mt-auto flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-cream/80">
          <span
            className="rounded-full px-2.5 py-0.5 font-semibold uppercase tracking-wider"
            style={{ background: theme.hex }}
          >
            {formatWhen(event.startsAt)}
          </span>
          <span>{formatPrice(event.priceMin, event.priceMax)}</span>
        </div>
        <h3
          className={cn(
            'font-display leading-[1.1] tracking-tight',
            featured ? 'text-4xl' : 'text-2xl',
          )}
        >
          {event.title}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-cream/75">
          <MapPin className="size-3.5" />
          {event.local.name}
          {event.local.zone ? ` · ${event.local.zone}` : ''}
          {distanceMeters != null && (
            <span className="text-pulse"> · {(distanceMeters / 1000).toFixed(1).replace('.', ',')} km</span>
          )}
        </p>
        <CategoryRow categories={event.categories} />
      </div>
    </Link>
  )
}
