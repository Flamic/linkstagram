import {
  convertObjectKeys,
  nameToCamelCase,
  nameToSnakeCase,
} from 'core/utils/objectConverter'

const fetchFn = async (input: RequestInfo, init?: RequestInit) => {
  let body
  let result: Response

  if (
    typeof input !== 'string' &&
    ['POST', 'PUT', 'PATCH'].includes(input.method)
  ) {
    body = JSON.stringify(
      convertObjectKeys(await input.json(), nameToSnakeCase),
    )
    result = await fetch(new Request(input, { body }), init)
  } else {
    result = await fetch(input, init)
  }

  const data = result.headers.get('content-type')?.includes('json')
    ? convertObjectKeys(await result.json(), nameToCamelCase)
    : {}

  return new Response(JSON.stringify(data), {
    headers: result.headers,
    status: result.status,
    statusText: result.statusText,
  })
}

export default fetchFn
