import { PhotoAttribute, Image } from './image'
import { Profile } from './user'

export interface NewPost {
  description: string
  photosAttributes: PhotoAttribute[]
}

export interface Post {
  author: Profile
  commentsCount: number
  createdAt: string
  description: string
  id: number
  isLiked: boolean
  likesCount: number
  photos: Image[]
}
