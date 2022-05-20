import cn from 'classnames'
import { useMediaQuery } from 'react-responsive'

import api from 'core/store'
import Loader from 'ui/components/common/loader'
import ImagesGrid from 'ui/components/imagesGrid'
import ProfileData from 'ui/components/profileData'

import styles from './styles.module.scss'

interface Props {
  username: string
}

const ProfileView: React.FC<Props> = ({ username }) => {
  const isMobile = useMediaQuery({ maxWidth: 720 })

  const {
    data: profile,
    isFetching: isFetchingProfile,
    isError: isProfileError,
    error: profileError,
  } = api.useGetProfileQuery(username)
  const {
    data: posts,
    isFetching: isFetchingPosts,
    isError: isPostsError,
    error: postsError,
  } = api.useGetPostsOfUserQuery(username)

  const getProfileView = () => {
    if (isFetchingProfile) return <Loader />

    if (isProfileError || !profile)
      return (
        <h1 className={styles.error}>
          {profileError && 'data' in profileError
            ? JSON.stringify(profileError.data)
            : 'Cannot get this profile :('}
        </h1>
      )

    return (
      <ProfileData
        className={styles.profile}
        expanded={!isMobile}
        profile={profile}
      />
    )
  }

  const getPostsView = () => {
    if (isFetchingPosts) return null

    if (isPostsError || !posts) {
      if (isFetchingProfile || isProfileError || !profile) return null

      return (
        <h1 className={styles.error}>
          {postsError && 'data' in postsError
            ? JSON.stringify(postsError.data)
            : 'Cannot get posts of this user :('}
        </h1>
      )
    }

    return <ImagesGrid images={posts.map((post) => post.photos[0])} />
  }

  return (
    <main className={cn(styles.main, { [styles.mobile]: isMobile })}>
      {getProfileView()}
      {getPostsView()}
    </main>
  )
}

export default ProfileView
