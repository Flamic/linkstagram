import cn from 'classnames'
import { Link } from 'react-router-dom'

import { Post } from 'core/types/post'
import { stringifyNumber } from 'core/utils/numberConverter'
import { getProfileName } from 'core/utils/profile'
import { humanizeDistanceToNow } from 'core/utils/time'

import Avatar from '../common/avatar'
import Button from '../common/button'
import ImageView from '../common/imageView'
import MenuButton from '../common/menuButton'

import styles from './styles.module.scss'

interface Props {
  post: Post
  onComment?(): void
  onLike?(): void
  onRemove?(): void
  onViewPost?(): void
}

const PostItemView: React.FC<Props> = ({
  post,
  onComment,
  onLike,
  onRemove,
  onViewPost,
}) => {
  const menuItems: string[] = []

  if (onViewPost) menuItems.push('View')

  if (onComment) menuItems.push('Comment')

  if (onRemove) menuItems.push('Remove')

  const onSelectItem = (selected: string) => {
    switch (selected) {
      case 'View':
        onViewPost?.()

        break
      case 'Comment':
        onComment?.()

        break
      case 'Remove':
        onRemove?.()

        break

      default:
    }
  }

  return (
    <section className={styles.box}>
      <div className={styles.userRow}>
        <Link to={`/profile/${post.author.username}`} className={styles.link}>
          <Avatar src={post.author.profilePhotoUrl} id={post.author.username} />
          <div className={styles.userData}>
            <div>{getProfileName(post.author)}</div>
            <div className={styles.createdAt}>
              {humanizeDistanceToNow(post.createdAt)}
            </div>
          </div>
        </Link>
        {Boolean(menuItems.length) && (
          <MenuButton items={menuItems} onSelect={onSelectItem} />
        )}
      </div>
      <ImageView
        images={post.photos.slice().reverse()}
        keepAspectRatio
        className={styles.imageView}
      />
      {post.description && <p>{post.description}</p>}
      <div className={styles.bottomRow}>
        <Button
          variant="secondary"
          hoverEffect={false}
          onClick={onLike}
          className={styles.like}
        >
          <i className={cn('icon-like', { [styles.liked]: post.isLiked })} />
          <span className={styles.count}>
            {stringifyNumber(post.likesCount)}
          </span>
        </Button>
        <Button
          variant="secondary"
          hoverEffect={false}
          onClick={onComment}
          className={styles.comment}
        >
          <i className={cn('icon-comments')} />
          <span className={styles.count}>
            {stringifyNumber(post.commentsCount)}
          </span>
        </Button>
        <Button
          variant="secondary"
          hoverEffect={false}
          className={styles.share}
        >
          <span className={styles.shareText}>Share</span>
          <i className={cn('icon-arrow')} />
        </Button>
      </div>
    </section>
  )
}

export default PostItemView
