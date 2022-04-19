export interface ImageMetadata {
  filename: string
  mimeType: string
  size: number
}

export interface NewImage {
  id: string
  metadata: ImageMetadata
  storage: string
}

export interface Image {
  id: number
  url: string
}

export interface PhotoAttribute {
  image: NewImage
}
