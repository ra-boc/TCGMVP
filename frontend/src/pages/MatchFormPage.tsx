import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, type Deck, type MatchInput, type Result, type TurnOrder } from '../api/client'
import { fromDateTimeLocal, toDateTimeLocal } from '../utils'

type MatchFormState = {
  deck_id: string
  opponent_deck: string
  result: Result
  turn_order: TurnOrder
  played_at: string
  notes: string
}

function initialForm(): MatchFormState {
  return {
    deck_id: '',
    opponent_deck: '',
    result: 'win',
    turn_order: 'first',
    played_at: toDateTimeLocal(new Date().toISOString()),
    notes: '',
  }
}

export function MatchFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const matchId = useMemo(() => (id ? Number(id) : null), [id])
  const isEditing = matchId !== null
  const [decks, setDecks] = useState<Deck[]>([])
  const [form, setForm] = useState<MatchFormState>(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const loadedDecks = await api.listDecks()
      setDecks(loadedDecks)

      if (matchId) {
        const match = await api.getMatch(matchId)
        setForm({
          deck_id: String(match.deck_id),
          opponent_deck: match.opponent_deck,
          result: match.result,
          turn_order: match.turn_order,
          played_at: toDateTimeLocal(match.played_at),
          notes: match.notes ?? '',
        })
      } else if (loadedDecks[0]) {
        setForm((current) => ({ ...current, deck_id: String(loadedDecks[0].id) }))
      }
    }

    load()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [matchId])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const input: MatchInput = {
      deck_id: Number(form.deck_id),
      opponent_deck: form.opponent_deck,
      result: form.result,
      turn_order: form.turn_order,
      played_at: fromDateTimeLocal(form.played_at),
      notes: form.notes,
    }

    try {
      if (matchId) {
        await api.updateMatch(matchId, input)
      } else {
        await api.createMatch(input)
      }
      navigate('/matches')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-stack narrow-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Match Form</p>
          <h1>{isEditing ? '対戦記録編集' : '対戦記録作成'}</h1>
        </div>
        <Link className="button secondary" to="/matches">
          一覧へ戻る
        </Link>
      </header>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        {loading ? (
          <p className="muted">読み込み中です。</p>
        ) : decks.length === 0 ? (
          <div className="empty-state">
            <p>先にデッキを登録してください。</p>
            <Link className="button primary" to="/decks/new">
              デッキを登録
            </Link>
          </div>
        ) : (
          <>
            {error && <p className="error-text">{error}</p>}
            <label>
              <span>使用デッキ</span>
              <select
                required
                value={form.deck_id}
                onChange={(event) => setForm((current) => ({ ...current, deck_id: event.target.value }))}
              >
                {decks.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>相手デッキ</span>
              <input
                required
                value={form.opponent_deck}
                onChange={(event) => setForm((current) => ({ ...current, opponent_deck: event.target.value }))}
                placeholder="例: Artifact Portal"
              />
            </label>
            <div className="form-grid">
              <label>
                <span>結果</span>
                <select
                  value={form.result}
                  onChange={(event) => setForm((current) => ({ ...current, result: event.target.value as Result }))}
                >
                  <option value="win">勝ち</option>
                  <option value="loss">負け</option>
                </select>
              </label>
              <label>
                <span>先攻/後攻</span>
                <select
                  value={form.turn_order}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, turn_order: event.target.value as TurnOrder }))
                  }
                >
                  <option value="first">先攻</option>
                  <option value="second">後攻</option>
                </select>
              </label>
            </div>
            <label>
              <span>対戦日時</span>
              <input
                required
                type="datetime-local"
                value={form.played_at}
                onChange={(event) => setForm((current) => ({ ...current, played_at: event.target.value }))}
              />
            </label>
            <label>
              <span>メモ</span>
              <textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                rows={5}
              />
            </label>
            <div className="form-actions">
              <Link className="button secondary" to="/matches">
                キャンセル
              </Link>
              <button className="button primary" type="submit" disabled={submitting}>
                {submitting ? '保存中' : '保存'}
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  )
}
