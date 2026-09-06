import { Compass, Heart, Search, Sparkles, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { Mark } from '@/components/brand/mark'
import { SearchBar } from '@/components/layout/search-bar'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const NAV = [
  { to: '/', label: 'Hoje', icon: Sparkles, end: true },
  { to: '/explorar', label: 'Explorar', icon: Search },
  { to: '/perto', label: 'Perto', icon: Compass },
  { to: '/guardados', label: 'Guardados', icon: Heart },
  { to: '/eu', label: 'Eu', icon: UserRound },
]

export function Shell() {
  const { user, invitations } = useAuth()
  const pending = invitations.filter(
    (i) => i.status === 'PENDING' && i.recipient.id === user?.id,
  ).length

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <NavLink to="/" className="hidden shrink-0 sm:flex">
            <Mark />
          </NavLink>
          <NavLink to="/" className="shrink-0 sm:hidden" aria-label="Início">
            <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
              <circle cx="10" cy="17" r="7" fill="#FF5C4D" />
              <circle cx="18" cy="17" r="7" fill="#E11D74" fillOpacity="0.88" />
              <circle cx="14" cy="11" r="7" fill="#14B8A6" fillOpacity="0.82" />
            </svg>
          </NavLink>

          <SearchBar />

          <nav className="hidden shrink-0 items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'bg-secondary text-foreground',
                  )
                }
              >
                {item.label}
                {item.to === '/eu' && pending > 0 && (
                  <span className="ml-2 inline-flex size-5 items-center justify-center rounded-full bg-social text-[10px] text-white">
                    {pending}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center">
            {user ? (
              <NavLink to="/eu" className="flex items-center gap-2">
                <Avatar className="size-9 ring-2 ring-primary/20">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                  <AvatarFallback name={user.name} />
                </Avatar>
              </NavLink>
            ) : (
              <NavLink
                to="/entrar"
                className="rounded-full bg-night px-4 py-2 text-sm font-medium text-cream"
              >
                Entrar
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:pb-16">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground',
                  isActive && 'text-primary',
                )
              }
            >
              <span className="relative">
                <item.icon className="size-5" />
                {item.to === '/eu' && pending > 0 && (
                  <span className="absolute -right-1.5 -top-1 size-2 rounded-full bg-social" />
                )}
              </span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <Toaster position="top-center" />
    </div>
  )
}
