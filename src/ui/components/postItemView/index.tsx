import cn from 'classnames'

import { Post } from 'core/types/post'
import { stringifyNumber } from 'core/utils/numberConverter'
import { getProfileName } from 'core/utils/profile'
import { humanizeDistanceToNow } from 'core/utils/time'

import Avatar from '../common/avatar'
import Button from '../common/button'
import MenuButton from '../common/menuButton'

import styles from './styles.module.scss'

interface Props {
  post: Post
  onComment?(): void
  onLike?(): void
  onRemove?(): void
  onViewPost?(): void
  onViewProfile?(): void
}

const PostItemView: React.FC<Props> = ({
  post,
  onComment,
  onLike,
  onRemove,
  onViewPost,
  onViewProfile,
}) => {
  const menuItems = onRemove
    ? ['View', 'Like', 'Comment', 'Remove']
    : ['View', 'Like', 'Comment']

  const onSelectItem = (selected: string) => {
    switch (selected) {
      case 'View':
        onViewPost?.()

        break
      case 'Like':
        onLike?.()

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
        <Avatar src={post.author.profilePhotoUrl} />
        <div className={styles.userData}>
          <div>{getProfileName(post.author)}</div>
          <div className={styles.createdAt}>
            {humanizeDistanceToNow(post.createdAt)}
          </div>
        </div>
        <MenuButton items={menuItems} onSelect={onSelectItem} />
      </div>
      <div className={styles.imgWrapper}>
        <img src={post.photos[0].url} alt="Post" className={styles.img} />
      </div>
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
