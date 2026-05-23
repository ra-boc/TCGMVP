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
                  <th>コード / ポータル</th>
                  <th>カードリスト</th>
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
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                        {deck.deck_code ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="pill" style={{ background: 'var(--surface-muted)', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'monospace', fontWeight: 'bold', minWidth: 'auto' }}>
                              {deck.deck_code}
                            </span>
                            <button
                              type="button"
                              className="button compact secondary"
                              style={{ minHeight: '24px', height: '24px', padding: '0 6px', fontSize: '11px' }}
                              onClick={() => {
                                navigator.clipboard.writeText(deck.deck_code || '')
                                alert('デッキコードをコピーしました！')
                              }}
                            >
                              コピー
                            </button>
                          </div>
                        ) : null}
                        {deck.deck_url ? (
                          <a
                            href={deck.deck_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                          >
                            🔗 ポータルを開く
                          </a>
                        ) : (
                          !deck.deck_code && '-'
                        )}
                      </div>
                    </td>
                    <td>
                      {deck.deck_list ? (
                        <details style={{ fontSize: '13px', cursor: 'pointer' }}>
                          <summary style={{ color: 'var(--primary)', fontWeight: '600' }}>カードを表示 ({deck.deck_list.split('\n').filter(Boolean).length}件)</summary>
                          <pre style={{
                            marginTop: '8px',
                            padding: '8px',
                            background: 'var(--surface-muted)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            maxHeight: '120px',
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            textAlign: 'left',
                            cursor: 'default'
                          }} onClick={(e) => e.stopPropagation()}>
                            {deck.deck_list}
                          </pre>
                        </details>
                      ) : (
                        '-'
                      )}
                    </td>
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
