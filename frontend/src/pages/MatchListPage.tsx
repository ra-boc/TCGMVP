import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type MatchRecord } from '../api/client'
import { formatDateTime, resultLabel, turnOrderLabel } from '../utils'

export function MatchListPage() {
  const [matches, setMatches] = useState<MatchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listMatches()
      .then(setMatches)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (match: MatchRecord) => {
    if (!window.confirm(`${formatDateTime(match.played_at)} の対戦記録を削除しますか？`)) return

    await api.deleteMatch(match.id)
    setMatches((current) => current.filter((item) => item.id !== match.id))
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Matches</p>
          <h1>対戦記録一覧</h1>
        </div>
        <Link className="button primary" to="/matches/new">
          新規記録
        </Link>
      </header>

      <section className="panel">
        {loading ? (
          <p className="muted">読み込み中です。</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <p>対戦記録がありません。</p>
            <Link className="button primary" to="/matches/new">
              対戦を記録
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>日時</th>
                  <th>使用デッキ</th>
                  <th>相手デッキ</th>
                  <th>結果</th>
                  <th>先後</th>
                  <th>メモ</th>
                  <th className="actions-cell">操作</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td>{formatDateTime(match.played_at)}</td>
                    <td>{match.deck.name}</td>
                    <td>{match.opponent_deck}</td>
                    <td>
                      <span className={`pill ${match.result}`}>{resultLabel(match.result)}</span>
                    </td>
                    <td>{turnOrderLabel(match.turn_order)}</td>
                    <td>{match.notes || '-'}</td>
                    <td className="actions-cell">
                      <Link className="button compact secondary" to={`/matches/${match.id}/edit`}>
                        編集
                      </Link>
                      <button className="button compact danger" type="button" onClick={() => handleDelete(match)}>
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
