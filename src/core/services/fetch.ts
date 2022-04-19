const API_LINK = 'https://linkstagram-api.linkupst.com/'

export const fetchApi = (input: string, init?: RequestInit) =>
  fetch(`${API_LINK}${input}`, {
    ...init,
    headers: { ...init?.headers, Authorization: '' },
  })

export default { fetchApi }
