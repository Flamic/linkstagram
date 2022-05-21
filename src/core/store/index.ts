import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_LINK } from 'core/constants/links'
import { getToken, setAuthData } from 'core/services/auth'
import { Comment, NewComment } from 'core/types/comment'
import { NewPost, Post } from 'core/types/post'
import { Account, AuthUser, Profile, SignUpUser } from 'core/types/user'
import {
  convertObjectKeys,
  nameToCamelCase,
  nameToSnakeCase,
} from 'core/utils/objectConverter'

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
    fetchFn: async (input, init) => {
      let body = init?.body

      if (
        typeof body === 'string' &&
        init?.method &&
        ['POST', 'PUT', 'PATCH'].includes(init.method)
      ) {
        body = JSON.stringify(
          convertObjectKeys(JSON.parse(body), nameToSnakeCase),
        )
      }

      const result: Response = await fetch(input, { ...init, body })

      const data = result.headers.get('content-type')?.includes('json')
        ? convertObjectKeys(await result.json(), nameToCamelCase)
        : {}

      return new Response(JSON.stringify(data), {
        headers: result.headers,
        status: result.status,
        statusText: result.statusText,
      })
    },
  }),
  tagTypes: ['Posts', 'UserPosts', 'Comments', 'Account'],

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
      query(body) {
        return {
          url: 'posts',
          method: 'POST',
          body,
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
    updateAccount: build.mutation<Account, Partial<Account>>({
      query(body) {
        return { url: 'account', method: 'PATCH', body }
      },
      invalidatesTags: ['Account'],
    }),

    // Profile
    getProfiles: build.query<Profile[], number | undefined>({
      query: (page = 1) => `profiles?page=${page}`,
    }),
    getProfile: build.query<Profile, string>({
      query: (username) => `profiles/${username}`,
    }),
  }),
})

export default api
