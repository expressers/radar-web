import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Badge({
  className,
  ...props
}: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
