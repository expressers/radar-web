import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { gql } from '@/lib/api'
import { M_LOGIN, M_REGISTER, Q_ME } from '@/lib/queries'
import type { AuthPayload, Bookmark, Follow, Invitation, User } from '@/lib/types'

const STORAGE_KEY = 'radar.session'

type Session = {
  token: string
  user: User
}

type MeBundle = {
  myFollows: Follow[]
  myBookmarks: Bookmark[]
  myInvitations: Invitation[]
}

type AuthContextValue = {
  user: User | null
  token: string | null
  ready: boolean
  follows: Follow[]
  bookmarks: Bookmark[]
  invitations: Invitation[]
  login: (identifier: string, password: string) => Promise<User>
  register: (input: {
    email: string
    name: string
    username: string
    password: string
  }) => Promise<User>
  logout: () => void
  refresh: () => Promise<void>
  isFollowing: (targetType: Follow['targetType'], targetId: string) => boolean
  isBookmarked: (targetType: Bookmark['targetType'], targetId: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const [bundle, setBundle] = useState<MeBundle>({
    myFollows: [],
    myBookmarks: [],
    myInvitations: [],
  })

  const persist = useCallback((next: Session | null) => {
    setSession(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const refresh = useCallback(async () => {
    const token = session?.token ?? readSession()?.token
    if (!token) {
      setBundle({ myFollows: [], myBookmarks: [], myInvitations: [] })
      return
    }
    try {
      const data = await gql<{
        me: User
        myFollows: Follow[]
        myBookmarks: Bookmark[]
        myInvitations: Invitation[]
      }>(Q_ME, {}, token)
      persist({ token, user: data.me })
      setBundle({
        myFollows: data.myFollows,
        myBookmarks: data.myBookmarks,
        myInvitations: data.myInvitations,
      })
    } catch {
      persist(null)
      setBundle({ myFollows: [], myBookmarks: [], myInvitations: [] })
    }
  }, [persist, session?.token])

  useEffect(() => {
    const stored = readSession()
    if (!stored) {
      setReady(true)
      return
    }
    setSession(stored)
    gql<{
      me: User
      myFollows: Follow[]
      myBookmarks: Bookmark[]
      myInvitations: Invitation[]
    }>(Q_ME, {}, stored.token)
      .then((data) => {
        persist({ token: stored.token, user: data.me })
        setBundle({
          myFollows: data.myFollows,
          myBookmarks: data.myBookmarks,
          myInvitations: data.myInvitations,
        })
      })
      .catch(() => persist(null))
      .finally(() => setReady(true))
  }, [persist])

  const login = useCallback(
    async (identifier: string, password: string) => {
      const data = await gql<{ login: AuthPayload }>(M_LOGIN, {
        identifier,
        password,
      })
      persist({ token: data.login.accessToken, user: data.login.user })
      await refresh()
      return data.login.user
    },
    [persist, refresh],
  )

  const register = useCallback(
    async (input: {
      email: string
      name: string
      username: string
      password: string
    }) => {
      const data = await gql<{ register: AuthPayload }>(M_REGISTER, input)
      persist({ token: data.register.accessToken, user: data.register.user })
      await refresh()
      return data.register.user
    },
    [persist, refresh],
  )

  const logout = useCallback(() => {
    persist(null)
    setBundle({ myFollows: [], myBookmarks: [], myInvitations: [] })
  }, [persist])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      ready,
      follows: bundle.myFollows,
      bookmarks: bundle.myBookmarks,
      invitations: bundle.myInvitations,
      login,
      register,
      logout,
      refresh,
      isFollowing: (targetType, targetId) =>
        bundle.myFollows.some(
          (f) => f.targetType === targetType && f.targetId === targetId,
        ),
      isBookmarked: (targetType, targetId) =>
        bundle.myBookmarks.some(
          (b) => b.targetType === targetType && b.targetId === targetId,
        ),
    }),
    [bundle, login, logout, ready, refresh, register, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
