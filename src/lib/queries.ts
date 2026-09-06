export const FRAG_CATEGORY = `
  id name slug
`

export const FRAG_ORG = `
  id name slug description avatarUrl
`

export const FRAG_USER = `
  id username name bio avatarUrl
`

export const FRAG_LOCAL = `
  id name slug description address zone city latitude longitude
  phone website coverUrl
  categories { ${FRAG_CATEGORY} }
  organization { ${FRAG_ORG} }
`

export const FRAG_EVENT = `
  id title slug description startsAt endsAt priceMin priceMax coverUrl
  categories { ${FRAG_CATEGORY} }
  organization { ${FRAG_ORG} }
  local {
    id name slug city zone latitude longitude coverUrl
    categories { ${FRAG_CATEGORY} }
    organization { ${FRAG_ORG} }
  }
`

export const Q_HOME = `
  query Home($upcoming: Boolean) {
    categories { ${FRAG_CATEGORY} }
    events(upcoming: $upcoming) { ${FRAG_EVENT} }
    locals { ${FRAG_LOCAL} }
    articles {
      id title slug excerpt coverUrl publishedAt
      author { ${FRAG_USER} }
      categories { ${FRAG_CATEGORY} }
      locals { id name slug zone city }
      events { id title slug startsAt }
    }
    users { ${FRAG_USER} interests { ${FRAG_CATEGORY} } }
  }
`

export const FRAG_FEED_ITEM = `
  id kind createdAt targetType targetId note
  likeCount commentCount liked
  actor { ${FRAG_USER} }
  extraUser { ${FRAG_USER} }
  targetUser { ${FRAG_USER} }
  organization { ${FRAG_ORG} }
  local { ${FRAG_LOCAL} }
  event { ${FRAG_EVENT} }
  article {
    id title slug excerpt coverUrl publishedAt
    author { ${FRAG_USER} }
    categories { ${FRAG_CATEGORY} }
    locals { id name slug zone city }
    events { id title slug startsAt }
  }
`

export const Q_FEED = `
  query Feed($limit: Int) {
    feed(limit: $limit) { ${FRAG_FEED_ITEM} }
    categories { ${FRAG_CATEGORY} }
    users { ${FRAG_USER} interests { ${FRAG_CATEGORY} } }
  }
`

export const S_FEED_ITEM = `
  subscription FeedItem {
    feedItem { ${FRAG_FEED_ITEM} }
  }
`

export const Q_SEARCH = `
  query Search($query: String!, $limit: Int) {
    search(query: $query, limit: $limit) {
      locals { ${FRAG_LOCAL} }
      events { ${FRAG_EVENT} }
      organizations { ${FRAG_ORG} }
      users { ${FRAG_USER} interests { ${FRAG_CATEGORY} } }
      articles {
        id title slug excerpt coverUrl publishedAt
        author { ${FRAG_USER} }
        categories { ${FRAG_CATEGORY} }
        locals { id name slug zone city }
        events { id title slug startsAt }
      }
    }
  }
`

export const Q_CATEGORIES = `
  query Categories {
    categories { ${FRAG_CATEGORY} }
  }
`

export const Q_NEARBY = `
  query Nearby($latitude: Float!, $longitude: Float!, $radiusKm: Float, $categorySlug: String) {
    nearby(latitude: $latitude, longitude: $longitude, radiusKm: $radiusKm, categorySlug: $categorySlug) {
      locals {
        distanceMeters
        local { ${FRAG_LOCAL} taxiLinks(originLat: $latitude, originLng: $longitude) { label provider url } }
      }
      events {
        distanceMeters
        event { ${FRAG_EVENT} }
      }
    }
    categories { ${FRAG_CATEGORY} }
  }
`

export const Q_LOCAL = `
  query Local($slug: String!) {
    local(slug: $slug) {
      ${FRAG_LOCAL}
      taxiLinks { label provider url }
      events { ${FRAG_EVENT} }
    }
  }
`

export const Q_EVENT = `
  query Event($slug: String!) {
    event(slug: $slug) { ${FRAG_EVENT} }
  }
`

export const Q_ARTICLE = `
  query Article($slug: String!) {
    article(slug: $slug) {
      id title slug excerpt body coverUrl publishedAt
      author { ${FRAG_USER} }
      categories { ${FRAG_CATEGORY} }
      locals { ${FRAG_LOCAL} }
      events { ${FRAG_EVENT} }
    }
  }
`

export const Q_USERS = `
  query Users {
    users { ${FRAG_USER} interests { ${FRAG_CATEGORY} } }
  }
`

export const Q_USER = `
  query User($username: String!) {
    user(username: $username) {
      ${FRAG_USER}
      email
      interests { ${FRAG_CATEGORY} }
    }
  }
`

export const Q_FOLLOWS = `
  query Follows($userId: ID!) {
    follows(userId: $userId) {
      id targetId targetType createdAt
    }
  }
`

export const Q_ORGANIZATION = `
  query Organization($slug: String!) {
    organization(slug: $slug) { ${FRAG_ORG} }
    locals { ${FRAG_LOCAL} }
    events(upcoming: true) { ${FRAG_EVENT} }
  }
`

export const Q_ME = `
  query Me {
    me {
      ${FRAG_USER}
      email
      interests { ${FRAG_CATEGORY} }
    }
    myFollows { id targetId targetType createdAt }
    myBookmarks { id targetId targetType createdAt }
    myInvitations {
      id message status targetId targetType createdAt
      sender { ${FRAG_USER} }
      recipient { ${FRAG_USER} }
    }
    categories { ${FRAG_CATEGORY} }
    locals { ${FRAG_LOCAL} }
    events(upcoming: false) { ${FRAG_EVENT} }
    articles {
      id title slug excerpt coverUrl publishedAt
      author { ${FRAG_USER} }
      categories { ${FRAG_CATEGORY} }
      locals { id name slug }
      events { id title slug startsAt }
    }
    users { ${FRAG_USER} }
    organizations { ${FRAG_ORG} }
  }
`

export const M_LOGIN = `
  mutation Login($identifier: String!, $password: String!) {
    login(identifier: $identifier, password: $password) {
      accessToken
      user { ${FRAG_USER} email interests { ${FRAG_CATEGORY} } }
    }
  }
`

export const M_REGISTER = `
  mutation Register($email: String!, $name: String!, $password: String!, $username: String!) {
    register(email: $email, name: $name, password: $password, username: $username) {
      accessToken
      user { ${FRAG_USER} email interests { ${FRAG_CATEGORY} } }
    }
  }
`

export const M_SET_INTERESTS = `
  mutation SetInterests($categorySlugs: [String!]!) {
    setInterests(categorySlugs: $categorySlugs) {
      ${FRAG_USER}
      interests { ${FRAG_CATEGORY} }
    }
  }
`

export const M_FOLLOW = `
  mutation Follow($targetId: ID!, $targetType: FollowTargetType!) {
    follow(targetId: $targetId, targetType: $targetType) {
      id targetId targetType createdAt
    }
  }
`

export const M_UNFOLLOW = `
  mutation Unfollow($targetId: ID!, $targetType: FollowTargetType!) {
    unfollow(targetId: $targetId, targetType: $targetType) {
      id targetId targetType
    }
  }
`

export const M_BOOKMARK = `
  mutation Bookmark($targetId: ID!, $targetType: BookmarkTargetType!) {
    bookmark(targetId: $targetId, targetType: $targetType) {
      id targetId targetType createdAt
    }
  }
`

export const M_UNBOOKMARK = `
  mutation Unbookmark($targetId: ID!, $targetType: BookmarkTargetType!) {
    unbookmark(targetId: $targetId, targetType: $targetType) {
      id targetId targetType
    }
  }
`

export const M_INVITE = `
  mutation Invite($recipientId: ID!, $targetId: ID!, $targetType: InvitationTargetType!, $message: String) {
    inviteFriend(recipientId: $recipientId, targetId: $targetId, targetType: $targetType, message: $message) {
      id status message targetId targetType createdAt
      sender { ${FRAG_USER} }
      recipient { ${FRAG_USER} }
    }
  }
`

export const M_RESPOND = `
  mutation Respond($id: ID!, $status: InvitationStatus!) {
    respondInvitation(id: $id, status: $status) {
      id status message targetId targetType
      sender { ${FRAG_USER} }
      recipient { ${FRAG_USER} }
    }
  }
`

export const Q_FEED_COMMENTS = `
  query FeedComments($feedItemId: ID!) {
    feedComments(feedItemId: $feedItemId) {
      id body createdAt
      author { ${FRAG_USER} }
    }
  }
`

export const M_LIKE_FEED = `
  mutation LikeFeedItem($feedItemId: ID!) {
    likeFeedItem(feedItemId: $feedItemId) {
      liked likeCount
    }
  }
`

export const M_COMMENT_FEED = `
  mutation CommentOnFeed($feedItemId: ID!, $body: String!) {
    commentOnFeedItem(feedItemId: $feedItemId, body: $body) {
      id body createdAt
      author { ${FRAG_USER} }
    }
  }
`
