type UnknownObject = Record<string, unknown> | unknown[]

export const nameToCamelCase = (str: string) =>
  str.toLowerCase().replace(/[-_]([a-z])/g, (_, group) => group.toUpperCase())

export const nameToSnakeCase = (str: string) =>
  str.replace(/([A-Z])/g, (group) => `_${group.toLowerCase()}`)

export const emptyStringToNull = (value: unknown) =>
  value === '' ? null : value

export const convertObjectKeys = (
  obj: UnknownObject,
  converter: (str: string) => string,
): UnknownObject => {
  if (Array.isArray(obj))
    return obj.map((e) =>
      e && typeof e === 'object'
        ? convertObjectKeys(e as UnknownObject, converter)
        : e,
    )

  return Object.fromEntries(
    Object.entries(obj).map((pair) => [
      converter(pair[0]),
      pair[1] && typeof pair[1] === 'object'
        ? convertObjectKeys(pair[1] as UnknownObject, converter)
        : pair[1],
    ]),
  )
}

export const convertObjectValues = (
  obj: UnknownObject,
  converter: (value: unknown) => unknown,
): UnknownObject => {
  if (Array.isArray(obj))
    return obj.map((e) =>
      e && typeof e === 'object'
        ? convertObjectValues(e as UnknownObject, converter)
        : e,
    )

  return Object.fromEntries(
    Object.entries(obj).map((pair) => [
      pair[0],
      pair[1] && typeof pair[1] === 'object'
        ? convertObjectValues(pair[1] as UnknownObject, converter)
        : converter(pair[1]),
    ]),
  )
}

export const omitPropery = <
  O extends Record<string, unknown>,
  K extends string,
>(
  obj: O,
  key: K,
) =>
  ({
    ...obj,
    [key]: undefined,
  } as Omit<O, K>)
