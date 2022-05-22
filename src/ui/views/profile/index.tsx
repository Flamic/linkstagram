import cn from 'classnames'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

import { useAuth } from 'core/services/auth'
import api from 'core/store'
import Loader from 'ui/components/common/loader'
import ImagesGrid from 'ui/components/imagesGrid'
import ProfileData from 'ui/components/profileData'

import CreatePostView from '../createPost'
import EditProfileView from '../editProfile'
import PostView from '../post'

import styles from './styles.module.scss'

interface Props {
  username: string
}

const ProfileView: React.FC<Props> = ({ username }) => {
  const isMobile = useMediaQuery({ maxWidth: 720 })
  const currentUser = useAuth()
  const [openedPost, setOpenedPost] = useState<number | null>(null)
  const [isViewPostModalOpened, setIsViewPostModalOpened] = useState(false)
  const [isEditProfileModalOpened, setIsEditProfileModalOpened] =
    useState(false)
  const [isNewPostModalOpened, setIsNewPostModalOpened] = useState(false)

  const openPost = (postId: number) => {
    setOpenedPost(postId)
    setIsViewPostModalOpened(true)
  }

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = api.useGetProfileQuery(username)
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isPostsError,
  } = api.useGetPostsOfUserQuery(username)

  useEffect(() => setIsViewPostModalOpened(false), [profile?.username])

  const getProfileView = () => {
    if (isLoadingProfile) return <Loader />

    if (isProfileError || !profile)
      return <h1 className={styles.error}>Cannot get this profile :(</h1>

    return (
      <ProfileData
        className={styles.profile}
        expanded={!isMobile}
        profile={profile}
        onEdit={
          profile.username === currentUser?.username
            ? () => setIsEditProfileModalOpened(true)
            : undefined
        }
        onPostCreate={
          profile.username === currentUser?.username
            ? () => setIsNewPostModalOpened(true)
            : undefined
        }
      />
    )
  }

  const getPostsView = () => {
    if (isLoadingPosts) return null

    if (isPostsError || !posts) {
      if (isProfileError || !profile) return null

      return <h1 className={styles.error}>Cannot get posts of this user :(</h1>
    }

    return (
      <ImagesGrid
        images={posts.map((post) => ({
          ...post.photos[0],
          onClick: () => openPost(post.id),
        }))}
      />
    )
  }

  return (
    <main className={cn(styles.main, { [styles.mobile]: isMobile })}>
      {getProfileView()}
      {getPostsView()}
      {openedPost && (
        <PostView
          postId={openedPost}
          show={isViewPostModalOpened}
          onClose={() => setIsViewPostModalOpened(false)}
        />
      )}
      {profile && currentUser?.username === profile?.username && (
        <>
          <EditProfileView
            show={isEditProfileModalOpened}
            onClose={() => setIsEditProfileModalOpened(false)}
          />
          <CreatePostView
            show={isNewPostModalOpened}
            onClose={() => setIsNewPostModalOpened(false)}
          />
        </>
      )}
    </main>
  )
}

export default ProfileView
