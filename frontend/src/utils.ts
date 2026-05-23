import type { Result, TurnOrder } from './api/client'

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function resultLabel(result: Result) {
  return result === 'win' ? '勝ち' : '負け'
}

export function turnOrderLabel(turnOrder: TurnOrder) {
  return turnOrder === 'first' ? '先攻' : '後攻'
}

export function toDateTimeLocal(value: string) {
  const date = new Date(value)
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return offsetDate.toISOString().slice(0, 16)
}

export function fromDateTimeLocal(value: string) {
  return new Date(value).toISOString()
}
