import cn from 'classnames'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import api from 'core/store'
import { getProfileName } from 'core/utils/profile'
import { humanizeDistanceToNow } from 'core/utils/time'

import Avatar from '../common/avatar'
import Loader from '../common/loader'
import Paginator from '../common/paginator'

import styles from './styles.module.scss'

interface Page {
  current: number
  previous?: number
}

interface Props {
  className?: string
  phone?: boolean
  postId: number
}

const COMMENTS_COUNT_ON_PAGE = 25

const CommentsView: React.FC<Props> = ({ className, phone, postId }) => {
  const [page, setPage] = useState<Page>({ current: 1 })
  const [getComments, { data: comments, isFetching, isError }] =
    api.useLazyGetCommentsQuery()

  useEffect(() => {
    getComments({ postId, page: page.current }, true)
  }, [postId, getComments, page])

  const toPreviousPage = () =>
    page.previous && setPage({ current: page.previous })
  const toNextPage = (toPage: number) =>
    setPage({ current: toPage, previous: page.current })

  if (!isFetching && (isError || !comments || !comments.length)) {
    if (isError) toast.error('Cannot load comments')

    toPreviousPage()
  }

  return (
    <section className={cn(styles.box, { [styles.phone]: phone }, className)}>
      {isFetching ? (
        <Loader />
      ) : (
        <>
          {comments?.map((comment) => (
            <Link
              key={comment.id}
              className={styles.comment}
              to={`/profile/${comment.commenter.username}`}
            >
              <Avatar
                src={comment.commenter.profilePhotoUrl}
                size={phone ? 'small' : 'medium'}
              />
              <div
                className={cn(styles.commentBody, { [styles.phone]: phone })}
              >
                <p className={styles.commentText}>{comment.message}</p>
                <div className={styles.commentTime}>
                  {humanizeDistanceToNow(comment.createdAt)}
                </div>
                {phone && (
                  <div className={styles.commenter}>
                    {getProfileName(comment.commenter)}
                  </div>
                )}
              </div>
            </Link>
          ))}
          {comments?.length && (
            <Paginator
              page={page.current}
              onChange={toNextPage}
              hideNext={comments && comments.length < COMMENTS_COUNT_ON_PAGE}
            />
          )}
        </>
      )}
    </section>
  )
}

export default CommentsView
