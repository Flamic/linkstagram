const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export const stringifyNumber = (num: number) => formatter.format(num)
