import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, LocateFixed } from 'lucide-react'
import { ActivityCard } from '@/components/feed/activity-card'
import { CategoryStory } from '@/components/feed/bits'
import { PersonCard } from '@/components/feed/person-card'
import { CityMap } from '@/components/map/city-map'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useFeedLive } from '@/hooks/use-feed-live'
import { useGeo } from '@/hooks/use-geo'
import { useQuery } from '@/hooks/use-query'
import { Q_FEED, Q_NEARBY } from '@/lib/queries'
import { formatDistance } from '@/lib/format'
import { primaryCategory } from '@/lib/theme'
import type { Category, FeedItem, NearbyResult, User } from '@/lib/types'

type FeedData = {
  feed: FeedItem[]
  categories: Category[]
  users: User[]
}

export function HomePage() {
  const geo = useGeo()
  const { user } = useAuth()
  const { data, loading, error } = useQuery<FeedData>(Q_FEED, { limit: 30 })
  const nearby = useQuery<{ nearby: NearbyResult }>(Q_NEARBY, {
    latitude: geo.latitude,
    longitude: geo.longitude,
    radiusKm: 12,
  })

  const [live, setLive] = useState<FeedItem[]>([])
  const [freshIds, setFreshIds] = useState<Set<string>>(() => new Set())

  const onLiveItem = useCallback((item: FeedItem) => {
    if (item.kind !== 'EVENT' && item.kind !== 'ARTICLE') return
    setLive((prev) => [item, ...prev.filter((row) => row.id !== item.id)])
    setFreshIds((prev) => {
      const next = new Set(prev)
      next.add(item.id)
      return next
    })
  }, [])

  const connected = useFeedLive(onLiveItem)

  const items = useMemo(() => {
    const seen = new Set<string>()
    const merged: FeedItem[] = []
    for (const item of [...live, ...(data?.feed ?? [])]) {
      if (item.kind !== 'EVENT' && item.kind !== 'ARTICLE') continue
      if (seen.has(item.id)) continue
      seen.add(item.id)
      merged.push(item)
    }
    return merged
  }, [live, data?.feed])

  const nearLocals = nearby.data?.nearby.locals ?? []
  const people = (data?.users ?? []).filter((row) => row.id !== user?.id).slice(0, 4)

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="mx-auto w-full max-w-xl">
        {error && (
          <p className="mb-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <section
          className="no-scrollbar -mx-4 mb-5 flex gap-3 overflow-x-auto px-4 pb-1"
          aria-label="Categorias"
        >
          {(data?.categories ?? []).map((category) => (
            <Link
              key={category.id}
              to={`/perto?cat=${category.slug}`}
              className="group shrink-0"
            >
              <CategoryStory slug={category.slug} name={category.name} />
            </Link>
          ))}
        </section>

        <h1 className="mb-4 flex items-center gap-2 font-display text-2xl tracking-tight">
          <span
            className={`size-2 rounded-full ${connected ? 'bg-pulse animate-pulse' : 'bg-muted-foreground/40'}`}
            aria-hidden
          />
          A acontecer agora
        </h1>

        {nearLocals.length > 0 && (
          <Link to="/perto" className="mb-5 block lg:hidden">
            <CityMap
              className="h-[180px] w-full"
              origin={{
                latitude: geo.latitude,
                longitude: geo.longitude,
                label: geo.source === 'device' ? 'Estás aqui' : 'Talatona',
              }}
              pins={nearLocals.slice(0, 6).map((row) => ({
                id: row.local.id,
                name: row.local.name,
                latitude: row.local.latitude,
                longitude: row.local.longitude,
                href: `/sitios/${row.local.slug}`,
                color: primaryCategory(row.local.categories).hex,
                subtitle:
                  row.distanceMeters != null
                    ? formatDistance(row.distanceMeters)
                    : row.local.zone ?? row.local.city,
              }))}
            />
          </Link>
        )}

        {live.length > 0 && (
          <p className="mb-3 text-sm font-medium text-primary">
            {live.length === 1 ? '1 actualização nova' : `${live.length} actualizações novas`}
          </p>
        )}

        {loading && items.length === 0 ? (
          <div className="flex flex-col gap-4">
            <div className="h-36 animate-pulse rounded-[1.6rem] bg-secondary" />
            <div className="h-64 animate-pulse rounded-[1.6rem] bg-secondary" />
            <div className="h-36 animate-pulse rounded-[1.6rem] bg-secondary" />
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-[1.5rem] border border-dashed border-border bg-card/60 px-5 py-10 text-center text-muted-foreground">
            Ainda não há movimento. Segue sítios e pessoas — o feed enche-se sozinho.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <ActivityCard key={item.id} item={item} fresh={freshIds.has(item.id)} />
            ))}
          </div>
        )}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Perto
                </p>
                <h2 className="font-display text-xl tracking-tight">
                  {geo.source === 'device' ? 'À tua volta' : 'A cidade agora'}
                </h2>
              </div>
              <Link to="/perto" className="text-sm font-medium text-primary">
                Mapa
              </Link>
            </div>
            {geo.source === 'fallback' && !geo.pending && (
              <p className="mb-3 text-xs text-muted-foreground">
                Referência em Talatona.{' '}
                <button type="button" className="text-primary underline" onClick={geo.locate}>
                  Usa a tua localização
                </button>
              </p>
            )}
            {nearLocals.length > 0 && (
              <CityMap
                className="mb-3 h-[220px] w-full"
                origin={{
                  latitude: geo.latitude,
                  longitude: geo.longitude,
                  label: geo.source === 'device' ? 'Estás aqui' : 'Talatona',
                }}
                pins={nearLocals.slice(0, 6).map((row) => ({
                  id: row.local.id,
                  name: row.local.name,
                  latitude: row.local.latitude,
                  longitude: row.local.longitude,
                  href: `/sitios/${row.local.slug}`,
                  color: primaryCategory(row.local.categories).hex,
                  subtitle:
                    row.distanceMeters != null
                      ? formatDistance(row.distanceMeters)
                      : row.local.zone ?? row.local.city,
                }))}
              />
            )}
            <Button asChild className="w-full" variant="outline">
              <Link to="/perto">
                <LocateFixed />
                O que está perto
              </Link>
            </Button>
          </section>

          {people.length > 0 && (
            <section>
              <div className="mb-3 flex items-end justify-between">
                <h2 className="font-display text-xl tracking-tight">Quem anda por aí</h2>
                <Link to="/pessoas" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ver
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {people.map((person) => (
                  <PersonCard key={person.id} user={person} />
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}
