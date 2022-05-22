import { useEffect, useState } from 'react'

import { ACCOUNT_ROUTE, API_LINK } from 'core/constants/links'
import { Account } from 'core/types/user'

const TOKEN_KEY = 'authToken'
const USERNAME_KEY = 'authUsername'

interface AuthData {
  token: string
  username?: string
}

interface Subscriber {
  notify(data: AuthData | null): void
}

const subscribers: Subscriber[] = []
let isRequestingUsername = false

const notifySubscribers = (data: AuthData | null) =>
  subscribers.forEach((subscriber) => subscriber.notify(data))

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUsername = () => localStorage.getItem(USERNAME_KEY)

const fetchUsername = (token: string) => {
  if (isRequestingUsername) return

  isRequestingUsername = true
  fetch(`${API_LINK}${ACCOUNT_ROUTE}`, {
    headers: { authorization: `Bearer ${token}` },
  })
    .then((response) =>
      response.json().then((account: Account) => {
        localStorage.setItem(USERNAME_KEY, account.username)
        notifySubscribers({
          token: token as string,
          username: account.username,
        })
      }),
    )
    .finally(() => {
      isRequestingUsername = false
    })
}

export const getAuthData = (): AuthData | null => {
  const token = getToken()
  const username = getUsername()

  if (!token) return null

  if (!username) {
    fetchUsername(token)

    return null
  }

  return { token, username }
}

export const setAuthData = (data: AuthData) => {
  localStorage.setItem(TOKEN_KEY, data.token)

  if (!data.username) {
    fetchUsername(data.token)

    return
  }

  localStorage.setItem(USERNAME_KEY, data.username)
  notifySubscribers(data)
}

export const updateUsername = (username: string) => {
  const token = getToken()

  if (!token) return

  localStorage.setItem(USERNAME_KEY, username)
  notifySubscribers({ token, username })
}

export const removeAuthData = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
  notifySubscribers(null)
}

export const useAuth = () => {
  const [dataState, setDataState] = useState<AuthData | null>(getAuthData())

  useEffect(() => {
    const subscriber: Subscriber = {
      notify: (data) => setDataState(data),
    }

    subscribers.push(subscriber)

    return () => {
      subscribers.splice(subscribers.indexOf(subscriber), 1)
    }
  }, [])

  return dataState
}
