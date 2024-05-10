export interface Option {
  label: string
  callback?: () => void
}

export interface RequestError {
  errorMessage: string
}

export interface UserInfoBasic {
  _id: string
  firstName: string
  lastName?: string
  imageUrl?: string
  follower?: [string?]
}

export interface UserSetting {
  _id: string
  id?: string
  username: string
  imageUrl: string
  firstName: string
  lastName?: string
  about?: string
  website?: string
}

export interface UserInfo extends UserSetting {
  created: [string?]
  saved: [string?]
  following: [string?]
  follower: [string?]

  // To be implemented
  hidePins?: [string?]
  blockUsers?: [string?]
}

export type DraftState = "" | "Creating..." | "Saving..." | "Changes stored!" | "Publishing..."

export interface PinInfoBasic {
  _id: string
  title: string
  description: string
  link: string
}

export interface PinDraft {
  _id: string
  imageUrl: string
  prevImageUrl?: string
  imageSize: {
    width: number
    height: number
  }
  expiredAt: number // millisecond
  title: string
  description: string
  link: string

  state: DraftState // Doesn't exist in database. Only for client-side use
  isUnsaved?: boolean // Doesn't exist in database. Only drafts created by 'genEmptyDraft' has this property
}

export interface PinInfoShallow {
  _id: string
  author: string
  imageUrl: string
  imageSize: {
    width: number
    height: number
  }
  title: string
  description: string
  link: string
  createdAt: string
  comments: [string?]
  reactions: [Reaction?]
}

export interface PinInfoDeep {
  _id: string
  author: UserInfoBasic
  imageUrl: string
  imageSize: {
    width: number
    height: number
  }
  title: string
  description: string
  link: string
  createdAt: string
  comments: [CommentInfo?]
  reactions: [Reaction?]
}

export interface Reaction {
  user: string
  reaction: string
}

export interface CommentInfo {
  _id: string
  author: UserInfoBasic
  content: string
  createdAt: string
  likes: number
  isReply: boolean

  replies: [CommentInfo?]
  commentOnPin: string | null

  replyToUser: UserInfoBasic | null
  replyToComment: string | null

  collapseReplies?: boolean // Doesn't exist in database. Only for client-side use
}
