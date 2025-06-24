# FiveChoiceQuizzer

5択問題演習アプリケーション。Google認証でログインし、解答履歴をSupabaseに保存します。

## 機能

- 5択形式の問題演習
- 即時判定と解説表示
- ブックマーク機能（ローカル保存）
- 問題のフィルタリング（全問題/ブックマーク済み）
- 進捗管理とプログレスバー
- Google OAuth認証
- 解答履歴の永続保存

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. プロジェクトのURLとanon keyを取得

### 3. Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com)でプロジェクトを作成
2. OAuth 2.0クライアントIDを作成
3. 承認済みのリダイレクトURIに以下を追加：
   - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

### 4. 環境変数の設定

`.env`ファイルを作成し、以下の内容を設定：

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. データベースのセットアップ

Supabaseダッシュボードで以下のSQLを実行：

```sql
-- answer_logsテーブルの作成
CREATE TABLE IF NOT EXISTS public.answer_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  chosen_index SMALLINT NOT NULL CHECK (chosen_index >= 0 AND chosen_index <= 4),
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_answer_logs_user_id ON public.answer_logs(user_id);
CREATE INDEX idx_answer_logs_question_id ON public.answer_logs(question_id);
CREATE INDEX idx_answer_logs_answered_at ON public.answer_logs(answered_at);

-- RLSの有効化
ALTER TABLE public.answer_logs ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Users can view own answer logs" ON public.answer_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answer logs" ON public.answer_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 6. Edge Functionのデプロイ

```bash
supabase functions deploy log-answer
```

## 開発サーバーの起動

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## 技術スタック

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand（状態管理）
- Supabase（認証・データベース）