import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { gql } from '@/lib/api'
import { formatAgo } from '@/lib/format'
import { M_COMMENT_FEED, M_LIKE_FEED, Q_FEED_COMMENTS } from '@/lib/queries'
import type { FeedComment, FeedItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FeedActions({ item }: { item: FeedItem }) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(item.liked)
  const [likeCount, setLikeCount] = useState(item.likeCount)
  const [commentCount, setCommentCount] = useState(item.commentCount)
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLiked(item.liked)
    setLikeCount(item.likeCount)
    setCommentCount(item.commentCount)
  }, [item.id, item.liked, item.likeCount, item.commentCount])

  async function toggleLike() {
    if (!auth.token) {
      navigate('/entrar')
      return
    }
    setBusy(true)
    const previous = { liked, likeCount }
    setLiked(!liked)
    setLikeCount((count) => count + (liked ? -1 : 1))
    try {
      const data = await gql<{ likeFeedItem: { liked: boolean; likeCount: number } }>(
        M_LIKE_FEED,
        { feedItemId: item.id },
        auth.token,
      )
      setLiked(data.likeFeedItem.liked)
      setLikeCount(data.likeFeedItem.likeCount)
    } catch (err) {
      setLiked(previous.liked)
      setLikeCount(previous.likeCount)
      toast.error(err instanceof Error ? err.message : 'Não foi possível gostar.')
    } finally {
      setBusy(false)
    }
  }

  async function share() {
    const url = `${window.location.origin}${permalink(item)}`
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle(item), url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success('Ligação copiada')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      toast.error('Não foi possível partilhar.')
    }
  }

  return (
    <>
      <div className="mt-3 flex items-center gap-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => void toggleLike()}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-secondary',
            liked ? 'text-social' : 'text-muted-foreground',
          )}
          aria-label={liked ? 'Já não gosto' : 'Gostar'}
          aria-pressed={liked}
        >
          <Heart className={cn('size-5', liked && 'fill-current')} />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Comentários"
        >
          <MessageCircle className="size-5" />
          {commentCount > 0 && <span>{commentCount}</span>}
        </button>
        <button
          type="button"
          onClick={() => void share()}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Partilhar"
        >
          <Share2 className="size-5" />
        </button>
      </div>
      <CommentsDialog
        item={item}
        open={open}
        onOpenChange={setOpen}
        onCommented={() => setCommentCount((count) => count + 1)}
      />
    </>
  )
}

function CommentsDialog({
  item,
  open,
  onOpenChange,
  onCommented,
}: {
  item: FeedItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onCommented: () => void
}) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [comments, setComments] = useState<FeedComment[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    gql<{ feedComments: FeedComment[] }>(Q_FEED_COMMENTS, { feedItemId: item.id }, auth.token)
      .then((data) => setComments(data.feedComments))
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Não foi possível.'))
      .finally(() => setLoading(false))
  }, [auth.token, item.id, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(80vh,560px)] flex-col">
        <DialogHeader>
          <DialogTitle>Comentários</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground">A carregar…</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ainda ninguém comentou. Diz alguma coisa.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <Avatar className="size-8">
                  {comment.author.avatarUrl && (
                    <AvatarImage src={comment.author.avatarUrl} />
                  )}
                  <AvatarFallback name={comment.author.name} />
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{comment.author.name}</span>{' '}
                    <span className="text-muted-foreground">{comment.body}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatAgo(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault()
            if (!auth.token) {
              navigate('/entrar')
              return
            }
            const text = body.trim()
            if (!text) return
            setBusy(true)
            try {
              const data = await gql<{ commentOnFeedItem: FeedComment }>(
                M_COMMENT_FEED,
                { feedItemId: item.id, body: text },
                auth.token,
              )
              setComments((prev) => [...prev, data.commentOnFeedItem])
              setBody('')
              onCommented()
            } catch (err) {
              toast.error(err instanceof Error ? err.message : 'Não foi possível comentar.')
            } finally {
              setBusy(false)
            }
          }}
        >
          <Input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={auth.user ? 'Escreve um comentário…' : 'Entra para comentar'}
            maxLength={280}
            disabled={busy}
          />
          <Button type="submit" size="sm" disabled={busy || !body.trim()}>
            Enviar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function permalink(item: FeedItem) {
  if (item.event) return `/acontece/${item.event.slug}`
  if (item.article) return `/leituras/${item.article.slug}`
  if (item.local) return `/sitios/${item.local.slug}`
  if (item.organization) return `/casas/${item.organization.slug}`
  if (item.targetUser) return `/u/${item.targetUser.username}`
  if (item.actor) return `/u/${item.actor.username}`
  return '/'
}

function shareTitle(item: FeedItem) {
  return (
    item.event?.title ??
    item.article?.title ??
    item.local?.name ??
    item.organization?.name ??
    item.targetUser?.name ??
    'A acontecer agora'
  )
}
