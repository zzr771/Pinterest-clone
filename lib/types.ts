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
}

export interface Pin {
  author: Types.ObjectId
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
      user: Types.ObjectId
      reaction: string
    }
  ]
}

export interface Comment {
  author: Types.ObjectId
  content: string
  createdAt: number
  likes: number

  replyTo?: Types.ObjectId
  replies?: Comment[]
}
