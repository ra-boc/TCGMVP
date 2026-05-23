# Shadow Log MVP

シャドウバースの戦績管理ツールです。バックエンドは Rails API、フロントエンドは React + TypeScript + Vite で構成しています。

## 構成

- `backend/`: Rails API
- `frontend/`: React + TypeScript + Vite

## 主な機能

- デッキ登録・編集・削除
- 対戦記録の登録・編集・削除
- 対戦履歴一覧
- デッキ別勝率の集計
- 相手デッキ別勝率の集計
- 先攻/後攻別勝率の集計

## API

- `GET /api/decks`
- `POST /api/decks`
- `GET /api/decks/:id`
- `PATCH /api/decks/:id`
- `DELETE /api/decks/:id`
- `GET /api/matches`
- `POST /api/matches`
- `GET /api/matches/:id`
- `PATCH /api/matches/:id`
- `DELETE /api/matches/:id`
- `GET /api/stats/summary`

## セットアップ

### Backend

```powershell
cd backend
bundle install
cmd /c "chcp 65001>nul & bundle exec rails db:setup"
cmd /c "chcp 65001>nul & bundle exec rails server -p 3000"
```

日本語を含むパス上では、Railsコマンドが文字化けすることがあります。その場合は上記のように `cmd /c "chcp 65001>nul & ..."` 経由で実行してください。

### Frontend

別ターミナルで起動します。

```powershell
cd frontend
npm install
npm run dev
```

フロントエンドはデフォルトで `http://localhost:3000/api` に接続します。変更する場合は `VITE_API_BASE_URL` を指定してください。

## 確認手順

1. Backend を `http://localhost:3000` で起動します。
2. Frontend を `http://localhost:5173` で起動します。
3. ブラウザで `http://localhost:5173` を開きます。
4. デッキを登録します。
5. 登録したデッキで対戦記録を作成します。
6. ダッシュボード、対戦記録一覧、分析画面に勝率が反映されることを確認します。

## テスト

Backend:

```powershell
cd backend
cmd /c "chcp 65001>nul & bundle exec rails test"
```

Frontend:

```powershell
cd frontend
npm run build
```
