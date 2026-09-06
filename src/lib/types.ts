export type Category = {
  id: string
  name: string
  slug: string
}

export type Organization = {
  id: string
  name: string
  slug: string
  description: string | null
  avatarUrl: string | null
}

export type User = {
  id: string
  email?: string
  username: string
  name: string
  bio: string | null
  avatarUrl: string | null
  interests?: Category[]
}

export type TaxiLink = {
  label: string
  provider: string
  url: string
}

export type Local = {
  id: string
  name: string
  slug: string
  description: string | null
  address: string | null
  zone: string | null
  city: string
  latitude: number
  longitude: number
  phone: string | null
  website: string | null
  coverUrl: string | null
  categories: Category[]
  organization: Organization
  events?: Event[]
  taxiLinks?: TaxiLink[]
}

export type Event = {
  id: string
  title: string
  slug: string
  description: string | null
  startsAt: string
  endsAt: string | null
  priceMin: number | null
  priceMax: number | null
  coverUrl: string | null
  categories: Category[]
  local: Local
  organization: Organization
}

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  coverUrl: string | null
  publishedAt: string
  author: User
  categories: Category[]
  locals: Local[]
  events: Event[]
}

export type NearbyEvent = {
  distanceMeters: number
  event: Event
}

export type NearbyLocal = {
  distanceMeters: number
  local: Local
}

export type NearbyResult = {
  events: NearbyEvent[]
  locals: NearbyLocal[]
}

export type Follow = {
  id: string
  targetId: string
  targetType: 'LOCAL' | 'ORGANIZATION' | 'USER'
  createdAt: string
}

export type Bookmark = {
  id: string
  targetId: string
  targetType: 'ARTICLE' | 'EVENT' | 'LOCAL'
  createdAt: string
}

export type Invitation = {
  id: string
  message: string | null
  status: 'ACCEPTED' | 'DECLINED' | 'PENDING'
  targetId: string
  targetType: 'EVENT' | 'LOCAL'
  createdAt: string
  sender: User
  recipient: User
}

export type AuthPayload = {
  accessToken: string
  user: User
}

export type FeedKind =
  | 'FOLLOW'
  | 'BOOKMARK'
  | 'INVITE'
  | 'INVITE_RESPONSE'
  | 'EVENT'
  | 'ARTICLE'

export type FeedItem = {
  id: string
  kind: FeedKind
  createdAt: string
  targetType: string
  targetId: string
  note: string | null
  actor: User | null
  extraUser: User | null
  targetUser: User | null
  local: Local | null
  event: Event | null
  article: Article | null
  organization: Organization | null
  likeCount: number
  commentCount: number
  liked: boolean
}

export type FeedComment = {
  id: string
  body: string
  createdAt: string
  author: User
}
