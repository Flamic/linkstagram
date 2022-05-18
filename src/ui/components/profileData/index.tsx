import { Profile } from 'core/types/user'
import { stringifyNumber } from 'core/utils/numberConverter'
import { getProfileName } from 'core/utils/profile'

import Avatar from '../common/avatar'
import Button from '../common/button'

import styles from './styles.module.scss'

interface Props {
  expanded?: boolean
  ownProfile?: boolean
  profile: Profile
}

const ProfileData: React.FC<Props> = ({ expanded, ownProfile, profile }) => (
  <div className={styles.box}>
    <div className={styles.avatarRow}>
      <div className={styles.countBox}>
        <span className={styles.value}>
          {stringifyNumber(profile.followers)}
        </span>
        <span className={styles.text}>Followers</span>
      </div>
      <Avatar
        src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Anthro_vixen_colored.jpg"
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
    <div className={styles.buttonRow}>
      <Button
        variant="secondary"
        className={styles.button}
        border="border"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        Edit profile
      </Button>
      <Button
        variant="primary"
        className={styles.button}
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        New post
      </Button>
    </div>
  </div>
)

export default ProfileData
