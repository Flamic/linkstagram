import { useMediaQuery } from 'react-responsive'
import Slider from 'react-slick'

import { PHONE_MEDIA } from 'core/constants/media'
import { Profile } from 'core/types/user'
import Avatar from 'ui/components/common/avatar'

import styles from './styles.module.scss'

interface Props {
  profiles?: Profile[]
}

const ProfilesSlider: React.FC<Props> = ({ profiles }) => {
  const isPhone = useMediaQuery(PHONE_MEDIA)

  const preparedProfiles = profiles ?? Array<undefined>(10).fill(undefined)

  return (
    <div className={styles.box}>
      <Slider
        centerPadding="24px"
        swipeToSlide
        arrows={false}
        infinite={false}
        variableWidth
      >
        {preparedProfiles.map((profile, index) => (
          <Avatar
            size={isPhone ? 'medium' : 'big'}
            src={profile && profile.profilePhotoUrl}
            key={profile ? profile.username : index}
            redirectTo={profile && `/profile/${profile.username}`}
            bordered
          />
        ))}
      </Slider>
      <div className={styles.endFilter} />
    </div>
  )
}

export default ProfilesSlider
