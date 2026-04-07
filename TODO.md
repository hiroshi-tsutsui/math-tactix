# Math Tactix TODO
現在のサイクル: 036
最終更新: 2026-04-07

---

## サイクル035 実施済み

- [x] [優先度:高] quiz モジュールに6カテゴリ（数列・対数・微積分・ベクトル・複素数・行列）各5問、計30問を crossModuleQuestions に追加（22問→52問）
- [x] [優先度:高] functions モジュール大幅拡充: 既存5レベル（Black Box） + 10レベル（Explore: 1次関数・分数関数・無理関数・絶対値関数・グラフ変換・偶奇関数・合成関数・逆関数・定義域値域・関数クイズ）
- [x] [優先度:高] functions/components/ に10個の Viz コンポーネント新規作成（LinearFunctionViz, RationalFunctionViz, RadicalFunctionViz, AbsoluteValueFunctionViz, FunctionTransformViz, FunctionSymmetryViz, CompositeFunctionViz, InverseFunctionViz, DomainRangeViz, FunctionQuizViz）
- [x] [優先度:高] functions/utils/functions-generator.ts 新規作成（linear, rational, composite, inverse, domain の各 generator）
- [x] [優先度:中] functions/page.tsx にタブ切替UI（Black Box / Explore）を追加

## サイクル034 実施済み

- [x] [優先度:高] matrices モジュール大幅拡充: 既存3レベル → 12レベル（行列基本・加減算・スカラー倍・積・行列式・行列式幾何・逆行列・単位行列/零行列・線形変換・回転行列・連立方程式・総合クイズ）
- [x] [優先度:高] matrices/utils/matrices-generator.ts 新規作成（加法・減法・スカラー倍・積・行列式・逆行列・連立方程式の各 generator）
- [x] [優先度:高] matrices/page.tsx を next/dynamic + レベル選択UI に全面リファクタリング
- [x] [優先度:高] matrices/components/ に12個の Viz コンポーネント新規作成
- [x] [優先度:高] matrices/data/levels.ts 新規作成

## サイクル033 実施済み

- [x] [優先度:高] complex モジュール大幅拡充: 既存3レベル → 12レベル（複素平面・加減乗除・共役・絶対値偏角・極形式・ド・モアブル・方程式・二次複素根・軌跡・総合クイズ）
- [x] [優先度:高] complex/utils/complex-generator.ts 新規作成（加法・減法・乗法・除法・共役・絶対値・偏角・極形式・べき乗の各 generator）
- [x] [優先度:高] complex/page.tsx を next/dynamic + レベル選択UI に全面リファクタリング
- [x] [優先度:高] complex/components/ に12個の Viz コンポーネント新規作成

## サイクル032 実施済み

- [x] [優先度:高] sequences/logs に generator 統合クイズ Viz を追加（SequencesQuizViz, LogsQuizViz）— ランダム問題出題・正誤判定・解説表示・正答率トラッキング
- [x] [優先度:高] vectors モジュール大幅拡充: 既存2レベル → 11レベル（ベクトル基本・成分表示・和と差・スカラー倍・大きさ・内積・角度・垂直条件・単位ベクトル・位置ベクトルと内分点・総合クイズ）
- [x] [優先度:高] vectors/utils/vectors-generator.ts 新規作成（成分・和・大きさ・内積・角度・垂直条件・スカラー倍の各 generator）
- [x] [優先度:高] vectors/page.tsx を next/dynamic + レベル選択UI に全面リファクタリング

## サイクル031 実施済み

- [x] [優先度:高] calculus モジュール大幅拡充: 既存3レベル → 13レベル（微分定義・べき乗則・接線・導関数グラフ・増減表・極大極小・グラフ概形・リーマン和・不定積分・定積分・2曲線間面積・接線応用・増減極値総合）
- [x] [優先度:高] calculus page.tsx を next/dynamic + レベル選択UI に全面リファクタリング
- [x] [優先度:高] calculus/utils/calculus-generator.ts 新規作成（べき乗微分・多項式微分・接線・増減・極値・不定積分・定積分・面積の各 generator）
- [x] [優先度:中] sequences に problem generator 追加（等差一般項・等差和・等比一般項・等比和・シグマ・漸化式・無限級数）
- [x] [優先度:中] logs に problem generator 追加（定義・性質・方程式・応用方程式・底変換・不等式・大小比較）

## サイクル030 実施済み

- [x] [優先度:高] sequences モジュール大幅拡充: 既存3レベル → 13レベル（等差一般項・等差和・等比一般項・等比和・シグマ公式・シグマ性質・漸化式・判別・無限等比級数・階差数列・部分分数分解 追加）
- [x] [優先度:高] logs モジュール大幅拡充: 既存3レベル → 12レベル（対数定義・基本性質・底の変換・常用対数桁数・対数方程式・対数不等式・グラフ移動・指数対数対称性・大小比較 追加）
- [x] [優先度:中] sequences/logs の page.tsx を next/dynamic + レベル選択UI に全面リファクタリング

## サイクル029 実施済み

- [x] [優先度:低] NARRATIVE.md を data/probability/sets_logic モジュールに展開（quadratics と同じフォーマットに統一）
- [x] [優先度:低] quiz: クロスモジュール問題を7問追加（合計22問プール）— 二次関数x確率、集合x命題、データx確率、三角比x数と式 等
- [x] [優先度:低] trig/data/probability/sets_logic の page.tsx を next/dynamic に変換（ビルドパフォーマンス改善）

## サイクル028 実施済み

- [x] [優先度:低] profile ページに学習履歴グラフ（モジュール別進捗率の棒グラフ・Recharts）を追加
- [x] [優先度:低] ビルドパフォーマンスの改善（quadratics page.tsx の static import を next/dynamic に変換）
- [x] [優先度:低] モバイルレスポンシブの最終確認（HeronComparisonViz, TrigApplicationViz の canvas レスポンシブ対応）

## サイクル027 実施済み

- [x] [優先度:低] quiz: 全モジュール混合ランダム出題機能を追加（cross-module 15問プール + 10問ランダム出題）
- [x] [優先度:低] sets_logic Level 19: 条件命題パターン集 ConditionalPatternViz（逆・裏・対偶の探索+演習モード）
- [x] [優先度:中] trig/trig_ratios ナビゲーション整理: ダッシュボードに sets_logic, trig_ratios を追加し学習順序を明確化

## サイクル026 実施済み

- [x] [優先度:中] data: 箱ひげ図の読み取りと比較 Level 19 追加 — BoxPlotComparisonViz.tsx
- [x] [優先度:中] sets_logic: 必要十分条件の判定（二次方程式との組み合わせ）Level 18 追加 — NecessarySufficientConditionViz.tsx
- [x] [優先度:中] probability: 確率の漸化式（反復試行の応用）Level 20 追加 — RecurrenceViz.tsx
- [x] [優先度:中] 全モジュールに解説動画リンクプレースホルダー追加（data, trig, sets_logic, probability）

## サイクル025 実施済み

- [x] [優先度:中] trig: 三角形の面積（ヘロンの公式との比較）Level 19 追加 — HeronComparisonViz.tsx
- [x] [優先度:中] trig: 三角比の応用問題（測量・仰角俯角）Level 20 追加 — TrigApplicationViz.tsx
- [x] [優先度:中] data: 分散・標準偏差の変換（データ変換時の性質）Level 18 追加 — VarianceTransformViz.tsx

## サイクル024 実施済み

- [x] [優先度:中] quadratics: 絶対値を含む二次関数のグラフ Level 73 追加 — AbsoluteQuadraticViz.tsx
- [x] [優先度:中] quadratics: 二次不等式の文章題（面積・利益最大化）Level 74 追加 — QuadraticWordProblemViz.tsx
- [x] [優先度:中] math_i_numbers: 恒等式の係数決定 Level 52 追加 — IdentityCoefficientsViz.tsx

## サイクル023 実施済み

- [x] [優先度:高] quadratics: 二次方程式の解と係数の関係（応用）Level 72 追加 — RootCoefficientViz.tsx
- [x] [優先度:中] probability: 期待値の計算 Level 19 追加 — ExpectedValueViz.tsx
- [x] [優先度:中] sets_logic: 集合の要素の個数（包除原理の応用）Level 17 追加 — InclusionExclusionViz.tsx

## サイクル022 実施済み

- [x] [優先度:中] manual ページに「推奨学習パス」と「難易度テーブル」セクションを追加
- [x] [優先度:中] math_i_numbers: 整式の割り算の応用（余りの定理・因数定理）Level 51 追加 — RemainderFactorViz.tsx

## サイクル021 実施済み

- [x] [優先度:高] trig: 三角比の相互関係を用いた式の値 Level 18 追加 — TrigRelationshipViz.tsx
- [x] [優先度:高] math_i_numbers: 二重根号の変換（応用パターン）Level 50 追加 — NestedRadical2Viz.tsx
- [x] [優先度:高] data: 相関係数の正確な計算手順 Level 17 追加 — CorrelationCoefficientCalcViz.tsx

## サイクル020 実施済み

- [x] [優先度:高] quadratics: 二次関数の最大値・最小値（定義域が動く場合）Level 71 追加 — MovingDomainMaxMinViz.tsx
- [x] [優先度:高] math_i_numbers: 有理化（1次・2次）Level 49 追加 — RationalizationAdvancedViz.tsx
- [x] [優先度:高] probability: 条件付き確率の応用（分割表）Level 18 追加 — ConditionalProbabilityTableViz.tsx

## サイクル019 実施済み

- [x] [優先度:高] trig: 三角不等式の解（0≦θ<2π）Level 17 追加 — TrigInequalityViz.tsx
- [x] [優先度:高] math_i_numbers: 分数式の通分・加減算 Level 48 追加 — FractionAdditionViz.tsx
- [x] [優先度:高] sets_logic: 条件命題の否定と対偶（複合条件）Level 16 追加 — CompoundConditionViz.tsx

## サイクル018 実施済み

- [x] [優先度:高] math_i_numbers: 分数式の約分 Level 47 追加 — FractionSimplifyViz.tsx
- [x] [優先度:中] TODO.md に受験頻出問題対応ロードマップを追記（サイクル019以降の計画）

## サイクル017 実施済み

- [x] [優先度:中] 共通 MathDisplay を data・quadratics モジュールに適用（react-katex 直接呼び出しを MathDisplay に統一）
- [x] [優先度:高] trig: 余弦定理の逆算（三辺→角度）Level 16 追加 — CosineInverseViz.tsx

## サイクル016 実施済み

- [x] [優先度:中] sets_logic page.tsx 内 inline Viz を components/ に分離（NecessarySufficientBasicViz, ContrapositiveViz, SetElementsViz, ContradictionViz, QuadraticSetsViz, QuantifierNegationViz + 共通 MathComponent）
- [x] [優先度:中] locales 全横断キー差分の最終チェック — en.json / ja.json の構造不一致を解消（top-level → modules.* 移動、全キー同期完了）

## サイクル015 実施済み

- [x] [優先度:高] probability: ベイズの定理 Level 17 追加 — BayesTheoremViz.tsx
- [x] [優先度:中] probability page.tsx の components/ 分離整理 — inline canvas ビューの条件修正
- [x] [優先度:中] quadratics Problem 型・page.tsx から `any` を除去 — 適切な型に置換
- [x] [優先度:中] 各モジュールのレベル進行の一貫性確認（sets_logic, probability, trig）

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
- [x] [優先度:高] probability: ベイズの定理の基礎 Level 17 追加 → サイクル015

## 優先度: 中（品質改善・リファクタリング）

- [x] [優先度:中] quadratics page.tsx（Level 70まで追加で巨大化）のリファクタリング — レベル定義を外部ファイルに分離 → サイクル014
- [x] [優先度:中] probability page.tsx の components/ 分離 — inline canvas の条件修正 → サイクル015
- [x] [優先度:中] 共通 MathDisplay を data・quadratics モジュールにも適用（現在は個別の KaTeX 呼び出し）→ サイクル017
- [x] [優先度:中] locales 全横断キー差分の最終チェック（en.json / ja.json の全モジュール網羅）→ サイクル016
- [x] [優先度:中] 各モジュールのレベル進行の一貫性確認（難易度が単調増加しているか）→ サイクル015
- [ ] [優先度:中] 受験頻出問題に対応する Viz コンポーネントが不足しているモジュールを特定し追加計画を立てる
- [x] [優先度:中] trig/functions モジュールの内容重複を整理（三角関数の扱いが複数箇所に分散）→ サイクル027（ダッシュボード整理）
- [x] [優先度:中] 全モジュールに「解説動画リンク」プレースホルダーの追加 → サイクル026
- [x] [優先度:中] sets_logic page.tsx 内 inline Viz を components/ に分離（NecessarySufficientViz, ContrapositiveViz 等）→ サイクル016

## 優先度: 低（改善・拡張）

- [ ] [優先度:低] logs/ ディレクトリの JSON ログファイルの整理・アーカイブ方針を策定する
- [ ] [優先度:低] math_i_numbers に残りレベル（分数式・有理化以降）を追加する計画を立てる
- [ ] [優先度:低] quadratics モジュールの Viz コンポーネントのリファクタリング（巨大ファイル分割）
- [ ] [優先度:低] data モジュールの新レベル（Level 16+）用の components/ 準備
- [x] [優先度:低] 全モジュールの問題難易度テーブルを作成し、学習順序の推奨パスを設計 → サイクル022
- [x] [優先度:低] ビルドパフォーマンスの改善（動的インポートの導入検討）→ サイクル028
- [x] [優先度:低] NARRATIVE.md を他モジュール（data, probability, sets_logic）にも展開 → サイクル029
- [x] [優先度:低] sets_logic Level 12 以降の問題バリエーション増加（条件命題のパターン追加）→ サイクル027
- [x] [優先度:低] trig_ratios と trig の統合可能性の検討（ユーザー導線の最適化）→ サイクル027（ダッシュボード整理で学習順序明確化）
- [ ] [優先度:低] math_i_numbers の sets_logic 連携（集合と不等式のクロスリファレンス）
- [x] [優先度:低] profile ページに学習履歴グラフ（週次レベルクリア数の可視化）を追加 → サイクル028
- [x] [優先度:低] quiz モジュールに各モジュールからのランダム出題機能を追加 → サイクル027
- [x] [優先度:低] モバイルレスポンシブの最終確認（特に canvas 系 Viz コンポーネント）→ サイクル028

## 受験頻出問題対応ロードマップ（サイクル019〜）

各モジュールの現在のレベル数と、受験頻出トピックで不足している内容を優先度順に整理。

### math_i_numbers（現在 Level 52）
- [x] [優先度:高] 分数式の通分・加減算 Level 48 追加 → サイクル019
- [x] [優先度:高] 有理化（1次・2次）Level 49 追加 → サイクル020
- [x] [優先度:高] 二重根号の変換（応用パターン）Level 50 追加 → サイクル021
- [x] [優先度:中] 整式の割り算の応用（余りの定理・因数定理）Level 51 追加 → サイクル022
- [x] [優先度:中] 恒等式の係数決定 Level 52 追加 → サイクル024

### quadratics（現在 Level 74）
- [x] [優先度:高] 二次関数の最大値・最小値（定義域が動く場合）の総合演習 Level 71 追加 → サイクル020
- [x] [優先度:高] 二次方程式の解と係数の関係（応用）Level 72 追加 → サイクル023
- [x] [優先度:中] 絶対値を含む二次関数のグラフ Level 73 追加 → サイクル024
- [x] [優先度:中] 二次不等式の文章題（面積・利益最大化）Level 74 追加 → サイクル024

### trig（現在 Level 20）
- [x] [優先度:高] 三角不等式の解（0 ≦ θ < 2π）Level 17 追加 → サイクル019
- [x] [優先度:高] 三角比の相互関係を用いた式の値 Level 18 追加 → サイクル021
- [x] [優先度:中] 三角形の面積（ヘロンの公式との比較）Level 19 追加 → サイクル025
- [x] [優先度:中] 三角比の応用問題（測量・仰角俯角）Level 20 追加 → サイクル025

### data（現在 Level 19）
- [x] [優先度:高] 相関係数の正確な計算手順 Level 17 追加 → サイクル021
- [x] [優先度:中] 分散・標準偏差の変換（データ変換時の性質）Level 18 追加 → サイクル025
- [x] [優先度:中] 箱ひげ図の読み取りと比較 Level 19 追加 → サイクル026

### sets_logic（現在 Level 18）
- [x] [優先度:高] 条件命題の否定と対偶（複合条件）Level 16 追加 → サイクル019
- [x] [優先度:中] 集合の要素の個数（包除原理の応用）Level 17 追加 → サイクル023
- [x] [優先度:中] 必要十分条件の判定（二次方程式との組み合わせ）Level 18 追加 → サイクル026

### probability（現在 Level 20）
- [x] [優先度:高] 条件付き確率の応用（表を用いた計算）Level 18 追加 → サイクル020
- [x] [優先度:中] 期待値の計算 Level 19 追加 → サイクル023
- [x] [優先度:中] 確率の漸化式（反復試行の応用）Level 20 追加 → サイクル026
