import { ArticleCard } from '@/components/feed/article-card'
import { EventCard } from '@/components/feed/event-card'
import { FeedActions } from '@/components/feed/feed-actions'
import type { FeedItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ActivityCard({
  item,
  fresh = false,
}: {
  item: FeedItem
  fresh?: boolean
}) {
  if (item.kind === 'EVENT' && item.event) {
    return (
      <article
        className={cn(
          'overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm',
          fresh && 'feed-item-new',
        )}
      >
        <EventCard
          event={item.event}
          className="min-h-[240px] rounded-none hover:translate-y-0"
        />
        <div className="px-3 pb-2">
          <FeedActions item={item} />
        </div>
      </article>
    )
  }

  if (item.kind === 'ARTICLE' && item.article) {
    return (
      <article
        className={cn(
          'overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm',
          fresh && 'feed-item-new',
        )}
      >
        <ArticleCard
          article={item.article}
          className="rounded-none border-0 shadow-none hover:translate-y-0 hover:shadow-none"
        />
        <div className="px-3 pb-2">
          <FeedActions item={item} />
        </div>
      </article>
    )
  }

  return null
}
