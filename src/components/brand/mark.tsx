import { cn } from '@/lib/utils'

export function Mark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
        <circle cx="10" cy="17" r="7" fill="#FF5C4D" />
        <circle cx="18" cy="17" r="7" fill="#E11D74" fillOpacity="0.88" />
        <circle cx="14" cy="11" r="7" fill="#14B8A6" fillOpacity="0.82" />
      </svg>
      <span className="font-mark text-[1.35rem] font-extrabold tracking-tight text-ink">
        radar
      </span>
    </span>
  )
}
