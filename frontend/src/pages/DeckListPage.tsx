import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Deck } from '../api/client'

export function DeckListPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listDecks()
      .then(setDecks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (deck: Deck) => {
    if (!window.confirm(`${deck.name} を削除しますか？関連する対戦記録も削除されます。`)) return

    await api.deleteDeck(deck.id)
    setDecks((current) => current.filter((item) => item.id !== deck.id))
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Decks</p>
          <h1>デッキ一覧</h1>
        </div>
        <Link className="button primary" to="/decks/new">
          新規デッキ
        </Link>
      </header>

      <section className="panel">
        {loading ? (
          <p className="muted">読み込み中です。</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : decks.length === 0 ? (
          <div className="empty-state">
            <p>登録済みデッキがありません。</p>
            <Link className="button primary" to="/decks/new">
              デッキを登録
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>名前</th>
                  <th>クラス/タイプ</th>
                  <th>メモ</th>
                  <th className="actions-cell">操作</th>
                </tr>
              </thead>
              <tbody>
                {decks.map((deck) => (
                  <tr key={deck.id}>
                    <td>
                      <strong>{deck.name}</strong>
                    </td>
                    <td>{deck.archetype || '-'}</td>
                    <td>{deck.notes || '-'}</td>
                    <td className="actions-cell">
                      <Link className="button compact secondary" to={`/decks/${deck.id}/edit`}>
                        編集
                      </Link>
                      <button className="button compact danger" type="button" onClick={() => handleDelete(deck)}>
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}
