import { Link } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CategoryChip } from '@/components/feed/bits'
import type { User } from '@/lib/types'

export function PersonCard({ user }: { user: User }) {
  return (
    <Link
      to={`/u/${user.username}`}
      className="flex flex-col items-start gap-3 rounded-[1.5rem] border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <Avatar className="size-14">
        {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
        <AvatarFallback name={user.name} className="text-base" />
      </Avatar>
      <div>
        <p className="font-semibold leading-tight">{user.name}</p>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
      {user.bio && <p className="line-clamp-2 text-sm text-muted-foreground">{user.bio}</p>}
      <div className="flex flex-wrap gap-1.5">
        {user.interests?.slice(0, 3).map((c) => (
          <CategoryChip key={c.id} slug={c.slug} name={c.name} />
        ))}
      </div>
    </Link>
  )
}
