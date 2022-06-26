import cn from 'classnames'
import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

import api from 'core/store'
import { Image } from 'core/types/image'
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
  const [openedPost, setOpenedPost] = useState<number | null>(null)
  const [isViewPostModalOpened, setIsViewPostModalOpened] = useState(false)

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
        images={posts
          .filter((post) => post.photos.length > 0)
          .map((post) => ({
            ...(post.photos.at(-1) as Image),
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
    </main>
  )
}

export default ProfileView
