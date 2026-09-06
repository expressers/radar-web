import { useCallback, useEffect, useState } from 'react'
import { gql } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'

export function useQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  opts?: { skip?: boolean },
) {
  const { token } = useAuth()
  const varsKey = JSON.stringify(variables ?? {})
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!opts?.skip)

  const refetch = useCallback(async () => {
    if (opts?.skip) return
    setLoading(true)
    setError(null)
    try {
      const parsed = JSON.parse(varsKey) as Record<string, unknown>
      const next = await gql<T>(query, parsed, token)
      setData(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo correu mal.')
    } finally {
      setLoading(false)
    }
  }, [opts?.skip, query, token, varsKey])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { data, error, loading, refetch }
}

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
