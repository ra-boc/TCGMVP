import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type Deck, type MatchRecord, type StatsSummary } from '../api/client'
import { formatDateTime, resultLabel, turnOrderLabel } from '../utils'

type DashboardData = {
  decks: Deck[]
  matches: MatchRecord[]
  stats: StatsSummary
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.listDecks(), api.listMatches(), api.getStats()])
      .then(([decks, matches, stats]) => setData({ decks, matches, stats }))
      .catch((err: Error) => setError(err.message))
  }, [])

  if (error) return <PageMessage title="読み込みに失敗しました" message={error} />
  if (!data) return <PageMessage title="読み込み中" message="データを取得しています。" />

  const recentMatches = data.matches.slice(0, 5)

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>ダッシュボード</h1>
        </div>
        <div className="header-actions">
          <Link className="button secondary" to="/decks/new">
            デッキ登録
          </Link>
          <Link className="button primary" to="/matches/new">
            対戦を記録
          </Link>
        </div>
      </header>

      <div className="stats-grid">
        <Metric label="登録デッキ" value={`${data.decks.length}`} />
        <Metric label="対戦数" value={`${data.stats.overall.total}`} />
        <Metric label="勝利" value={`${data.stats.overall.wins}`} />
        <Metric label="全体勝率" value={`${data.stats.overall.win_rate}%`} />
      </div>

      <section className="panel">
        <div className="section-heading">
          <h2>最近の対戦</h2>
          <Link to="/matches">すべて見る</Link>
        </div>
        {recentMatches.length === 0 ? (
          <EmptyState message="まだ対戦記録がありません。" actionLabel="最初の対戦を記録" to="/matches/new" />
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
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((match) => (
                  <tr key={match.id}>
                    <td>{formatDateTime(match.played_at)}</td>
                    <td>{match.deck.name}</td>
                    <td>{match.opponent_deck}</td>
                    <td>
                      <span className={`pill ${match.result}`}>{resultLabel(match.result)}</span>
                    </td>
                    <td>{turnOrderLabel(match.turn_order)}</td>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function PageMessage({ title, message }: { title: string; message: string }) {
  return (
    <section className="page-stack">
      <div className="panel message-panel">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </section>
  )
}

function EmptyState({ message, actionLabel, to }: { message: string; actionLabel: string; to: string }) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      <Link className="button primary" to={to}>
        {actionLabel}
      </Link>
    </div>
  )
}
