import AwsS3 from '@uppy/aws-s3'
import Uppy from '@uppy/core'

import { API_LINK } from 'core/constants/links'
import { PhotoAttribute } from 'core/types/image'

const initUppy = () => {
  const uppy = new Uppy({
    restrictions: {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/png', 'image/jpg'],
    },
  })

  uppy.use(AwsS3, { companionUrl: API_LINK })

  return uppy
}

const uppy = initUppy()

export const uploadFiles = async (files: File[]): Promise<PhotoAttribute[]> => {
  uppy.addFiles(
    files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      data: file,
    })),
  )

  const result = await uppy.upload()

  if (result.failed.length) {
    throw result.failed
  }

  return result.successful.map((file) => {
    const { key } = file.meta as Record<string, string>
    const [storage, id] = key.split('/')

    return {
      image: {
        id,
        storage,
        metadata: {
          filename: file.meta.name,
          mimeType: file.data.type,
          size: file.data.size,
        },
      },
    }
  })
}
