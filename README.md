# emotra-frontend-breezenext
- メンタルヘルスのための感情トラッキングアプリケーション
- 日記のように感情を記録し、振り返ることができる
- Next.jsによるフロントエンドWebアプリケーション
  - [Laravel Breeze - Next.js エディション](https://github.com/laravel/breeze-next)をクローンして実装

## 初期設定手順
- https://github.com/laravel/breeze-next をクローン
- `yarn install`
- `.env.local`を作成し、`NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`を追加
- `npm run dev`で起動。`http://localhost:3000`でアクセス、ユーザー登録、ログイン、ダッシュボード表示が可能。

## typescript化手順
- typescriptをインストール `npm install --save-dev typescript @types/react @types/node`
- ファイル追加 `touch tsconfig.json`
- 一度`npm run dev`で`tsconfig.json`にNextが自動で記述生成
- エラーが出るので、`tsconfig.json`に`baseUrl`と`paths`を追加
