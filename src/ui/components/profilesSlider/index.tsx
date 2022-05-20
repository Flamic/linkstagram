import { useMediaQuery } from 'react-responsive'
import Slider from 'react-slick'

import { PHONE_MEDIA } from 'core/constants/media'
import { Profile } from 'core/types/user'
import Avatar from 'ui/components/common/avatar'

import styles from './styles.module.scss'

interface Props {
  profiles: Profile[]
}

const ProfilesSlider: React.FC<Props> = ({ profiles }) => {
  const matchedPhone = useMediaQuery(PHONE_MEDIA)

  return (
    <div className={styles.box}>
      <Slider
        centerPadding="24px"
        swipeToSlide
        arrows={false}
        infinite={false}
        variableWidth
      >
        {profiles.map((profile) => (
          <Avatar
            size={matchedPhone ? 'medium' : 'big'}
            src={profile.profilePhotoUrl}
            bordered
            key={profile.username}
          />
        ))}
      </Slider>
      <div className={styles.endFilter} />
    </div>
  )
}

export default ProfilesSlider
