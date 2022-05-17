import cn from 'classnames'
import { useState } from 'react'

import { ReactComponent as FollowIcon } from 'assets/images/follow-icon.svg'
import { ReactComponent as UserIcon } from 'assets/images/user-icon.svg'

import styles from './styles.module.scss'

interface Props {
  bordered?: boolean
  followable?: boolean
  onChoose?: FileCallback
  size?: 'small' | 'medium' | 'big' | 'large'
  src?: string | null
}

const Avatar: React.FC<Props> = ({
  bordered,
  followable,
  onChoose,
  size = 'medium',
  src,
}) => {
  const [url, setUrl] = useState(src)
  const [loaded, setLoaded] = useState(false)

  const mainImage = (
    <div
      className={cn(styles.wrapper, {
        [styles[size]]: !onChoose,
        [styles.bordered]: bordered && !onChoose,
        [styles.followable]: followable && !onChoose,
        [styles.choose]: onChoose,
      })}
    >
      {url && (
        <img
          src={url || undefined}
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
      {onChoose && <div className={styles.chooseLabel}>Choose new photo</div>}
    </div>
  )

  return (
    <div>
      {onChoose ? (
        <label htmlFor="selectAvatar">
          {mainImage}
          <input
            type="file"
            id="selectAvatar"
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
            onChange={(event) =>
              event.currentTarget.files?.[0] &&
              onChoose(event.currentTarget.files?.[0]) &&
              setUrl(URL.createObjectURL(event.currentTarget.files[0]))
            }
          />
        </label>
      ) : (
        mainImage
      )}
    </div>
  )
}

export default Avatar
