import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

export const humanizeDistanceToNow = (createdAt: string) => {
  const date = new Date(createdAt)

  if (Number(Date.now()) - Number(date) < 60000) return 'Just now'

  return formatDistanceToNowStrict(date, { addSuffix: true })
}
