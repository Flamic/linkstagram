type UnknownObject = Record<string, unknown> | unknown[]

export const nameToCamelCase = (str: string) =>
  str.toLowerCase().replace(/[-_]([a-z])/g, (group) => group.toUpperCase())

export const keysToCamelCase = (obj: UnknownObject): UnknownObject => {
  if (Array.isArray(obj))
    return obj.map((e) =>
      e && typeof e === 'object' ? keysToCamelCase(e as UnknownObject) : e,
    )

  return Object.fromEntries(
    Object.entries(obj).map((pair) => [
      nameToCamelCase(pair[0]),
      pair[1] && typeof pair[1] === 'object'
        ? keysToCamelCase(pair[1] as UnknownObject)
        : pair[1],
    ]),
  )
}
