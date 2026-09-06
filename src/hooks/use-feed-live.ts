import { useEffect, useRef, useState } from 'react'
import { createClient, type Client } from 'graphql-ws'
import { wsUrl } from '@/lib/api'
import { S_FEED_ITEM } from '@/lib/queries'
import type { FeedItem } from '@/lib/types'

export function useFeedLive(onItem: (item: FeedItem) => void) {
  const [connected, setConnected] = useState(false)
  const onItemRef = useRef(onItem)
  onItemRef.current = onItem

  useEffect(() => {
    let client: Client
    try {
      client = createClient({
        url: wsUrl(),
        retryAttempts: 5,
        retryWait: async (retries) => {
          await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * 2 ** retries, 15_000)))
        },
        shouldRetry: () => navigator.onLine,
        on: {
          connected: () => setConnected(true),
          closed: () => setConnected(false),
          error: () => setConnected(false),
        },
      })
    } catch {
      setConnected(false)
      return
    }

    const unsubscribe = client.subscribe<{ feedItem: FeedItem }>(
      { query: S_FEED_ITEM },
      {
        next: (result) => {
          const item = result.data?.feedItem
          if (item) onItemRef.current(item)
        },
        error: () => setConnected(false),
        complete: () => setConnected(false),
      },
    )

    return () => {
      unsubscribe()
      void client.dispose()
      setConnected(false)
    }
  }, [])

  return connected
}
