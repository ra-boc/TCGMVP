import { useEffect, useState } from 'react'
import { api, type RateSummary, type StatsSummary } from '../api/client'

export function AnalysisPage() {
  const [stats, setStats] = useState<StatsSummary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getStats().then(setStats).catch((err: Error) => setError(err.message))
  }, [])

  if (error) {
    return (
      <section className="page-stack">
        <div className="panel message-panel">
          <h1>分析を読み込めませんでした</h1>
          <p>{error}</p>
        </div>
      </section>
    )
  }

  if (!stats) {
    return (
      <section className="page-stack">
        <div className="panel message-panel">
          <h1>読み込み中</h1>
          <p>集計データを取得しています。</p>
        </div>
      </section>
    )
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Analysis</p>
          <h1>分析</h1>
        </div>
      </header>

      <div className="stats-grid">
        <Metric label="対戦数" value={`${stats.overall.total}`} />
        <Metric label="勝ち" value={`${stats.overall.wins}`} />
        <Metric label="負け" value={`${stats.overall.losses}`} />
        <Metric label="勝率" value={`${stats.overall.win_rate}%`} />
      </div>

      <StatsTable title="デッキ別勝率" rows={stats.by_deck} emptyMessage="登録済みデッキがありません。" />
      <StatsTable title="相手デッキ別勝率" rows={stats.by_opponent_deck} emptyMessage="対戦記録がありません。" />
      <StatsTable
        title="先攻/後攻別勝率"
        rows={stats.by_turn_order.map((row) => ({
          ...row,
          label: row.label === 'first' ? '先攻' : row.label === 'second' ? '後攻' : row.label,
        }))}
        emptyMessage="対戦記録がありません。"
      />
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

function StatsTable({ title, rows, emptyMessage }: { title: string; rows: RateSummary[]; emptyMessage: string }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="muted">{emptyMessage}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>項目</th>
                <th>対戦数</th>
                <th>勝ち</th>
                <th>負け</th>
                <th>勝率</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${title}-${row.label}-${row.deck_id ?? ''}`}>
                  <td>
                    <strong>{row.label}</strong>
                    {row.archetype ? <span className="subtle"> {row.archetype}</span> : null}
                  </td>
                  <td>{row.total}</td>
                  <td>{row.wins}</td>
                  <td>{row.losses}</td>
                  <td>
                    <div className="rate-cell">
                      <span>{row.win_rate}%</span>
                      <div className="rate-track" aria-hidden="true">
                        <div className="rate-bar" style={{ width: `${row.win_rate}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
