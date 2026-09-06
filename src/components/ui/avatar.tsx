import * as AvatarPrimitive from '@radix-ui/react-avatar'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/format'

function Avatar({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'relative flex size-10 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  name,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback> & { name?: string }) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex size-full items-center justify-center bg-secondary text-xs font-semibold text-secondary-foreground',
        className,
      )}
      {...props}
    >
      {props.children ?? (name ? initials(name) : '?')}
    </AvatarPrimitive.Fallback>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
