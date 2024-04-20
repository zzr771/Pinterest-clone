import { Types } from "mongoose"

export interface Option {
  label: string
  callback?: () => void
}

export interface RequestError {
  errorMessage: string
}

export interface UserSettings {
  _id: string
  id?: string
  username: string
  imageUrl: string
  firstName: string
  lastName?: string
  about?: string
  website?: string
  path?: string
}

export type DraftState = "" | "Creating..." | "Saving..." | "Changes stored!" | "Publishing..."

export interface PinDraft {
  _id: string
  imageUrl: string
  prevImageUrl?: string
  imageSize: {
    width: number
    height: number
  }
  expiredAt: number // millisecond
  title?: string
  description?: string
  link?: string

  state: DraftState
  isUnsaved?: boolean // only drafts created by 'genEmptyDraft' has this property, and drafts from the database don't
}

export interface PinParams {
  _id: string
  author: string
  imageUrl: string
  imageSize: {
    width: number
    height: number
  }
  title?: string
  description?: string
  link?: string
  createdAt: number
  comments?: Comment[]
  reactions?: [
    {
      user: string
      reaction: string
    }
  ]
}

export interface Comment {
  author: string
  content: string
  createdAt: number
  likes: number

  replyTo?: string
  replies?: Comment[]
}
