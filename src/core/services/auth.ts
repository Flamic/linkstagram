import { useEffect, useState } from 'react'

const TOKEN_KEY = 'authToken'

interface Subscriber {
  notify(token: string | null): void
}

const subscribers: Subscriber[] = []

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
  subscribers.forEach((subscriber) => subscriber.notify(token))
}

export const removeAuthData = () => {
  localStorage.removeItem(TOKEN_KEY)
  subscribers.forEach((subscriber) => subscriber.notify(null))
}

export const useAuth = () => {
  const [tokenState, setTokenState] = useState(getToken())

  useEffect(() => {
    const subscriber: Subscriber = {
      notify: (token) => setTokenState(token),
    }
    const { length: index } = subscribers

    subscribers.push(subscriber)

    return () => {
      subscribers.splice(index, 1)
    }
  }, [])

  return tokenState
}
