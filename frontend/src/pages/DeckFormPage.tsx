import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, type DeckInput } from '../api/client'

const initialForm: DeckInput = {
  name: '',
  archetype: '',
  notes: '',
}

export function DeckFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const deckId = useMemo(() => (id ? Number(id) : null), [id])
  const isEditing = deckId !== null
  const [form, setForm] = useState<DeckInput>(initialForm)
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!deckId) return

    api
      .getDeck(deckId)
      .then((deck) => setForm({ name: deck.name, archetype: deck.archetype, notes: deck.notes ?? '' }))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [deckId])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (deckId) {
        await api.updateDeck(deckId, form)
      } else {
        await api.createDeck(form)
      }
      navigate('/decks')
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
          <p className="eyebrow">Deck Form</p>
          <h1>{isEditing ? 'デッキ編集' : 'デッキ作成'}</h1>
        </div>
        <Link className="button secondary" to="/decks">
          一覧へ戻る
        </Link>
      </header>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        {loading ? (
          <p className="muted">読み込み中です。</p>
        ) : (
          <>
            {error && <p className="error-text">{error}</p>}
            <label>
              <span>デッキ名</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="例: Tempo Forest"
              />
            </label>
            <label>
              <span>クラス/タイプ</span>
              <input
                value={form.archetype}
                onChange={(event) => setForm((current) => ({ ...current, archetype: event.target.value }))}
                placeholder="例: Forestcraft"
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
              <Link className="button secondary" to="/decks">
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
