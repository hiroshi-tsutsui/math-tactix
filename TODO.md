# Math Tactix TODO
現在のサイクル: 002
最終更新: 2026-04-06

---

## 優先度: 高（ファイル構造・型安全）

- [x] [優先度:高] [担当:エンジニアA] ルートに散乱している add_*.js, fix_*.js, update_*.js, append_*.js, patch_*.js, inject_*.js 等のスクリプト（100本以上）を `scripts/` ディレクトリに移動整理する
- [x] [優先度:高] [担当:エンジニアB] `app/settings/page.tsx` の `// @ts-nocheck` を除去し、TypeScript型を正確に付与する
- [x] [優先度:高] [担当:エンジニアB] `app/overview/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:高] [担当:エンジニアB] `app/logs/page.tsx` の `// @ts-nocheck` を除去する（ctx null チェック追加）
- [x] [優先度:高] [担当:エンジニアB] `app/profile/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:高] [担当:エンジニアB] `app/manual/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:高] [担当:エンジニアA] バックアップファイル（*.bak, *.orig）を削除: `app/trig_ratios/page.tsx.bak`, `app/vectors/page.tsx.bak`, `app/quadratics/page.tsx.bak`, `app/math_i_numbers/page.tsx.orig`
- [x] [優先度:高] [担当:エンジニアA] ルートの一時ファイル（snippet.txt, src_update.txt, tmp_tail.txt, ui_snippet.txt, TRIGGER.txt, fix.patch, get_render.js 等）を削除または整理する
- [x] [優先度:高] [担当:エンジニアB] `app/page.tsx` の `// @ts-nocheck` を除去する（メインダッシュボード）
- [x] [優先度:高] [担当:エンジニアB] `app/data/page.tsx` の `// @ts-nocheck` を除去する

## 優先度: 中（コード品質・アーキテクチャ）

- [x] [優先度:中] [担当:エンジニアB] `app/complex/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/codex/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/quiz/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/vectors/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/sequences/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/functions/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/calculus/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/matrices/page.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアB] `app/components/BallsInBins.tsx` の `// @ts-nocheck` を除去する
- [x] [優先度:中] [担当:エンジニアA] `components/` ルートに置かれている Viz コンポーネント（AbsoluteInequalityAllRealsViz.tsx 等）を対応モジュールの `app/*/components/` に移動し、インポートパスを修正する

## 優先度: 中（数学コンテンツ充実）

- [ ] [優先度:中] [担当:教師A] `app/trig/page.tsx` の三角関数レベルを確認し、学習指導要領に沿った順序になっているか検証する
- [ ] [優先度:中] [担当:教師B] `app/sets_logic/page.tsx` の集合・論理レベルに典型問題パターンが網羅されているか確認する
- [ ] [優先度:中] [担当:教師A] `app/probability/page.tsx` の確率レベルに場合の数との連携が適切か確認する
- [ ] [優先度:中] [担当:生徒A] 各モジュールの NARRATIVE.md を確認し、世界観の説明が高1生にとって理解しやすいか評価する
- [ ] [優先度:中] [担当:生徒B] `app/quadratics/page.tsx` のレベル進行（Level 60台）で難易度ジャンプが急すぎる箇所がないか確認する

## 優先度: 低（改善・拡張）

- [ ] [優先度:低] [担当:エンジニアA] `logs/` ディレクトリの JSON ログファイルの整理・アーカイブ方針を策定する
- [x] [優先度:低] [担当:エンジニアA] `CLAUDE.md` の技術スタック記載を「Next.js 15」から実際の `package.json` に合わせた「Next.js 16」に修正する
- [ ] [優先度:低] [担当:教師A] `app/math_i_numbers/` に数と式の残りレベル（整式の除法・分数式・有理化）を追加する計画を立てる
- [ ] [優先度:低] [担当:エンジニアB] `locales/en.json` と `locales/ja.json` のキーに差分がないか確認し、欠けているキーを補完する
- [ ] [優先度:低] [担当:生徒A] `app/overview/page.tsx` のモジュール一覧表示で、LOCKED モジュールの説明文が中学生でもわかるか確認する
- [ ] [優先度:低] [担当:教師B] 受験頻出問題に対応する Viz コンポーネントが不足しているモジュールを特定し、追加計画を立てる
