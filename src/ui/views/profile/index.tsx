import cn from 'classnames'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

import { useAuth } from 'core/services/auth'
import api from 'core/store'
import { Post } from 'core/types/post'
import Loader from 'ui/components/common/loader'
import ImagesGrid from 'ui/components/imagesGrid'
import ProfileData from 'ui/components/profileData'

import PostView from '../post'

import styles from './styles.module.scss'

interface Props {
  username: string
}

const ProfileView: React.FC<Props> = ({ username }) => {
  const isMobile = useMediaQuery({ maxWidth: 720 })
  const currentUser = useAuth()
  const [openedPost, setOpenedPost] = useState<Post | null>(null)
  const [isModalOpened, setIsModalOpened] = useState(false)

  const openPost = (post: Post) => {
    setOpenedPost(post)
    setIsModalOpened(true)
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

  useEffect(() => setIsModalOpened(false), [profile?.username])

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
          profile.username === currentUser?.username ? () => 1 : undefined // TODO: Edit form
        }
        onPostCreate={
          profile.username === currentUser?.username ? () => 2 : undefined // TODO: Post create form
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
          onClick: () => openPost(post),
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
          post={openedPost}
          show={isModalOpened}
          onClose={() => setIsModalOpened(false)}
        />
      )}
    </main>
  )
}

export default ProfileView
