import ReactModal from 'react-modal'
import { useMediaQuery } from 'react-responsive'

import { TABLET_MEDIA } from 'core/constants/media'
import { removeFiles, uploadFiles } from 'core/services/uppy'
import api from 'core/store'
import { PhotoAttribute } from 'core/types/image'
import { RawNewPost } from 'core/types/post'
import { tryCatchRequest } from 'core/utils/error'
import Header from 'ui/components/header'
import PostForm from 'ui/components/postForm'

import styles from './styles.module.scss'

interface Props {
  show?: boolean
  onClose?(): void
}

const CreatePostView: React.FC<Props> = ({ show, onClose }) => {
  const isTablet = useMediaQuery(TABLET_MEDIA)
  const [publishPost, { isLoading }] = api.useAddPostMutation()

  const publish = async (post: RawNewPost) => {
    if (!post.photos || isLoading) return

    let uploadedPhotos: PhotoAttribute[] | undefined

    const ok = await tryCatchRequest({
      request: async () => {
        uploadedPhotos = await uploadFiles(post.photos as File[])
      },
      errorMessage: 'Cannot upload post images',
    })

    if (!ok) return

    await tryCatchRequest({
      request: async () => {
        await publishPost({
          description: post.description,
          photosAttributes: uploadedPhotos as PhotoAttribute[],
        }).unwrap()
      },
      errorMessage: 'Cannot publish post',
      successMessage: 'Post successfully published',
      onSuccess: onClose,
      onError: () =>
        uploadedPhotos &&
        removeFiles(uploadedPhotos.map((photo) => photo.image.id)),
    })
  }

  return (
    <ReactModal
      isOpen={Boolean(show)}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      className={styles.modal}
    >
      {isTablet && <Header onBack={onClose} />}
      <div className={styles.box}>
        <PostForm phone={isTablet} onCancel={onClose} onPost={publish} />
      </div>
    </ReactModal>
  )
}

export default CreatePostView
