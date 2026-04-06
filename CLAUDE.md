# CLAUDE.md — math-tactix

## プロジェクト概要

中高数学の概念をインタラクティブに視覚化する学習プラットフォーム。
日本の高校数学カリキュラム（数I〜数III）を対象に、動的グラフ・3Dビジュアライゼーションで「直感を先に、厳密さを後に」届ける。

ゲーミフィケーション要素（Rank / XP / Omega Protocol）を持ち、学習者が「Singularity Containment Engineer」などのロール世界観の中で問題を解く設計になっている。

## 技術スタック

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D / Visualization:** React Three Fiber (R3F), Drei, Three.js
- **Math rendering:** KaTeX / react-katex
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Math engine:** mathjs

## ディレクトリ構成

```
app/
  page.tsx               # ダッシュボード（モジュール一覧）
  layout.tsx             # グローバルレイアウト（Context Provider群）
  quadratics/            # 二次関数モジュール（最も充実）
    page.tsx             # レベル一覧・問題表示
    components/          # モジュール専用 Viz コンポーネント
    utils/               # 問題生成ロジック（*-generator.ts）
    NARRATIVE.md         # 世界観設定
  math_i_numbers/        # 数と式モジュール
  trig/ calculus/ ...    # その他モジュール
  contexts/              # ProgressContext, LanguageContext, GamificationContext, ThemeContext
  components/            # アプリ全体共通コンポーネント

components/              # モジュール横断で使う Viz コンポーネント
  math_i/
  math_i_numbers/
  sets_logic/
  AbsoluteInequalityAllRealsViz.tsx など

locales/                 # i18n（日本語・英語対応）
```

## 実装パターン

### Viz コンポーネント
- 各レベルに対応する `*Viz.tsx` コンポーネントを作成する
- Props で問題データ（係数・条件など）を受け取り、インタラクティブなグラフを描画する
- `"use client"` 必須
- KaTeX で数式を表示する場合は `react-katex` を使う
- R3F を使う場合は `<Canvas>` ラッパーが必要

### 問題生成ロジック
- `utils/*-generator.ts` に問題生成関数を実装する
- `generate***Problem()` という命名規則
- ランダム係数を生成し、問題文・正解・解説データを返す

### モジュールページ（page.tsx）
- レベル定義配列（`levels`）にレベル番号・タイトル・Viz コンポーネント・generator を登録する
- レベル選択 UI → 問題生成 → Viz 表示 → 解答チェック のフロー

## 開発ルール

- **関数コンポーネント + hooks** のみ使用。クラスコンポーネント不可
- **`// @ts-nocheck`** は既存ファイルにあるが、新規コードでは使わない
- 数式は必ず KaTeX でレンダリングする（プレーンテキスト禁止）
- ビジュアライゼーションの変更は数学的に正確であること
- コンポーネント追加後は `app/quadratics/page.tsx`（または対象モジュールの `page.tsx`）の import とレベル定義に登録する

## 開発サーバー

```bash
npm run dev    # 開発サーバー起動（localhost:3000）
npm run build  # ビルド確認
```

## 現在の状況（2026-04-06時点）

- 数学I 二次関数モジュールが最も実装済み（Level 60台まで）
- `math_i_numbers`（数と式）モジュールも実装中
- 三角関数・確率・微積分なども READY 状態
- 中学数学モジュールは LOCKED（未実装）
