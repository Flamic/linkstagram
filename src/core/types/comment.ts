import { Profile } from './user'

export interface NewComment {
  message: string
  postId: number
}

export interface Comment {
  commenter: Profile
  createdAt: string
  id: number
  message: string
}
