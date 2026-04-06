# Math Tactix TODO
現在のサイクル: 014
最終更新: 2026-04-06

---

## サイクル014 実施済み

- [x] [優先度:高] math_i_numbers: 整数の性質（素因数分解・GCD・LCM）Level 46 追加 — PrimeFactorizationViz.tsx
- [x] [優先度:高] sets_logic: 背理法・対偶証明の練習 Level 15 追加 — ProofMethodViz.tsx
- [x] [優先度:高] data: 決定係数 R² の視覚化 Level 16 追加 — RSquaredViz.tsx
- [x] [優先度:中] quadratics page.tsx リファクタリング — レベル定義を data/levels.ts に外部化

## サイクル013 実施済み

- [x] [優先度:高] trig: 正弦定理の活用（三角形の辺・角計算問題）Level 14 追加 — SineLawApplicationViz.tsx
- [x] [優先度:高] trig: 三角比を含む方程式（sinθ=k の解 etc.）Level 15 追加 — TrigEquationViz.tsx
- [x] [優先度:高] quadratics: 文字係数の二次方程式の解の配置 Level 69 追加 — ParametricRootsViz.tsx
- [x] [優先度:高] quadratics: 二次関数と直線の位置関係 Level 70 追加 — ParabolaLineViz.tsx

## サイクル012 実施済み

- [x] [優先度:中] BackButton 共通コンポーネント作成・全モジュールに適用（app/components/BackButton.tsx）
- [x] [優先度:中] overview の LOCKED モジュール説明文を具体的な内容に改善（locales/ja.json, en.json）
- [x] [優先度:中] manual/page.tsx に「使い方ガイド」セクション追加（高1生向け）
- [x] [優先度:中] sets_logic Level 1-11 の数学的正確性チェック — 全問題・数式正確、修正なし
- [x] [優先度:中] TODO.md を30件に刷新

## サイクル011 実施済み

- [x] [優先度:高] data: 回帰直線の残差 Level 15 追加 — ResidualViz.tsx
- [x] [優先度:高] quadratics: 解の配置（受験頻出パターン）Level 68 追加 — RootsPlacementViz.tsx
- [x] [優先度:中] 共通KaTeXコンポーネント app/lib/components/MathDisplay.tsx 抽出
- [x] [優先度:中] locales: trig モジュールのキー差分解消 (modules.trig, trig_ratios)

## サイクル010 実施済み

- [x] [優先度:高] data: 標準偏差・分散の視覚化 Level 14 追加 — StandardDeviationViz.tsx
- [x] [優先度:高] sets_logic: ド・モルガンの法則の発展 Level 14 追加 — DeMorganViz.tsx
- [x] [優先度:高] math_i_numbers: 絶対値の場合分け計算 Level 45 追加 — AbsoluteValueCasesViz.tsx
- [x] [優先度:高] probability: 反復試行の定理 Level 16 追加 — BinomialTrialViz.tsx

## 優先度: 高（数学コンテンツ追加）

- [x] [優先度:高] trig: 正弦定理の活用（三角形の辺・角計算問題）Level 14 追加 → サイクル013
- [x] [優先度:高] trig: 三角比を含む方程式（sinθ=1/2 の解 etc.）Level 15 追加 → サイクル013
- [x] [優先度:高] quadratics: 文字係数の二次方程式の解の配置 Level 69 追加 → サイクル013
- [x] [優先度:高] quadratics: 二次関数のグラフと直線の位置関係 Level 70 追加 → サイクル013
- [x] [優先度:高] math_i_numbers: 整数の性質（素因数分解・最大公約数）Level 46 追加 → サイクル014
- [x] [優先度:高] sets_logic: 背理法・対偶証明の練習 Level 15 追加 → サイクル014
- [x] [優先度:高] data: 決定係数 R² の視覚化（回帰の精度）Level 16 追加 → サイクル014
- [ ] [優先度:高] probability: ベイズの定理の基礎 Level 17 追加

## 優先度: 中（品質改善・リファクタリング）

- [x] [優先度:中] quadratics page.tsx（Level 70まで追加で巨大化）のリファクタリング — レベル定義を外部ファイルに分離 → サイクル014
- [ ] [優先度:中] probability page.tsx の components/ 分離 — Viz コンポーネントを個別ファイルに
- [ ] [優先度:中] 共通 MathDisplay を data・quadratics モジュールにも適用（現在は個別の KaTeX 呼び出し）
- [ ] [優先度:中] locales 全横断キー差分の最終チェック（en.json / ja.json の全モジュール網羅）
- [ ] [優先度:中] 各モジュールのレベル進行の一貫性確認（難易度が単調増加しているか）
- [ ] [優先度:中] 受験頻出問題に対応する Viz コンポーネントが不足しているモジュールを特定し追加計画を立てる
- [ ] [優先度:中] trig/functions モジュールの内容重複を整理（三角関数の扱いが複数箇所に分散）
- [ ] [優先度:中] 全モジュールに「解説動画リンク」プレースホルダーの追加検討
- [ ] [優先度:中] sets_logic page.tsx 内 inline Viz を components/ に分離（NecessarySufficientViz, ContrapositiveViz 等）

## 優先度: 低（改善・拡張）

- [ ] [優先度:低] logs/ ディレクトリの JSON ログファイルの整理・アーカイブ方針を策定する
- [ ] [優先度:低] math_i_numbers に残りレベル（分数式・有理化以降）を追加する計画を立てる
- [ ] [優先度:低] quadratics モジュールの Viz コンポーネントのリファクタリング（巨大ファイル分割）
- [ ] [優先度:低] data モジュールの新レベル（Level 16+）用の components/ 準備
- [ ] [優先度:低] 全モジュールの問題難易度テーブルを作成し、学習順序の推奨パスを設計
- [ ] [優先度:低] ビルドパフォーマンスの改善（動的インポートの導入検討）
- [ ] [優先度:低] NARRATIVE.md を他モジュール（data, probability, sets_logic）にも展開
- [ ] [優先度:低] sets_logic Level 12 以降の問題バリエーション増加（条件命題のパターン追加）
- [ ] [優先度:低] trig_ratios と trig の統合可能性の検討（ユーザー導線の最適化）
- [ ] [優先度:低] math_i_numbers の sets_logic 連携（集合と不等式のクロスリファレンス）
- [ ] [優先度:低] profile ページに学習履歴グラフ（週次レベルクリア数の可視化）を追加
- [ ] [優先度:低] quiz モジュールに各モジュールからのランダム出題機能を追加
- [ ] [優先度:低] モバイルレスポンシブの最終確認（特に canvas 系 Viz コンポーネント）
