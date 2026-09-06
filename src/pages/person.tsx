import { useParams } from 'react-router'
import { PersonCard } from '@/components/feed/person-card'
import { LocalCard } from '@/components/feed/local-card'
import { FollowButton } from '@/components/social/actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CategoryChip } from '@/components/feed/bits'
import { useQuery } from '@/hooks/use-query'
import { Q_USER, Q_FOLLOWS, Q_HOME } from '@/lib/queries'
import type { Category, Follow, Local, User } from '@/lib/types'

type Catalog = {
  locals: Local[]
  users: User[]
}

export function PersonPage() {
  const { username = '' } = useParams()
  const person = useQuery<{ user: User | null }>(Q_USER, { username })
  const catalog = useQuery<Catalog>(Q_HOME, {
    upcoming: true,
  })
  const user = person.data?.user
  const follows = useQuery<{ follows: Follow[] }>(Q_FOLLOWS, { userId: user?.id }, {
    skip: !user?.id,
  })

  if (person.loading) return <div className="h-40 animate-pulse rounded-[1.5rem] bg-secondary" />
  if (!user) return <p className="text-muted-foreground">{person.error ?? 'Pessoa não encontrada.'}</p>

  const followRows = follows.data?.follows ?? []
  const localsById = new Map((catalog.data?.locals ?? []).map((l) => [l.id, l]))
  const usersById = new Map((catalog.data?.users ?? []).map((u) => [u.id, u]))

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-[2rem] bg-card p-6 shadow-sm sm:flex-row sm:items-end">
        <Avatar className="size-24">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          <AvatarFallback name={user.name} className="text-2xl" />
        </Avatar>
        <div className="flex-1">
          <h1 className="font-display text-4xl">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.bio && <p className="mt-2 max-w-lg">{user.bio}</p>}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(user.interests ?? []).map((c: Category) => (
              <CategoryChip key={c.id} slug={c.slug} name={c.name} />
            ))}
          </div>
        </div>
        <FollowButton targetId={user.id} targetType="USER" />
      </div>

      <h2 className="mt-10 font-display text-2xl">A seguir</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {followRows.length === 0 && (
          <p className="text-sm text-muted-foreground">Ainda não segue ninguém.</p>
        )}
        {followRows.map((f) => {
          if (f.targetType === 'LOCAL') {
            const local = localsById.get(f.targetId)
            return local ? <LocalCard key={f.id} local={local} compact /> : null
          }
          if (f.targetType === 'USER') {
            const u = usersById.get(f.targetId)
            return u ? <PersonCard key={f.id} user={u} /> : null
          }
          return (
            <p key={f.id} className="rounded-2xl border border-border p-4 text-sm">
              Segue uma casa da cidade.
            </p>
          )
        })}
      </div>
    </div>
  )
}
