import { PhotoAttribute, Image } from './image'
import { Profile } from './user'

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

export interface NewPost {
  description?: string | null
  photosAttributes: PhotoAttribute[]
}

export type RawNewPost = Omit<NewPost, 'photosAttributes'> & {
  photos: File[] | null
}
