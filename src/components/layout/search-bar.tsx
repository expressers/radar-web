import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import { useDebouncedValue, useQuery } from '@/hooks/use-query'
import { Q_SEARCH } from '@/lib/queries'
import type { Event, Local, User } from '@/lib/types'

type SearchPayload = {
  search: {
    locals: Local[]
    events: Event[]
    users: User[]
  }
}

export function SearchBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const urlQuery = location.pathname === '/explorar' ? (params.get('q') ?? '') : ''
  const [value, setValue] = useState(urlQuery)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLFormElement>(null)
  const q = value.trim()
  const debounced = useDebouncedValue(q, 250)
  const { data, loading } = useQuery<SearchPayload>(
    Q_SEARCH,
    { query: debounced, limit: 8 },
    { skip: debounced.length < 1 },
  )

  useEffect(() => {
    setValue(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [])

  const locals = data?.search.locals.slice(0, 4) ?? []
  const events = data?.search.events.slice(0, 4) ?? []
  const people = data?.search.users.slice(0, 3) ?? []
  const showMenu = open && q.length > 0
  const waiting = loading && debounced.length > 0
  const empty = !waiting && locals.length + events.length + people.length === 0

  function go(e?: FormEvent) {
    e?.preventDefault()
    const next = value.trim()
    setOpen(false)
    navigate(next ? `/explorar?q=${encodeURIComponent(next)}` : '/explorar')
  }

  return (
    <form ref={box} onSubmit={go} className="relative min-w-0 flex-1 max-w-xl">
      <label className="sr-only" htmlFor="global-search">
        Pesquisar sítios e actividades
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id="global-search"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="Pesquisar sítios, noites, pessoas…"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        className="h-10 w-full rounded-full border border-border bg-secondary/80 pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:bg-card focus:ring-2 focus:ring-ring/40"
      />

      {showMenu && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {waiting ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">A procurar…</p>
          ) : empty ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Nada para “{q}”. Tenta karaoke, ilha, cinema…
            </p>
          ) : (
            <ul className="max-h-[70vh] overflow-auto py-1">
              {locals.length > 0 && <Group label="Sítios" />}
              {locals.map((local) => (
                <Item
                  key={local.id}
                  to={`/sitios/${local.slug}`}
                  title={local.name}
                  hint={[local.zone, local.city].filter(Boolean).join(' · ')}
                  onPick={() => setOpen(false)}
                />
              ))}
              {events.length > 0 && <Group label="Actividades" />}
              {events.map((event) => (
                <Item
                  key={event.id}
                  to={`/acontece/${event.slug}`}
                  title={event.title}
                  hint={event.local.name}
                  onPick={() => setOpen(false)}
                />
              ))}
              {people.length > 0 && <Group label="Pessoas" />}
              {people.map((user) => (
                <Item
                  key={user.id}
                  to={`/u/${user.username}`}
                  title={user.name}
                  hint={`@${user.username}`}
                  onPick={() => setOpen(false)}
                />
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="block w-full border-t border-border px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-secondary"
          >
            Ver todos os resultados
          </button>
        </div>
      )}
    </form>
  )
}

function Group({ label }: { label: string }) {
  return (
    <li className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </li>
  )
}

function Item({
  to,
  title,
  hint,
  onPick,
}: {
  to: string
  title: string
  hint?: string
  onPick: () => void
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onPick}
        className="block px-4 py-2 hover:bg-secondary"
      >
        <p className="text-sm font-medium leading-tight">{title}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </Link>
    </li>
  )
}
