import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CategoryChip } from '@/components/feed/bits'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@/hooks/use-query'
import { gql } from '@/lib/api'
import { M_RESPOND, M_SET_INTERESTS, Q_ME } from '@/lib/queries'
import type { Category, Event, Invitation, Local, User } from '@/lib/types'
import { Gate } from '@/pages/saved'
import { formatWhen } from '@/lib/format'

type MeData = {
  me: User
  myInvitations: Invitation[]
  categories: Category[]
  locals: Local[]
  events: Event[]
}

export function MePage() {
  const auth = useAuth()
  const { data, refetch } = useQuery<MeData>(Q_ME, {}, { skip: !auth.token })

  if (!auth.user) {
    return (
      <Gate
        title="A tua noite, os teus sítios"
        text="Entra para seguir gente, guardar o que te apetece e responder a convites."
      />
    )
  }

  const me = data?.me ?? auth.user
  const categories = data?.categories ?? []
  const invitations = data?.myInvitations ?? auth.invitations
  const incoming = invitations.filter(
    (i) => i.recipient.id === auth.user?.id && i.status === 'PENDING',
  )
  const rest = invitations.filter((i) => !incoming.includes(i))

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            {me.avatarUrl && <AvatarImage src={me.avatarUrl} />}
            <AvatarFallback name={me.name} className="text-xl" />
          </Avatar>
          <div>
            <h1 className="font-display text-4xl">{me.name}</h1>
            <p className="text-muted-foreground">@{me.username}</p>
          </div>
        </div>
        <Button variant="outline" onClick={auth.logout}>
          Sair
        </Button>
      </div>

      <Interests
        key={(me.interests ?? []).map((c) => c.slug).join(',')}
        all={categories}
        selected={(me.interests ?? []).map((c) => c.slug)}
        token={auth.token!}
        onSaved={async () => {
          await auth.refresh()
          await refetch()
        }}
      />

      <section>
        <h2 className="font-display text-2xl">Convites</h2>
        {incoming.length === 0 && rest.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            Ainda não há convites. Envia um a partir de um sítio ou de um evento.
          </p>
        )}
        <div className="mt-4 space-y-3">
          {incoming.map((inv) => (
            <InviteRow
              key={inv.id}
              inv={inv}
              selfId={auth.user!.id}
              locals={data?.locals ?? []}
              events={data?.events ?? []}
              token={auth.token!}
              onDone={async () => {
                await auth.refresh()
                await refetch()
              }}
            />
          ))}
          {rest.map((inv) => (
            <InviteRow
              key={inv.id}
              inv={inv}
              selfId={auth.user!.id}
              locals={data?.locals ?? []}
              events={data?.events ?? []}
              token={auth.token!}
              onDone={async () => {
                await auth.refresh()
                await refetch()
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function Interests({
  all,
  selected,
  token,
  onSaved,
}: {
  all: Category[]
  selected: string[]
  token: string
  onSaved: () => Promise<void>
}) {
  const [slugs, setSlugs] = useState(selected)
  const [busy, setBusy] = useState(false)

  return (
    <section>
      <h2 className="font-display text-2xl">O que te apetece</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Isto filtra o teu olhar sobre a cidade. Podes mudar quando quiseres.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {all.map((c) => {
          const on = slugs.includes(c.slug)
          return (
            <CategoryChip
              key={c.id}
              slug={c.slug}
              name={c.name}
              active={on}
              onClick={() =>
                setSlugs((prev) =>
                  on ? prev.filter((s) => s !== c.slug) : [...prev, c.slug],
                )
              }
            />
          )
        })}
      </div>
      <Button
        className="mt-4"
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          try {
            await gql(M_SET_INTERESTS, { categorySlugs: slugs }, token)
            toast.success('Interesses actualizados')
            await onSaved()
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Não foi possível.')
          } finally {
            setBusy(false)
          }
        }}
      >
        Guardar gostos
      </Button>
    </section>
  )
}

function InviteRow({
  inv,
  selfId,
  locals,
  events,
  token,
  onDone,
}: {
  inv: Invitation
  selfId: string
  locals: Local[]
  events: Event[]
  token: string
  onDone: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const mine = inv.recipient.id === selfId
  const target =
    inv.targetType === 'EVENT'
      ? events.find((e) => e.id === inv.targetId)
      : locals.find((l) => l.id === inv.targetId)
  const href =
    inv.targetType === 'EVENT'
      ? `/acontece/${(target as Event | undefined)?.slug ?? ''}`
      : `/sitios/${(target as Local | undefined)?.slug ?? ''}`
  const label =
    inv.targetType === 'EVENT'
      ? (target as Event | undefined)?.title
      : (target as Local | undefined)?.name

  async function respond(status: 'ACCEPTED' | 'DECLINED') {
    setBusy(true)
    try {
      await gql(M_RESPOND, { id: inv.id, status }, token)
      toast.success(status === 'ACCEPTED' ? 'Vamos!' : 'Recusado')
      await onDone()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-[1.4rem] border border-border bg-card p-4">
      <p className="text-sm">
        <span className="font-semibold">{inv.sender.name}</span>
        {mine ? ' convidou-te para ' : ' convidou '}
        {!mine && <span className="font-semibold">{inv.recipient.name}</span>}
        {!mine && ' para '}
        <Link to={href} className="text-primary">
          {label ?? 'um sítio'}
        </Link>
      </p>
      {inv.message && (
        <p className="mt-1 text-sm italic text-muted-foreground">“{inv.message}”</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">{formatWhen(inv.createdAt)}</p>
      {mine && inv.status === 'PENDING' && (
        <div className="mt-3 flex gap-2">
          <Button size="sm" disabled={busy} onClick={() => void respond('ACCEPTED')}>
            Vou
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => void respond('DECLINED')}
          >
            Agora não
          </Button>
        </div>
      )}
      {inv.status !== 'PENDING' && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {inv.status === 'ACCEPTED' ? 'Aceite' : 'Recusado'}
        </p>
      )}
    </div>
  )
}
