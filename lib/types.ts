export interface Option {
  label: string
  callback?: () => void
}

export interface RequestError {
  errorMessage: string
}

export interface UserSettings {
  id: string
  username: string
  imageUrl: string
  firstName: string
  _id?: string
  lastName?: string
  about?: string
  website?: string
  path?: string
}

export interface PinDraft {
  _id: string
  imageUrl: string
  imageSize: {
    width: number
    height: number
  }
  expiredAt: number // millisecond
  title?: string
  description?: string
  link?: string
}
