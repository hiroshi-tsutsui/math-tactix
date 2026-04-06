# Math Tactix TODO
現在のサイクル: 011
最終更新: 2026-04-06

---

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

## サイクル009 実施済み

- [x] [優先度:高] trig: 測量問題（仰角・俯角）Level 12 追加 — SurveyingViz.tsx
- [x] [優先度:高] trig: 外接円・内接円の半径 Level 13 追加 — CircleRadiusViz.tsx
- [x] [優先度:高] probability: 条件付き確率（詳細）Level 15 追加 — ConditionalProbabilityViz.tsx
- [x] [優先度:高] math_i_numbers: 二重根号の変形 Level 44 追加 — NestedRadicalViz.tsx

## サイクル008 実施済み

- [x] [優先度:高] trig page.tsx のリファクタリング（components/ への分離: TrigCanvas, TrigOverlay, TrigExplanation, TrigQuiz, TrigIdentityPractice, MathComponent）
- [x] [優先度:中] locales: quadratics モジュールのキー差分解消 (en.json/ja.json) — Level 4-14 + tactics キー補完
- [x] [優先度:中] locales: math_i_numbers モジュールのキー差分解消 — 差分なし確認済み
- [x] [優先度:中] quadratics Level 58-67 の難易度確認 — 段階的で問題なし、Level 67 のレベル配列欠落を修正

## 優先度: 高（数学コンテンツ追加）

- [x] [優先度:高] [担当:エンジニアA] trig: 三角比の応用（測量問題・木の高さを三角比で求める）Level 12 追加
- [x] [優先度:高] [担当:エンジニアA] trig: 三角形の外接円・内接円の半径 Level 13 追加
- [x] [優先度:高] [担当:エンジニアA] probability: 条件付き確率 Level 15 追加
- [x] [優先度:高] [担当:エンジニアA] probability: 反復試行・二項定理の基礎 Level 16 追加
- [x] [優先度:高] [担当:エンジニアA] math_i_numbers: 二重根号・根号の整理 Level 44 追加
- [x] [優先度:高] [担当:エンジニアA] math_i_numbers: 絶対値記号の計算（場合分け）Level 45 追加
- [x] [優先度:高] [担当:エンジニアA] sets_logic: ド・モルガンの法則の発展 Level 14 追加
- [x] [優先度:高] [担当:エンジニアA] data: 標準偏差・分散の視覚化 Level 14 追加
- [x] [優先度:高] [担当:エンジニアA] data: 回帰直線のあてはまり具合（残差）Level 15 追加
- [x] [優先度:高] [担当:エンジニアA] quadratics: 解の配置（両解が正・負・区間内）の受験頻出パターン追加

## 優先度: 中（品質改善・整合性）

- [x] [優先度:中] [担当:エンジニアB] 共通KaTeXコンポーネントを app/lib/components/MathDisplay.tsx として抽出し全モジュールで統一
- [ ] [優先度:中] [担当:エンジニアA] 全モジュールの「戻る」ボタンの挙動を統一化
- [x] [優先度:中] [担当:エンジニアB] locales: sets_logic モジュールのキー差分解消（差分なし確認済み）
- [x] [優先度:中] [担当:エンジニアB] locales: trig モジュールのキー差分解消
- [ ] [優先度:中] [担当:生徒A] NARRATIVE.md: 高1生向けにシンプルな説明に改善
- [ ] [優先度:中] [担当:教師A] 各モジュールのレベル進行の一貫性確認（難易度が単調増加しているか）
- [ ] [優先度:中] [担当:教師B] 受験頻出問題に対応する Viz コンポーネントが不足しているモジュールを特定し追加計画を立てる
- [ ] [優先度:中] [担当:教師A] sets_logic の Level 1-11 の説明文が数学的に正確か再チェック
- [ ] [優先度:中] [担当:エンジニアA] trig/functions モジュールの内容重複を整理
- [ ] [優先度:中] [担当:生徒A] overview の LOCKED モジュール説明文を中学生でもわかる表現に修正

## 優先度: 低（改善・拡張）

- [ ] [優先度:低] [担当:エンジニアA] logs/ ディレクトリの JSON ログファイルの整理・アーカイブ方針を策定する
- [ ] [優先度:低] [担当:教師A] math_i_numbers に残りレベル（分数式・有理化以降）を追加する計画を立てる
- [ ] [優先度:低] [担当:エンジニアB] locales/en.json と locales/ja.json の全モジュール横断キー差分チェック
- [ ] [優先度:低] [担当:生徒A] overview ページのモジュール一覧で LOCKED モジュールの説明文がわかりやすいか確認
- [ ] [優先度:低] [担当:エンジニアA] quadratics モジュールの Viz コンポーネントのリファクタリング（巨大ファイル分割）
- [ ] [優先度:低] [担当:エンジニアA] sets_logic モジュールの page.tsx 内 inline Viz を components/ に分離
- [ ] [優先度:低] [担当:エンジニアB] probability モジュールの page.tsx が大きくなってきたため components/ 分離を検討
- [ ] [優先度:低] [担当:エンジニアA] data モジュールの新レベル（Level 14-15）用の components/ 準備
- [ ] [優先度:低] [担当:教師B] 全モジュールの問題難易度テーブルを作成し、学習順序の推奨パスを設計
- [ ] [優先度:低] [担当:エンジニアB] ビルドパフォーマンスの改善（動的インポートの導入検討）
