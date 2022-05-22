import cn from 'classnames'
import { useState } from 'react'

import { useAuth } from 'core/services/auth'
import { Profile } from 'core/types/user'
import { stringifyNumber } from 'core/utils/numberConverter'
import { getProfileName } from 'core/utils/profile'
import CreatePostView from 'ui/views/createPost'
import EditProfileView from 'ui/views/editProfile'

import Avatar from '../common/avatar'
import Button from '../common/button'

import styles from './styles.module.scss'

interface Props {
  className?: string
  expanded?: boolean
  profile: Profile
}

const ProfileData: React.FC<Props> = ({ className, expanded, profile }) => {
  const auth = useAuth()
  const isOwnProfile = auth?.username === profile.username
  const [isEditProfileModalOpened, setIsEditProfileModalOpened] =
    useState(false)
  const [isNewPostModalOpened, setIsNewPostModalOpened] = useState(false)

  return (
    <>
      {expanded ? (
        <section className={cn(styles.expandedBox, className)}>
          <div className={styles.avatar}>
            <Avatar
              src={profile.profilePhotoUrl}
              redirectTo={`/profile/${profile.username}`}
              size="xl"
              bordered
            />
          </div>
          <div>
            <h1 className={styles.name}>{getProfileName(profile)}</h1>
            <h2 className={styles.job}>{profile.jobTitle}</h2>
          </div>
          <p className={styles.description}>{profile.description}</p>

          <div className={cn(styles.countBox, styles.followers)}>
            <div className={styles.value}>
              {stringifyNumber(profile.followers)}
            </div>
            <div className={styles.text}>Followers</div>
          </div>
          {isOwnProfile && (
            <Button
              variant="secondary"
              className={styles.button}
              border="border"
              onClick={() => setIsEditProfileModalOpened(true)}
            >
              Edit profile
            </Button>
          )}

          <div className={cn(styles.countBox, styles.following)}>
            <div className={styles.value}>
              {stringifyNumber(profile.following)}
            </div>
            <div className={styles.text}>Following</div>
          </div>
          {isOwnProfile && (
            <Button
              variant="primary"
              className={styles.button}
              onClick={() => setIsNewPostModalOpened(true)}
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
              redirectTo={`/profile/${profile.username}`}
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
          {isOwnProfile && (
            <div className={styles.buttonRow}>
              <Button
                variant="secondary"
                className={styles.button}
                border="border"
                onClick={() => setIsEditProfileModalOpened(true)}
              >
                Edit profile
              </Button>

              <Button
                variant="primary"
                className={styles.button}
                onClick={() => setIsNewPostModalOpened(true)}
              >
                New post
              </Button>
            </div>
          )}
        </section>
      )}
      <EditProfileView
        show={isEditProfileModalOpened}
        onClose={() => setIsEditProfileModalOpened(false)}
      />
      <CreatePostView
        show={isNewPostModalOpened}
        onClose={() => setIsNewPostModalOpened(false)}
      />
    </>
  )
}
export default ProfileData
