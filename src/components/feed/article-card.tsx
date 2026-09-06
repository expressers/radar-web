import { Link } from 'react-router'
import { CoverImage, CategoryRow } from '@/components/feed/bits'
import { coverOf, primaryCategory } from '@/lib/theme'
import type { Article } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ArticleCard({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  const theme = primaryCategory(article.categories)
  const cover = coverOf({
    coverUrl: article.coverUrl,
    slug: article.slug,
    categories: article.categories,
  })

  return (
    <Link
      to={`/leituras/${article.slug}`}
      className={cn(
        'group grid overflow-hidden rounded-[1.6rem] border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[1.1fr_1fr]',
        className,
      )}
    >
      <CoverImage src={cover} alt="" accent={theme.hex} className="aspect-[16/10] md:aspect-auto md:min-h-52" />
      <div className="flex flex-col justify-center gap-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          A cidade está a falar
        </p>
        <h3 className="font-display text-2xl leading-tight">{article.title}</h3>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        <p className="text-sm text-muted-foreground">por {article.author.name}</p>
        <CategoryRow categories={article.categories} />
      </div>
    </Link>
  )
}
