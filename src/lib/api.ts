const DEFAULT_URL = 'https://radar-0t6d.onrender.com/graphql'

export function apiUrl() {
  const configured = import.meta.env.VITE_API_URL?.trim()
  if (!configured) return DEFAULT_URL
  return configured.endsWith('/graphql') ? configured : `${configured.replace(/\/$/, '')}/graphql`
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
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(apiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
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
