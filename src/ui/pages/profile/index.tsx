import { useNavigate, useParams } from 'react-router-dom'

import Header from 'ui/components/header'
import ProfileView from 'ui/views/profile'

const ProfilePage: React.FC = () => {
  const { username } = useParams()
  const navigate = useNavigate()

  if (!username) {
    navigate('/')

    return null
  }

  return (
    <>
      <Header />
      <ProfileView username={username} />
    </>
  )
}

export default ProfilePage
