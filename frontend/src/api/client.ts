const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export type Result = 'win' | 'loss'
export type TurnOrder = 'first' | 'second'

export type Deck = {
  id: number
  name: string
  archetype: string
  notes: string | null
  deck_code: string | null
  deck_url: string | null
  deck_list: string | null
  created_at: string
  updated_at: string
}

export type DeckInput = {
  name: string
  archetype: string
  notes?: string
  deck_code?: string
  deck_url?: string
  deck_list?: string
}

export type MatchRecord = {
  id: number
  deck_id: number
  deck: Deck
  opponent_deck: string
  result: Result
  turn_order: TurnOrder
  played_at: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type MatchInput = {
  deck_id: number
  opponent_deck: string
  result: Result
  turn_order: TurnOrder
  played_at: string
  notes?: string
}

export type RateSummary = {
  label: string
  total: number
  wins: number
  losses: number
  win_rate: number
  deck_id?: number
  archetype?: string
}

export type StatsSummary = {
  overall: RateSummary
  by_deck: RateSummary[]
  by_opponent_deck: RateSummary[]
  by_turn_order: RateSummary[]
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number
  readonly errors: string[]

  constructor(message: string, status: number, errors: string[] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errors = Array.isArray(data?.errors) ? data.errors : []
    throw new ApiError(errors.join(', ') || 'API request failed', response.status, errors)
  }

  return data as T
}

export const api = {
  listDecks: () => request<Deck[]>('/decks'),
  getDeck: (id: number) => request<Deck>(`/decks/${id}`),
  createDeck: (deck: DeckInput) => request<Deck>('/decks', { method: 'POST', body: { deck } }),
  updateDeck: (id: number, deck: DeckInput) =>
    request<Deck>(`/decks/${id}`, { method: 'PATCH', body: { deck } }),
  deleteDeck: (id: number) => request<void>(`/decks/${id}`, { method: 'DELETE' }),

  listMatches: () => request<MatchRecord[]>('/matches'),
  getMatch: (id: number) => request<MatchRecord>(`/matches/${id}`),
  createMatch: (match: MatchInput) =>
    request<MatchRecord>('/matches', { method: 'POST', body: { match } }),
  updateMatch: (id: number, match: MatchInput) =>
    request<MatchRecord>(`/matches/${id}`, { method: 'PATCH', body: { match } }),
  deleteMatch: (id: number) => request<void>(`/matches/${id}`, { method: 'DELETE' }),

  getStats: () => request<StatsSummary>('/stats/summary'),
}
