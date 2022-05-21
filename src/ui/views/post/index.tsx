import cn from 'classnames'
import { useState } from 'react'
import ReactModal from 'react-modal'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'

import { PHONE_MEDIA } from 'core/constants/media'
import api from 'core/store'
import { Post } from 'core/types/post'
import { stringifyNumber } from 'core/utils/numberConverter'
import { getProfileName } from 'core/utils/profile'
import CommentsView from 'ui/components/commentsView'
import Avatar from 'ui/components/common/avatar'
import Button from 'ui/components/common/button'
import ImageView from 'ui/components/common/imageView'
import Loader from 'ui/components/common/loader'
import TextInput from 'ui/components/common/textInput'

import styles from './styles.module.scss'

interface Props {
  post: Post
  show?: boolean
  onClose?(): void
}

const PostView: React.FC<Props> = ({ post, show, onClose }) => {
  const isPhone = useMediaQuery(PHONE_MEDIA)
  const [comment, setComment] = useState('')
  const { currentData: data } = api.useGetPostQuery(post.id)
  const [postComment, { isLoading: isLoadingComment }] =
    api.useAddCommentMutation()
  const [like, { isLoading: isLoadingLike }] = api.useLikePostMutation()
  const [unlike, { isLoading: isLoadingUnlike }] = api.useUnlikePostMutation()

  const likePost = () => {
    if (
      !data ||
      (data.isLiked && isLoadingUnlike) ||
      (!data.isLiked && isLoadingLike)
    )
      return

    const action = data.isLiked ? unlike : like

    action(data.id)
      .unwrap()
      .catch((error) => {
        console.error(error)
        toast('Something went wrong')
      })
  }

  const commentPost = () => {
    if (!data || isLoadingComment) return

    postComment({ postId: data.id, message: comment })
      .unwrap()
      .catch((error) => {
        console.error(error)
        toast('Something went wrong when trying to post comment')
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
      {!data ? (
        <div className={styles.loaderBox}>
          <Loader />
        </div>
      ) : (
        <div className={styles.box}>
          <ImageView
            images={data.photos.slice().reverse()}
            className={styles.image}
          />
          <section className={styles.infoSection}>
            <div className={styles.userBox}>
              <Avatar
                src={data.author.profilePhotoUrl}
                id={data.author.username}
              />
              <div className={styles.name}>{getProfileName(data.author)}</div>
              <button
                type="button"
                onClick={onClose}
                className={styles.closeButton}
              >
                <i className="icon-cross" />
              </button>
            </div>
            <CommentsView
              postId={data.id}
              phone={isPhone}
              className={styles.commentsViewBox}
            />
            <div>
              <Button
                variant="secondary"
                hoverEffect={false}
                onClick={likePost}
                className={styles.like}
              >
                <i
                  className={cn('icon-like', { [styles.liked]: data.isLiked })}
                />
                <span className={styles.count}>
                  {stringifyNumber(data.likesCount)}
                </span>
              </Button>
            </div>
            <div className={styles.commentBox}>
              <TextInput
                placeholder="Add a comment..."
                onChange={(event) => setComment(event.target.value)}
                className={styles.inputBox}
                inputClassName={styles.input}
              />
              <Button
                variant="secondary"
                onClick={commentPost}
                className={styles.postButton}
              >
                Post
              </Button>
            </div>
          </section>
        </div>
      )}
    </ReactModal>
  )
}

export default PostView
