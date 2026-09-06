import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:brightness-105',
        night:
          'bg-night text-cream shadow-sm hover:bg-night/90',
        pulse:
          'bg-pulse text-pulse-foreground hover:brightness-105',
        social:
          'bg-social text-white hover:brightness-110',
        outline:
          'border border-border bg-card/70 backdrop-blur-sm hover:bg-secondary',
        ghost: 'hover:bg-secondary',
        link: 'text-primary underline-offset-4 hover:underline rounded-none',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const merged = cn(buttonVariants({ variant, size, className }))
  if (asChild) {
    return <Slot className={merged}>{props.children}</Slot>
  }
  return <button className={merged} {...props} />
}

export { Button, buttonVariants }
