import cn from 'classnames'

import { Profile } from 'core/types/user'
import { stringifyNumber } from 'core/utils/numberConverter'
import { getProfileName } from 'core/utils/profile'

import Avatar from '../common/avatar'
import Button from '../common/button'

import styles from './styles.module.scss'

interface Props {
  className?: string
  expanded?: boolean
  profile: Profile
  onEdit?(): void
  onPostCreate?(): void
}

const ProfileData: React.FC<Props> = ({
  className,
  expanded,
  profile,
  onEdit,
  onPostCreate,
}) =>
  expanded ? (
    <section className={cn(styles.expandedBox, className)}>
      <div className={styles.avatar}>
        <Avatar src={profile.profilePhotoUrl} size="xl" bordered />
      </div>
      <div>
        <h1 className={styles.name}>{getProfileName(profile)}</h1>
        <h2 className={styles.job}>{profile.jobTitle}</h2>
      </div>
      <p className={styles.description}>{profile.description}</p>

      <div className={cn(styles.countBox, styles.followers)}>
        <div className={styles.value}>{stringifyNumber(profile.followers)}</div>
        <div className={styles.text}>Followers</div>
      </div>
      {onEdit && (
        <Button
          variant="secondary"
          className={styles.button}
          border="border"
          onClick={onEdit}
        >
          Edit profile
        </Button>
      )}

      <div className={cn(styles.countBox, styles.following)}>
        <div className={styles.value}>{stringifyNumber(profile.following)}</div>
        <div className={styles.text}>Following</div>
      </div>
      {onPostCreate && (
        <Button
          variant="primary"
          className={styles.button}
          onClick={onPostCreate}
        >
          New post
        </Button>
      )}
    </section>
  ) : (
    <section className={cn(styles.box, className)}>
      <div className={styles.avatarRow}>
        <div className={styles.countBox}>
          <span className={styles.value}>
            {stringifyNumber(profile.followers)}
          </span>
          <span className={styles.text}>Followers</span>
        </div>
        <Avatar
          src={profile.profilePhotoUrl}
          size="large"
          followable
          bordered
        />
        <div className={styles.countBox}>
          <span className={styles.value}>
            {stringifyNumber(profile.following)}
          </span>
          <span className={styles.text}>Following</span>
        </div>
      </div>
      <div>
        {getProfileName(profile)}
        <span className={styles.splitter}>-</span>
        {profile.jobTitle}
      </div>
      <div className={styles.descriptionRow}>{profile.description}</div>
      {(onEdit || onPostCreate) && (
        <div className={styles.buttonRow}>
          {onEdit && (
            <Button
              variant="secondary"
              className={styles.button}
              border="border"
              onClick={onEdit}
            >
              Edit profile
            </Button>
          )}
          {onPostCreate && (
            <Button
              variant="primary"
              className={styles.button}
              onClick={onPostCreate}
            >
              New post
            </Button>
          )}
        </div>
      )}
    </section>
  )

export default ProfileData
