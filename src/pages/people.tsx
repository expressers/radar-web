import { PersonCard } from '@/components/feed/person-card'
import { useQuery } from '@/hooks/use-query'
import { Q_USERS } from '@/lib/queries'
import type { User } from '@/lib/types'

export function PeoplePage() {
  const { data, loading, error } = useQuery<{ users: User[] }>(Q_USERS)

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Gente
      </p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">
        Quem anda por aí
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Segue pessoas, casas e sítios. O convite para sair começa aqui — sem stories, com gente real.
      </p>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-[1.5rem] bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.users ?? []).map((user) => (
            <PersonCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}
