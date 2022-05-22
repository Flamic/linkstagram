import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_LINK } from 'core/constants/links'
import { getToken, setAuthData } from 'core/services/auth'
import fetchFn from 'core/services/fetch'
import { Comment, NewComment } from 'core/types/comment'
import { NewPost, Post } from 'core/types/post'
import {
  Account,
  AuthUser,
  EditAccount,
  Profile,
  SignUpUser,
} from 'core/types/user'

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_LINK,
    prepareHeaders: (headers) => {
      const token = getToken()

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
    fetchFn,
  }),
  tagTypes: ['Posts', 'UserPosts', 'Comments', 'Account', 'Profile'],

  endpoints: (build) => ({
    // Login
    login: build.mutation<void, AuthUser>({
      query(body) {
        return {
          url: 'login',
          method: 'POST',
          body,
        }
      },
      transformResponse: (_value, meta, _arg) => {
        const token = meta?.response?.headers.get('Authorization')

        if (token) setAuthData({ token })
      },
    }),
    createAccount: build.mutation<void, SignUpUser>({
      query(body) {
        return {
          url: 'create-account',
          method: 'POST',
          body,
        }
      },
      transformResponse: (_value, meta, arg) => {
        const token = meta?.response?.headers.get('Authorization')

        if (token) setAuthData({ token, username: arg.username })
      },
    }),

    // Posts
    getPosts: build.query<Post[], number | undefined>({
      query: (page = 1) => `posts?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Posts', id } as const)),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getPostsOfUser: build.query<Post[], string>({
      query: (username) => `profiles/${username}/posts`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'UserPosts', id } as const)),
              { type: 'UserPosts', id: 'LIST' },
            ]
          : [{ type: 'UserPosts', id: 'LIST' }],
    }),
    getPost: build.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Posts', id }],
    }),
    addPost: build.mutation<Post, NewPost>({
      query(newPost) {
        return {
          url: 'posts',
          method: 'POST',
          body: { post: newPost },
        }
      },
      invalidatesTags: [
        { type: 'Posts', id: 'LIST' },
        { type: 'UserPosts', id: 'LIST' },
      ],
    }),
    deletePost: build.mutation<void, number>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'DELETE',
          body: {},
        }
      },
      invalidatesTags: (_result, _error, _id) => [
        { type: 'Posts', id: 'LIST' },
        { type: 'UserPosts', id: 'LIST' },
      ],
    }),

    // Like
    likePost: build.mutation<void, number>({
      query(id) {
        return {
          url: `posts/${id}/like`,
          method: 'POST',
          body: {},
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Posts', id },
        { type: 'UserPosts', id },
      ],
    }),
    unlikePost: build.mutation<void, number>({
      query(id) {
        return {
          url: `posts/${id}/like`,
          method: 'DELETE',
          body: {},
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Posts', id },
        { type: 'UserPosts', id },
      ],
    }),

    // Comment
    getComments: build.query<
      Comment[],
      {
        postId: number
        page: number | undefined
      }
    >({
      query: ({ postId, page = 1 }) => `posts/${postId}/comments?page=${page}`,
      providesTags: (result, _error, postId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Comments', id } as const)),
              { type: 'Comments', id: `${postId}/LIST` },
            ]
          : [{ type: 'Comments', id: `${postId}/LIST` }],
    }),
    addComment: build.mutation<void, NewComment>({
      query({ postId, ...body }) {
        return {
          url: `posts/${postId}/comments`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Posts', id: postId },
        { type: 'UserPosts', id: postId },
        { type: 'Comments', id: `${postId}/LIST` },
      ],
    }),

    // Account
    getAccount: build.query<Account, void>({
      query: () => 'account',
      providesTags: ['Account'],
    }),
    updateAccount: build.mutation<Account, EditAccount>({
      query(account) {
        return { url: 'account', method: 'PATCH', body: { account } }
      },
      invalidatesTags: (_result, _error, { username }) => [
        { type: 'Account' },
        { type: 'Profile', id: username },
        { type: 'Profile', id: 'LIST' },
      ],
    }),

    // Profile
    getProfiles: build.query<Profile[], number | undefined>({
      query: (page = 1) => `profiles?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ username }) => ({ type: 'Profile', id: username } as const),
              ),
              { type: 'Profile', id: 'LIST' },
            ]
          : [{ type: 'Profile', id: 'LIST' }],
    }),
    getProfile: build.query<Profile, string>({
      query: (username) => `profiles/${username}`,
      providesTags: (_result, _error, username) => [
        { type: 'Profile', id: username },
      ],
    }),
  }),
})

export default api
