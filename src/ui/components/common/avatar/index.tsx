import cn from 'classnames'
import { useState } from 'react'

import { ReactComponent as FollowIcon } from 'assets/images/follow-icon.svg'
import { ReactComponent as UserIcon } from 'assets/images/user-icon.svg'

import styles from './styles.module.scss'

interface Props {
  bordered?: boolean
  followable?: boolean
  size?: 'small' | 'medium' | 'big' | 'large'
  src?: string | null
}

const Avatar: React.FC<Props> = ({
  bordered,
  followable,
  src,
  size = 'medium',
}) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn(styles.wrapper, styles[size], {
        [styles.bordered]: bordered,
        [styles.followable]: followable,
      })}
    >
      {src && (
        <img
          src={src}
          alt="avatar"
          draggable={false}
          className={cn(styles.img, { [styles.invisible]: !loaded })}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      )}
      {!loaded && (
        <div className={cn(styles.img, styles.userIconBox)}>
          <UserIcon className={styles.userIcon} />
        </div>
      )}
      {followable && <FollowIcon className={styles.followIcon} />}
    </div>
  )
}

export default Avatar
