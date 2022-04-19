import { UserProfile } from './user'

export interface NewComment {
  message: string
}

export interface Comment {
  commenter: UserProfile
  createdAt: string
  id: number
  message: string
}
