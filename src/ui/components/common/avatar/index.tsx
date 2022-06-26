import cn from 'classnames'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { ReactComponent as FollowIcon } from 'assets/images/follow-icon.svg'
import { ReactComponent as UserIcon } from 'assets/images/user-icon.svg'

import styles from './styles.module.scss'

interface Props {
  bordered?: boolean
  followable?: boolean
  id?: number | string
  onChoose?: FileCallback
  redirectTo?: string
  size?: 'small' | 'medium' | 'big' | 'large' | 'xl'
  src?: string | null
}

const Avatar: React.FC<Props> = ({
  bordered,
  followable,
  id,
  onChoose,
  redirectTo,
  size = 'medium',
  src,
}) => {
  const [lastId, setLastId] = useState(id)
  const [url, setUrl] = useState(src)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (id && id === lastId) return

    setLoaded(false)
    setLastId(id)
    setUrl(src)
  }, [src, id, lastId])

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

  const preparedImage = redirectTo ? (
    <Link
      to={redirectTo}
      draggable="false"
      onDragStart={(event) => {
        event.preventDefault()
      }}
    >
      {mainImage}
    </Link>
  ) : (
    mainImage
  )

  return onChoose ? (
    <label htmlFor="selectAvatar">
      {mainImage}
      <input
        type="file"
        id="selectAvatar"
        accept="image/png, image/jpeg"
        style={{ display: 'none' }}
        onChange={(event) => {
          if (event.currentTarget.files?.[0]) {
            onChoose(event.currentTarget.files[0])
            setUrl(URL.createObjectURL(event.currentTarget.files[0]))
          }
        }}
      />
    </label>
  ) : (
    preparedImage
  )
}

export default Avatar
