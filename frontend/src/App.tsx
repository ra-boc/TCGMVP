import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AnalysisPage } from './pages/AnalysisPage'
import { DashboardPage } from './pages/DashboardPage'
import { DeckFormPage } from './pages/DeckFormPage'
import { DeckListPage } from './pages/DeckListPage'
import { MatchFormPage } from './pages/MatchFormPage'
import { MatchListPage } from './pages/MatchListPage'

const navItems = [
  { to: '/', label: 'ダッシュボード' },
  { to: '/decks', label: 'デッキ' },
  { to: '/matches', label: '対戦記録' },
  { to: '/analysis', label: '分析' },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SV</span>
          <div>
            <strong>Shadow Log</strong>
            <span>戦績管理MVP</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="メインナビゲーション">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/decks" element={<DeckListPage />} />
          <Route path="/decks/new" element={<DeckFormPage />} />
          <Route path="/decks/:id/edit" element={<DeckFormPage />} />
          <Route path="/matches" element={<MatchListPage />} />
          <Route path="/matches/new" element={<MatchFormPage />} />
          <Route path="/matches/:id/edit" element={<MatchFormPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
