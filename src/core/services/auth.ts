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

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUsername = () => localStorage.getItem(USERNAME_KEY)

export const getAuthData = () => {
  const token = getToken()
  const username = getUsername()

  return token && username ? { token, username } : null
}

export const setAuthData = (data: AuthData) => {
  localStorage.setItem(TOKEN_KEY, data.token)

  if (data.username) {
    localStorage.setItem(USERNAME_KEY, data.username)
    subscribers.forEach((subscriber) => subscriber.notify(data))
  } else {
    fetch(`${API_LINK}${ACCOUNT_ROUTE}`, {
      headers: { authorization: data.token },
    }).then((response) =>
      response.json().then((account: Account) => {
        localStorage.setItem(USERNAME_KEY, account.username)
        subscribers.forEach((subscriber) =>
          subscriber.notify({ ...data, username: account.username }),
        )
      }),
    )
  }
}

const updateUsername = () => {
  const token = getToken()

  if (!token) return

  fetch(`${API_LINK}${ACCOUNT_ROUTE}`, {
    headers: { authorization: token },
  }).then((response) =>
    response.json().then((account: Account) => {
      localStorage.setItem(USERNAME_KEY, account.username)
      subscribers.forEach((subscriber) =>
        subscriber.notify({ token, username: account.username }),
      )
    }),
  )
}

export const removeAuthData = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
  subscribers.forEach((subscriber) => subscriber.notify(null))
}

export const useAuth = () => {
  const [dataState, setDataState] = useState<AuthData | null>(getAuthData())

  useEffect(() => {
    const subscriber: Subscriber = {
      notify: (data) => setDataState(data),
    }
    const { length: index } = subscribers

    subscribers.push(subscriber)

    return () => {
      subscribers.splice(index, 1)
    }
  }, [])

  return dataState
}
