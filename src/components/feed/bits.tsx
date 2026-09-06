import { Badge } from '@/components/ui/badge'
import { themeFor } from '@/lib/theme'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

export function CategoryChip({
  slug,
  name,
  active,
  onClick,
}: {
  slug: string
  name: string
  active?: boolean
  onClick?: () => void
}) {
  const theme = themeFor(slug)
  const Comp = onClick ? 'button' : 'span'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
        onClick && 'hover:scale-[1.03]',
      )}
      style={{
        background: active ? theme.hex : theme.soft,
        color: active ? '#fff' : theme.text,
      }}
    >
      <span aria-hidden>{theme.emoji}</span>
      {name}
    </Comp>
  )
}

export function CategoryStory({ slug, name }: { slug: string; name: string }) {
  const theme = themeFor(slug)
  return (
    <span className="flex w-[4.6rem] shrink-0 flex-col items-center gap-1.5">
      <span
        className="flex size-[4.15rem] items-center justify-center rounded-full p-[2.5px] transition-transform group-hover:scale-[1.04]"
        style={{
          background: `conic-gradient(from 210deg, ${theme.hex}, ${theme.hex}55, ${theme.hex})`,
        }}
      >
        <span className="flex size-full items-center justify-center rounded-full bg-background p-[2.5px]">
          <span
            className="flex size-full items-center justify-center rounded-full text-[1.45rem]"
            style={{ background: theme.soft, color: theme.text }}
          >
            <span aria-hidden>{theme.emoji}</span>
          </span>
        </span>
      </span>
      <span className="w-full truncate text-center text-[11px] font-medium leading-tight">
        {name}
      </span>
    </span>
  )
}

export function CategoryRow({
  categories,
  className,
}: {
  categories: Category[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {categories.map((c) => (
        <Badge
          key={c.id}
          style={{ background: themeFor(c.slug).soft, color: themeFor(c.slug).text }}
        >
          {c.name}
        </Badge>
      ))}
    </div>
  )
}

export function CoverImage({
  src,
  alt,
  className,
  accent,
}: {
  src: string
  alt: string
  className?: string
  accent?: string
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = '/favicon.svg'
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{
          background: `linear-gradient(180deg, transparent 35%, #1A1014 100%), linear-gradient(90deg, ${accent ?? '#FF5C4D'}22, transparent 50%)`,
        }}
      />
    </div>
  )
}
