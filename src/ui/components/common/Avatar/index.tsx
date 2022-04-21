import cn from 'classnames'

import { ReactComponent as FollowIcon } from 'assets/images/follow-icon.svg'

import styles from './styles.module.scss'

interface Props {
  bordered?: boolean
  followable?: boolean
  size?: 'small' | 'medium' | 'big' | 'large'
  src: string
}

const Avatar: React.FC<Props> = ({
  bordered,
  followable,
  src,
  size = 'medium',
}) => {
  return (
    <div
      className={cn(styles.wrapper, styles[size], {
        [styles.bordered]: bordered,
        [styles.followable]: followable,
      })}
    >
      <img src={src} alt="avatar" />
      {followable && <FollowIcon className={styles.followIcon} />}
    </div>
  )
}

export default Avatar
