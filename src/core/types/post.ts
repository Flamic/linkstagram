import { PhotoAttribute, Image } from './image'
import { UserProfile } from './user'

export interface NewPost {
  description: string
  photosAttributes: PhotoAttribute[]
}

export interface Post {
  author: UserProfile
  commentsCount: number
  createdAt: string
  description: string
  id: number
  isLiked: boolean
  likesCount: number
  photos: Image[]
}
