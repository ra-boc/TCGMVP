import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, type DeckInput } from '../api/client'

const initialForm: DeckInput = {
  name: '',
  archetype: '',
  deck_code: '',
  deck_url: '',
  deck_list: '',
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
      .then((deck) =>
        setForm({
          name: deck.name,
          archetype: deck.archetype,
          deck_code: deck.deck_code ?? '',
          deck_url: deck.deck_url ?? '',
          deck_list: deck.deck_list ?? '',
          notes: deck.notes ?? '',
        })
      )
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
            <div className="form-grid">
              <label>
                <span>デッキコード</span>
                <input
                  value={form.deck_code}
                  onChange={(event) => setForm((current) => ({ ...current, deck_code: event.target.value }))}
                  placeholder="例: a1b2"
                />
              </label>
              <label>
                <span>デッキポータルURL</span>
                <input
                  type="url"
                  value={form.deck_url}
                  onChange={(event) => setForm((current) => ({ ...current, deck_url: event.target.value }))}
                  placeholder="例: https://shadowverse-wb.com/ja/deck/?format_1..."
                />
              </label>
            </div>
            <label>
              <span>カードリスト / デッキの中身</span>
              <textarea
                value={form.deck_list}
                onChange={(event) => setForm((current) => ({ ...current, deck_list: event.target.value }))}
                placeholder="登録したいカード名や枚数、詳細などを入力してください。"
                rows={6}
              />
            </label>
            <label>
              <span>メモ</span>
              <textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                rows={3}
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
