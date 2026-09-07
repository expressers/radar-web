import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function NightHero({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-night', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,#db277766,transparent_32%),radial-gradient(circle_at_15%_20%,#14b8a655,transparent_30%),linear-gradient(145deg,#1a1014,#43202b)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1014] via-[#1A1014]/55 to-[#1A1014]/25" />
      {children}
    </div>
  )
}
