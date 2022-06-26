import cn from 'classnames'
import { useEffect, useState } from 'react'
import ReactModal from 'react-modal'
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'

import { TABLET_MEDIA } from 'core/constants/media'
import { useAuth } from 'core/services/auth'
import api from 'core/store'
import { stringifyNumber } from 'core/utils/numberConverter'
import { getProfileName } from 'core/utils/profile'
import CommentsView from 'ui/components/commentsView'
import Avatar from 'ui/components/common/avatar'
import Button from 'ui/components/common/button'
import ImageView from 'ui/components/common/imageView'
import Loader from 'ui/components/common/loader'
import TextInput from 'ui/components/common/textInput'
import Header from 'ui/components/header'
import PostItemView from 'ui/components/postItemView'

import styles from './styles.module.scss'

interface Props {
  postId: number
  show?: boolean
  onClose?(): void
}

const PostView: React.FC<Props> = ({ postId, show, onClose }) => {
  const isPhone = useMediaQuery(TABLET_MEDIA)
  const auth = useAuth()
  const [comment, setComment] = useState('')
  const [lastPostId, setLastPostId] = useState<number | null>(null)
  const { data, currentData } = api.useGetPostQuery(postId)
  const [postComment, { isLoading: isLoadingComment }] =
    api.useAddCommentMutation()
  const [like, { isLoading: isLoadingLike }] = api.useLikePostMutation()
  const [unlike, { isLoading: isLoadingUnlike }] = api.useUnlikePostMutation()
  const [remove, { isLoading: isLoadingRemove }] = api.useDeletePostMutation()

  useEffect(() => {
    if (currentData) setLastPostId(postId)
  }, [currentData, postId])

  const likePost = () => {
    if (
      !data ||
      (data.isLiked && isLoadingUnlike) ||
      (!data.isLiked && isLoadingLike)
    )
      return

    const action = data.isLiked ? unlike : like

    action(postId)
      .unwrap()
      .catch((error) => {
        console.error(error)
        toast.error('Something went wrong')
      })
  }

  const commentPost = () => {
    if (!data || isLoadingComment) return

    postComment({ postId, message: comment })
      .unwrap()
      .catch((error) => {
        console.error(error)
        toast.error('Something went wrong when trying to post comment')
      })
      .finally(() => setComment(''))
  }

  const removePost = () => {
    if (isLoadingRemove) return

    remove(postId)
      .unwrap()
      .then(() => {
        toast.success('Post was successfull deleted')
        onClose?.()
      })
      .catch((error) => {
        console.error(error)
        toast.error('Something went wrong when trying to remove post')
      })
  }

  const getCommentBox = () => (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        commentPost()
      }}
      className={styles.commentBox}
    >
      <TextInput
        placeholder="Add a comment..."
        onChange={(event) => setComment(event.target.value)}
        className={styles.inputBox}
        inputClassName={styles.input}
        value={comment}
      />
      <Button
        variant="secondary"
        onClick={commentPost}
        className={styles.postButton}
        type="submit"
        hoverEffect={false}
        disabled={!comment}
      >
        Post
      </Button>
    </form>
  )

  return isPhone ? (
    <ReactModal
      isOpen={Boolean(show)}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      className={styles.phoneModal}
    >
      <Header onBack={onClose} />
      <div className={styles.content}>
        {!data || lastPostId !== postId ? (
          <div className={styles.loaderBox}>
            <Loader />
          </div>
        ) : (
          <>
            <PostItemView
              post={{ ...data, photos: data.photos.slice().reverse() }}
              onLike={likePost}
              onRemove={
                auth?.username === data.author.username ? removePost : undefined
              }
            />
            <CommentsView
              postId={postId}
              phone
              className={styles.commentsViewBox}
            />
            {getCommentBox()}
          </>
        )}
      </div>
    </ReactModal>
  ) : (
    <ReactModal
      isOpen={Boolean(show)}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      className={styles.modal}
    >
      {!data || lastPostId !== postId ? (
        <div className={styles.loaderBox}>
          <Loader />
        </div>
      ) : (
        <div className={styles.box}>
          <ImageView
            images={data.photos.slice().reverse()}
            contain
            className={styles.image}
          />
          <section className={styles.infoSection}>
            <div className={styles.userBox}>
              <Avatar
                src={data.author.profilePhotoUrl}
                id={data.author.username}
                redirectTo={`/profile/${data.author.username}`}
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
            <CommentsView postId={postId} className={styles.commentsViewBox} />
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
            {getCommentBox()}
          </section>
        </div>
      )}
    </ReactModal>
  )
}

export default PostView
