import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Bookmark, BookmarkCheck, Heart, Send, UserPlus, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { gql } from '@/lib/api'
import {
  M_BOOKMARK,
  M_FOLLOW,
  M_INVITE,
  M_UNBOOKMARK,
  M_UNFOLLOW,
  Q_USERS,
} from '@/lib/queries'
import type { Bookmark as BookmarkT, Follow, User } from '@/lib/types'

export function FollowButton({
  targetId,
  targetType,
}: {
  targetId: string
  targetType: Follow['targetType']
}) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const on = auth.isFollowing(targetType, targetId)
  const self = auth.user?.id === targetId && targetType === 'USER'

  if (self) return null

  return (
    <Button
      variant={on ? 'outline' : 'night'}
      size="sm"
      disabled={busy}
      onClick={async () => {
        if (!auth.token) {
          navigate('/entrar')
          return
        }
        setBusy(true)
        try {
          await gql(
            on ? M_UNFOLLOW : M_FOLLOW,
            { targetId, targetType },
            auth.token,
          )
          await auth.refresh()
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Não foi possível.')
        } finally {
          setBusy(false)
        }
      }}
    >
      {on ? <UserMinus /> : <UserPlus />}
      {on ? 'A seguir' : 'Seguir'}
    </Button>
  )
}

export function BookmarkButton({
  targetId,
  targetType,
}: {
  targetId: string
  targetType: BookmarkT['targetType']
}) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const on = auth.isBookmarked(targetType, targetId)

  return (
    <Button
      variant={on ? 'default' : 'outline'}
      size="sm"
      disabled={busy}
      onClick={async () => {
        if (!auth.token) {
          navigate('/entrar')
          return
        }
        setBusy(true)
        try {
          await gql(
            on ? M_UNBOOKMARK : M_BOOKMARK,
            { targetId, targetType },
            auth.token,
          )
          await auth.refresh()
          toast.success(on ? 'Removido dos guardados' : 'Guardado para mais tarde')
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'Não foi possível.')
        } finally {
          setBusy(false)
        }
      }}
    >
      {on ? <BookmarkCheck /> : <Bookmark />}
      {on ? 'Guardado' : 'Guardar'}
    </Button>
  )
}

export function InviteButton({
  targetId,
  targetType,
  label,
}: {
  targetId: string
  targetType: 'EVENT' | 'LOCAL'
  label: string
}) {
  const auth = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function openDialog() {
    if (!auth.token) {
      navigate('/entrar')
      return
    }
    setOpen(true)
    const data = await gql<{ users: User[] }>(Q_USERS, {}, auth.token)
    setUsers(data.users.filter((u) => u.id !== auth.user?.id))
  }

  return (
    <>
      <Button variant="social" size="sm" onClick={() => void openDialog()}>
        <Send />
        Convidar
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vamos juntos?</DialogTitle>
            <DialogDescription>
              Convida alguém para {label}. Só chega ao destinatário.
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-48 flex-col gap-1 overflow-auto">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setPicked(u.id)}
                className={`rounded-2xl px-3 py-2 text-left text-sm ${
                  picked === u.id ? 'bg-secondary' : 'hover:bg-muted'
                }`}
              >
                <span className="font-medium">{u.name}</span>
                <span className="ml-2 text-muted-foreground">@{u.username}</span>
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Uma mensagem curta — opcional"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            disabled={!picked || busy}
            onClick={async () => {
              if (!picked || !auth.token) return
              setBusy(true)
              try {
                await gql(
                  M_INVITE,
                  {
                    recipientId: picked,
                    targetId,
                    targetType,
                    message: message || undefined,
                  },
                  auth.token,
                )
                await auth.refresh()
                toast.success('Convite enviado')
                setOpen(false)
                setMessage('')
                setPicked(null)
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Não foi possível.')
              } finally {
                setBusy(false)
              }
            }}
          >
            <Heart />
            Enviar convite
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
