import { Link } from 'react-router'
import { MapPin } from 'lucide-react'
import { CoverImage, CategoryRow } from '@/components/feed/bits'
import { coverOf, primaryCategory } from '@/lib/theme'
import { formatDistance } from '@/lib/format'
import type { Local } from '@/lib/types'
import { cn } from '@/lib/utils'

export function LocalCard({
  local,
  distanceMeters,
  compact = false,
}: {
  local: Local
  distanceMeters?: number
  compact?: boolean
}) {
  const theme = primaryCategory(local.categories)
  const cover = coverOf({
    coverUrl: local.coverUrl,
    slug: local.slug,
    categories: local.categories,
  })

  return (
    <Link
      to={`/sitios/${local.slug}`}
      className={cn(
        'group overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
        compact ? 'flex gap-3 p-2' : 'flex flex-col',
      )}
    >
      <CoverImage
        src={cover}
        alt=""
        accent={theme.hex}
        className={compact ? 'h-24 w-28 shrink-0 rounded-2xl' : 'aspect-[4/3]'}
      />
      <div className={cn('flex flex-1 flex-col gap-1.5', compact ? 'py-1 pr-2' : 'p-4')}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl leading-tight">{local.name}</h3>
          <span
            className="mt-1 size-2.5 shrink-0 rounded-full"
            style={{ background: theme.hex }}
          />
        </div>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {local.zone ?? local.city}
          {distanceMeters != null && (
            <span className="font-medium text-pulse-foreground">
              · {formatDistance(distanceMeters)}
            </span>
          )}
        </p>
        {!compact && local.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{local.description}</p>
        )}
        <CategoryRow categories={local.categories} className="mt-1" />
      </div>
    </Link>
  )
}
