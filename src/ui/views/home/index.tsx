import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import { POSTS_COUNT_ON_PAGE } from 'core/constants/limits'
import { useAuth } from 'core/services/auth'
import api from 'core/store'
import { Page } from 'core/types/paginator'
import { Post } from 'core/types/post'
import { tryCatchRequest } from 'core/utils/error'
import Loader from 'ui/components/common/loader'
import Paginator from 'ui/components/common/paginator'
import PostItemView from 'ui/components/postItemView'
import ProfileData from 'ui/components/profileData'
import ProfilesSlider from 'ui/components/profilesSlider'

import PostView from '../post'

import styles from './styles.module.scss'

const HomeView: React.FC = () => {
  const isBigTablet = useMediaQuery({ maxWidth: 1024 })
  const auth = useAuth()
  const { data: account, isError: isAccountError } = api.useGetAccountQuery(
    undefined,
    {
      refetchOnReconnect: true,
    },
  )
  const { data: profiles } = api.useGetProfilesQuery(1)

  const [openedPost, setOpenedPost] = useState<number | null>(null)
  const [isViewPostModalOpened, setIsViewPostModalOpened] = useState(false)
  const [page, setPage] = useState<Page>({ current: 1 })
  const {
    data: posts,
    isFetching: isFetchingPosts,
    isError: isPostsError,
    refetch: refetchPosts,
  } = api.useGetPostsQuery(page.current)
  const [like, { isLoading: isLoadingLike }] = api.useLikePostMutation()
  const [unlike, { isLoading: isLoadingUnlike }] = api.useUnlikePostMutation()
  const [remove, { isLoading: isLoadingRemove }] = api.useDeletePostMutation()

  useEffect(() => {
    refetchPosts()
  }, [refetchPosts, page])

  const toPreviousPage = () =>
    page.previous && setPage({ current: page.previous })
  const toNextPage = (toPage: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    setPage({ current: toPage, previous: page.current })
  }

  const getProfile = () => {
    if (isAccountError)
      return <div className={styles.error}>Cannot get profile :(</div>

    if (!account) return <Loader />

    return (
      <div className={styles.rightBox}>
        <ProfileData profile={account} />
        <p className={styles.footer}>
          About Help Privacy Terms Locations Language ©
          {new Date().getFullYear()} Linkstagram
        </p>
      </div>
    )
  }

  const openPost = (postId: number) => {
    setOpenedPost(postId)
    setIsViewPostModalOpened(true)
  }

  const likePost = (post: Post) => {
    if ((post.isLiked && isLoadingUnlike) || (!post.isLiked && isLoadingLike))
      return

    const action = post.isLiked ? unlike : like

    tryCatchRequest({
      request: async () => {
        await action(post.id)
      },
      errorMessage: 'Something went wrong',
    })
  }

  const removePost = (postId: number) => {
    if (isLoadingRemove) return

    tryCatchRequest({
      request: async () => {
        await remove(postId)
      },
      errorMessage: 'Something went wrong when trying to remove post',
      successMessage: 'Post was successfull deleted',
    })
  }

  if (!isFetchingPosts && (isPostsError || !posts || !posts.length)) {
    toPreviousPage()
  }

  return (
    <>
      <main className={styles.main}>
        <section className={styles.leftBox}>
          <ProfilesSlider profiles={profiles} />
          <div className={styles.postBox}>
            {!posts ? (
              <Loader />
            ) : (
              posts.map((post) => (
                <PostItemView
                  key={post.id}
                  post={post}
                  onComment={() => openPost(post.id)}
                  onViewPost={() => openPost(post.id)}
                  onLike={() => likePost(post)}
                  onRemove={
                    auth?.username === post.author.username
                      ? () => removePost(post.id)
                      : undefined
                  }
                />
              ))
            )}
            <Paginator
              page={page.current}
              onChange={toNextPage}
              hideNext={posts && posts.length < POSTS_COUNT_ON_PAGE}
            />
          </div>
        </section>
        {!isBigTablet && getProfile()}
      </main>
      {openedPost && (
        <PostView
          postId={openedPost}
          show={isViewPostModalOpened}
          onClose={() => setIsViewPostModalOpened(false)}
        />
      )}
    </>
  )
}

export default HomeView
