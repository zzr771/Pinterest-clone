export interface Draft {
  _id?: string // all drafts has a _id, except for a new draft that hasn't been saved
  title?: string
  description?: string
  link?: string
  image: string
  expirationTime: number // millisecond
}

export interface Option {
  label: string
  callback?: () => void
}

export interface RequestError {
  errorMessage: string
}
