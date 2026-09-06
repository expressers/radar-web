import { Compass, Home } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-secondary text-primary">
        <Compass className="size-8" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">404</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">Este plano perdeu-se.</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        A página que procuras já não está aqui. Há sempre outra coisa para descobrir.
      </p>
      <Button asChild className="mt-7">
        <Link to="/">
          <Home />
          Voltar ao Radar
        </Link>
      </Button>
    </div>
  )
}
