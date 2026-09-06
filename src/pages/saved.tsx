import { Link } from 'react-router'
import { EventCard } from '@/components/feed/event-card'
import { LocalCard } from '@/components/feed/local-card'
import { ArticleCard } from '@/components/feed/article-card'
import { useAuth } from '@/hooks/use-auth'
import { useQuery } from '@/hooks/use-query'
import { Q_ME } from '@/lib/queries'
import type { Article, Bookmark, Event, Local } from '@/lib/types'

type MeData = {
  myBookmarks: Bookmark[]
  locals: Local[]
  events: Event[]
  articles: Article[]
}

export function SavedPage() {
  const { token, user } = useAuth()
  const { data, loading } = useQuery<MeData>(Q_ME, {}, { skip: !token })

  if (!user) {
    return (
      <Gate
        title="Os teus guardados"
        text="Entra para guardar sítios, noites e textos — e voltar a eles quando quiseres sair."
      />
    )
  }

  const localsById = new Map((data?.locals ?? []).map((l) => [l.id, l]))
  const eventsById = new Map((data?.events ?? []).map((e) => [e.id, e]))
  const articlesById = new Map((data?.articles ?? []).map((a) => [a.id, a]))
  const marks = data?.myBookmarks ?? []

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Para mais tarde
      </p>
      <h1 className="mt-1 font-display text-4xl">Guardados</h1>
      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">A carregar…</p>
      ) : marks.length === 0 ? (
        <p className="mt-8 rounded-[1.5rem] border border-dashed border-border p-8 text-muted-foreground">
          Ainda não guardaste nada. Um sítio, um evento, um texto — o que quiseres não esquecer.
        </p>
      ) : (
        <div className="mt-8 grid gap-4">
          {marks.map((b) => {
            if (b.targetType === 'LOCAL') {
              const local = localsById.get(b.targetId)
              return local ? <LocalCard key={b.id} local={local} /> : null
            }
            if (b.targetType === 'EVENT') {
              const event = eventsById.get(b.targetId)
              return event ? <EventCard key={b.id} event={event} /> : null
            }
            const article = articlesById.get(b.targetId)
            return article ? <ArticleCard key={b.id} article={article} /> : null
          })}
        </div>
      )}
    </div>
  )
}

export function Gate({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{text}</p>
      <Link
        to="/entrar"
        className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
      >
        Entrar
      </Link>
    </div>
  )
}
