import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80'

export function NightHero({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-night', className)}>
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1014] via-[#1A1014]/55 to-[#1A1014]/25" />
      {children}
    </div>
  )
}
