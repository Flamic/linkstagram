import { useMediaQuery } from 'react-responsive'
import { useNavigate, useParams } from 'react-router-dom'

import { PHONE_MEDIA } from 'core/constants/media'
import Header from 'ui/components/header'
import ProfileView from 'ui/views/profile'

const ProfilePage: React.FC = () => {
  const isPhone = useMediaQuery(PHONE_MEDIA)
  const { username } = useParams()
  const navigate = useNavigate()

  if (!username) {
    navigate('/')

    return null
  }

  return (
    <>
      <Header mode={isPhone ? 'home' : undefined} />
      <ProfileView username={username} />
    </>
  )
}

export default ProfilePage
