import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { LocateFixed, List, Map as MapIcon } from 'lucide-react'
import { CityMap } from '@/components/map/city-map'
import { EventCard } from '@/components/feed/event-card'
import { LocalCard } from '@/components/feed/local-card'
import { CategoryChip } from '@/components/feed/bits'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGeo } from '@/hooks/use-geo'
import { useQuery } from '@/hooks/use-query'
import { Q_NEARBY } from '@/lib/queries'
import { formatDistance } from '@/lib/format'
import { primaryCategory } from '@/lib/theme'
import type { Category, NearbyResult } from '@/lib/types'

const RADII = [5, 8, 15]

export function NearbyPage() {
  const geo = useGeo()
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat')
  const [radiusKm, setRadiusKm] = useState(8)
  const [view, setView] = useState<'list' | 'map'>('list')

  const { data, loading, error } = useQuery<{
    nearby: NearbyResult
    categories: Category[]
  }>(Q_NEARBY, {
    latitude: geo.latitude,
    longitude: geo.longitude,
    radiusKm,
    categorySlug: cat || undefined,
  })

  const locals = data?.nearby.locals ?? []
  const events = data?.nearby.events ?? []

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Perto de ti
      </p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">
        Onde as pessoas estão
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        {geo.source === 'device'
          ? 'Com base na tua posição. Distâncias reais, sítios reais.'
          : 'Ainda não temos a tua posição — estamos a olhar para Talatona, o centro do catálogo de exemplo.'}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button variant="pulse" size="sm" onClick={geo.locate}>
          <LocateFixed />
          {geo.pending ? 'A localizar…' : 'Actualizar posição'}
        </Button>
        {RADII.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={radiusKm === r ? 'night' : 'outline'}
            onClick={() => setRadiusKm(r)}
          >
            {r} km
          </Button>
        ))}
        <div className="ml-auto flex rounded-full border border-border bg-card p-1">
          <button
            type="button"
            aria-label="Ver lista"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
            className={`rounded-full p-2 ${view === 'list' ? 'bg-night text-cream' : 'text-muted-foreground'}`}
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Ver mapa"
            aria-pressed={view === 'map'}
            onClick={() => setView('map')}
            className={`rounded-full p-2 ${view === 'map' ? 'bg-night text-cream' : 'text-muted-foreground'}`}
          >
            <MapIcon className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <CategoryChip
          slug="outro"
          name="Tudo"
          active={!cat}
          onClick={() => {
            params.delete('cat')
            setParams(params)
          }}
        />
        {(data?.categories ?? []).map((c) => (
          <CategoryChip
            key={c.id}
            slug={c.slug}
            name={c.name}
            active={cat === c.slug}
            onClick={() => setParams({ cat: c.slug })}
          />
        ))}
      </div>

      {view === 'map' && (
        <CityMap
          className="mt-6 h-[360px] w-full sm:h-[420px]"
          radiusKm={radiusKm}
          origin={{
            latitude: geo.latitude,
            longitude: geo.longitude,
            label: geo.source === 'device' ? 'Estás aqui' : 'Talatona (referência)',
          }}
          pins={locals.map((row) => ({
            id: row.local.id,
            name: row.local.name,
            latitude: row.local.latitude,
            longitude: row.local.longitude,
            href: `/sitios/${row.local.slug}`,
            color: primaryCategory(row.local.categories).hex,
            subtitle: formatDistance(row.distanceMeters),
          }))}
        />
      )}

      {error && (
        <p className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Tabs defaultValue="sitios" className="mt-8">
        <TabsList>
          <TabsTrigger value="sitios">Sítios ({locals.length})</TabsTrigger>
          <TabsTrigger value="acontece">A acontecer ({events.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="sitios">
          {loading ? (
            <p className="text-sm text-muted-foreground">A procurar à tua volta…</p>
          ) : locals.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Nada neste raio. Alarga os quilómetros ou tira o filtro.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {locals.map((row) => (
                <LocalCard
                  key={row.local.id}
                  local={row.local}
                  distanceMeters={row.distanceMeters}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="acontece">
          {events.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Sem eventos neste raio. A cidade pode estar quieta — ou o filtro está apertado.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((row) => (
                <EventCard
                  key={row.event.id}
                  event={row.event}
                  distanceMeters={row.distanceMeters}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
