import { useParams } from 'react-router'
import { EventCard } from '@/components/feed/event-card'
import { LocalCard } from '@/components/feed/local-card'
import { CityMap } from '@/components/map/city-map'
import { FollowButton } from '@/components/social/actions'
import { useQuery } from '@/hooks/use-query'
import { Q_ORGANIZATION } from '@/lib/queries'
import { primaryCategory } from '@/lib/theme'
import type { Event, Local, Organization } from '@/lib/types'

export function OrganizationPage() {
  const { slug = '' } = useParams()
  const { data, loading, error } = useQuery<{
    organization: Organization | null
    locals: Local[]
    events: Event[]
  }>(Q_ORGANIZATION, { slug })

  const org = data?.organization
  if (loading) return <div className="h-40 animate-pulse rounded-[1.5rem] bg-secondary" />
  if (!org) return <p className="text-muted-foreground">{error ?? 'Casa não encontrada.'}</p>

  const locals = (data?.locals ?? []).filter((l) => l.organization.slug === org.slug)
  const events = (data?.events ?? []).filter((e) => e.organization.slug === org.slug)

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-[2rem] bg-card p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Casa
          </p>
          <h1 className="font-display text-4xl">{org.name}</h1>
          {org.description && (
            <p className="mt-2 max-w-xl text-muted-foreground">{org.description}</p>
          )}
        </div>
        <FollowButton targetId={org.id} targetType="ORGANIZATION" />
      </div>

      <h2 className="mt-10 font-display text-2xl">Sítios</h2>
      {locals.length > 0 && (
        <CityMap
          className="mt-4 h-[300px] w-full"
          pins={locals.map((local) => ({
            id: local.id,
            name: local.name,
            latitude: local.latitude,
            longitude: local.longitude,
            href: `/sitios/${local.slug}`,
            color: primaryCategory(local.categories).hex,
            subtitle: local.zone ?? local.city,
          }))}
        />
      )}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {locals.map((local) => (
          <LocalCard key={local.id} local={local} />
        ))}
      </div>

      {events.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-2xl">A acontecer</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
