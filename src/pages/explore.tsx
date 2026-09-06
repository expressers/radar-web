import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { EventCard } from '@/components/feed/event-card'
import { LocalCard } from '@/components/feed/local-card'
import { PersonCard } from '@/components/feed/person-card'
import { ArticleCard } from '@/components/feed/article-card'
import { CategoryChip } from '@/components/feed/bits'
import { CityMap } from '@/components/map/city-map'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@/hooks/use-query'
import { Q_CATEGORIES, Q_HOME, Q_SEARCH } from '@/lib/queries'
import { primaryCategory } from '@/lib/theme'
import type { Article, Category, Event, Local, Organization, User } from '@/lib/types'

type BrowseData = {
  categories: Category[]
  events: Event[]
  locals: Local[]
  users: User[]
}

type SearchData = {
  search: {
    locals: Local[]
    events: Event[]
    articles: Article[]
    organizations: Organization[]
    users: User[]
  }
}

export function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q')?.trim() ?? ''
  const [tab, setTab] = useState('tudo')
  const cats = useQuery<{ categories: Category[] }>(Q_CATEGORIES)
  const browse = useQuery<BrowseData>(Q_HOME, { upcoming: true }, { skip: Boolean(q) })
  const results = useQuery<SearchData>(Q_SEARCH, { query: q, limit: 40 }, { skip: !q })

  const found = results.data?.search
  const locals = found?.locals ?? []
  const events = found?.events ?? []
  const people = found?.users ?? []
  const articles = found?.articles ?? []
  const orgs = found?.organizations ?? []
  const total = locals.length + events.length + people.length + articles.length + orgs.length
  const categories = cats.data?.categories ?? browse.data?.categories ?? []
  const loading = q ? results.loading : browse.loading
  const error = q ? results.error : browse.error

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Explorar
      </p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">
        {q ? `Resultados para “${q}”` : 'O que procuras?'}
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        {q
          ? `${total} ${total === 1 ? 'resultado' : 'resultados'} em sítios, actividades e pessoas.`
          : 'Sítios para ir, o que está a acontecer, e quem anda por aí.'}
      </p>

      {error && (
        <p className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            slug={c.slug}
            name={c.name}
            active={normalizeEq(q, c.name) || normalizeEq(q, c.slug)}
            onClick={() => setParams({ q: c.name })}
          />
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">A procurar na cidade…</p>
      ) : q && total === 0 ? (
        <p className="mt-10 rounded-[1.5rem] border border-dashed border-border p-10 text-center text-muted-foreground">
          Não encontrámos sítios nem actividades para “{q}”. Tenta o nome de um bairro, karaoke,
          cinema, ou uma pessoa.
        </p>
      ) : q ? (
        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="tudo">Tudo ({total})</TabsTrigger>
            <TabsTrigger value="sitios">Sítios ({locals.length})</TabsTrigger>
            <TabsTrigger value="actividades">Actividades ({events.length})</TabsTrigger>
            <TabsTrigger value="pessoas">Pessoas ({people.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="tudo">
            <Results
              locals={locals}
              events={events}
              people={people}
              articles={articles}
              orgs={orgs}
              showMap
            />
          </TabsContent>
          <TabsContent value="sitios">
            <Results locals={locals} events={[]} people={[]} articles={[]} orgs={[]} showMap />
          </TabsContent>
          <TabsContent value="actividades">
            <Results locals={[]} events={events} people={[]} articles={[]} orgs={[]} />
          </TabsContent>
          <TabsContent value="pessoas">
            <Results locals={[]} events={[]} people={people} articles={[]} orgs={[]} />
          </TabsContent>
        </Tabs>
      ) : (
        <Browse catalog={browse.data} />
      )}
    </div>
  )
}

function normalizeEq(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

function Browse({ catalog }: { catalog: BrowseData | null }) {
  if (!catalog) return null
  return (
    <div className="mt-8 space-y-12">
      <section>
        <h2 className="mb-4 font-display text-2xl">Sítios</h2>
        <CityMap
          className="mb-4 h-[300px] w-full"
          pins={catalog.locals.map((local) => ({
            id: local.id,
            name: local.name,
            latitude: local.latitude,
            longitude: local.longitude,
            href: `/sitios/${local.slug}`,
            color: primaryCategory(local.categories).hex,
            subtitle: local.zone ?? local.city,
          }))}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.locals.map((local) => (
            <LocalCard key={local.id} local={local} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl">Actividades</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {catalog.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl">Pessoas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.users.map((user) => (
            <PersonCard key={user.id} user={user} />
          ))}
        </div>
      </section>
    </div>
  )
}

function Results({
  locals,
  events,
  people,
  articles,
  orgs,
  showMap,
}: {
  locals: Local[]
  events: Event[]
  people: User[]
  articles: Article[]
  orgs: Organization[]
  showMap?: boolean
}) {
  return (
    <div className="space-y-10">
      {showMap && locals.length > 0 && (
        <CityMap
          className="h-[300px] w-full"
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
      {locals.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-2xl">Sítios</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {locals.map((local) => (
              <LocalCard key={local.id} local={local} />
            ))}
          </div>
        </section>
      )}
      {events.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-2xl">Actividades</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
      {orgs.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-2xl">Casas</h2>
          <div className="grid gap-3">
            {orgs.map((org) => (
              <Link
                key={org.id}
                to={`/casas/${org.slug}`}
                className="rounded-2xl border border-border bg-card p-4 hover:shadow-sm"
              >
                <p className="font-semibold">{org.name}</p>
                {org.description && (
                  <p className="text-sm text-muted-foreground">{org.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
      {people.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-2xl">Pessoas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((user) => (
              <PersonCard key={user.id} user={user} />
            ))}
          </div>
        </section>
      )}
      {articles.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-2xl">Leituras</h2>
          <div className="grid gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
