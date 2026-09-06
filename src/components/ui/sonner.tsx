import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-card text-foreground border-border shadow-lg rounded-2xl',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
