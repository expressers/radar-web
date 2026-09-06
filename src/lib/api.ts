const DEFAULT_URL = 'http://localhost:4000/graphql'

export function apiUrl() {
  return import.meta.env.VITE_API_URL ?? DEFAULT_URL
}

export function wsUrl() {
  const http = apiUrl()
  if (http.startsWith('https://')) return `wss://${http.slice('https://'.length)}`
  if (http.startsWith('http://')) return `ws://${http.slice('http://'.length)}`
  return http
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

type GraphQlBody<T> = {
  data?: T
  errors?: { message: string }[]
}

export async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string | null,
): Promise<T> {
  const response = await fetch(apiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })

  let json: GraphQlBody<T>
  try {
    json = (await response.json()) as GraphQlBody<T>
  } catch {
    throw new ApiError('A API não respondeu. Confirma que o backend está a correr.')
  }

  if (json.errors?.length) {
    throw new ApiError(json.errors[0]?.message ?? 'Algo correu mal.')
  }

  if (!json.data) {
    throw new ApiError('Resposta vazia da API.')
  }

  return json.data
}
