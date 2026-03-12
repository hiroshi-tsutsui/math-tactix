const fs = require('fs');
let code = fs.readFileSync('app/data/page.tsx', 'utf8');

// Replace the levels block safely
code = code.replace(
  /const getLevels = \(\) => \[\s*([\s\S]*?)\s*\];\s*const levels = getLevels\(\);/,
  (match, inner) => {
    // Keep 1 to 10 and add 11
    return `const getLevels = () => [
    { 
      id: 1, 
      targetR: 0.90, 
      name: t('modules.data.levels.1.name'), 
      desc: t('modules.data.levels.1.desc'),
      logStart: t('modules.data.levels.1.log_start'),
      logGuide: t('modules.data.levels.1.log_guide')
    },
    { 
      id: 2, 
      targetR: 0.95, 
      name: t('modules.data.levels.2.name'), 
      desc: t('modules.data.levels.2.desc'),
      logStart: t('modules.data.levels.2.log_start'),
      logGuide: t('modules.data.levels.2.log_guide')
    },
    { 
      id: 3, 
      targetR: 0.99, 
      name: t('modules.data.levels.3.name'), 
      desc: t('modules.data.levels.3.desc'),
      logStart: t('modules.data.levels.3.log_start'),
      logGuide: t('modules.data.levels.3.log_guide')
    },
    {
      id: 4,
      targetR: 0,
      name: '仮説検定の考え方',
      desc: '偶然か意味ある差かを有意水準5%で検定します。',
      logStart: 'シミュレーション開始',
      logGuide: 'コイントスを実行してください。'
    },
    {
      id: 5,
      targetR: 0,
      name: 'データの変換',
      desc: '変量xを y=ax+b で変換したときの平均・分散・標準偏差の変化',
      logStart: '変換シミュレータ起動',
      logGuide: 'aとbを操作してください。'
    },
    {
      id: 6,
      targetR: 0,
      name: '度数分布表と代表値',
      desc: 'ヒストグラムから平均値・中央値の階級・最頻値を読み取る',
      logStart: 'ヒストグラムシミュレータ起動',
      logGuide: '度数をドラッグして代表値の変化を確認してください。'
    },
    {
      id: 7,
      targetR: 0,
      name: '箱ひげ図とヒストグラム',
      desc: 'ヒストグラムの形状と箱ひげ図の対応関係を視覚的に理解する',
      logStart: '分布シミュレータ起動',
      logGuide: '面積と四分位数の関係を確認してください。'
    },
    {
      id: 8,
      targetR: 0,
      name: '共分散と散布図の象限',
      desc: '平均からの偏差の積が作る「符号付き面積」の総和として共分散を視覚的に理解する',
      logStart: '共分散シミュレータ起動',
      logGuide: '点を動かして面積の色（符号）と共分散の値の変化を確認してください。'
    },
    {
      id: 9,
      targetR: 0,
      name: '外れ値と代表値',
      desc: '極端な値（外れ値）が平均値と中央値に与える影響のロバスト性を視覚化する',
      logStart: '代表値シミュレータ起動',
      logGuide: '外れ値を動かして、平均と中央値の変化量の違いを確認してください。'
    },
    {
      id: 10,
      targetR: 0,
      name: '2つの集団の結合と分散',
      desc: '2つの集団を合わせた全体の分散がどのように計算されるか視覚的に理解する',
      logStart: '結合分散シミュレータ起動',
      logGuide: '各集団の人数・平均・分散を調整し、全体分散への影響を確認してください。'
    },
    {
      id: 11,
      targetR: 0,
      name: '分散の計算公式',
      desc: '分散の計算公式 (2乗の平均 - 平均の2乗) を視覚的に理解する',
      logStart: '分散公式シミュレータ起動',
      logGuide: 'データを操作して公式の等式を確認してください。'
    }
  ];

  const levels = getLevels();`
  }
);

// Next update the progress block if needed
code = code.replace(/if \(progress\.includes\(8\)\) nextLvl = 9;/g, 'if (progress.includes(8)) nextLvl = 9;\n    if (progress.includes(9)) nextLvl = 10;\n    if (progress.includes(10)) nextLvl = 11;');

// Replace the imports
if (!code.includes('VarianceShortcutViz')) {
  code = code.replace(/import CombinedVarianceViz from '\.\/components\/CombinedVarianceViz';/, "import CombinedVarianceViz from './components/CombinedVarianceViz';\nimport VarianceShortcutViz from './components/VarianceShortcutViz';");
}

// Replace the rendering logic (line ~288)
code = code.replace(
  /\{currentLevel === 10 \? \(<CombinedVarianceViz \/>\) : currentLevel === 9/,
  "{currentLevel === 11 ? (<VarianceShortcutViz />) : currentLevel === 10 ? (<CombinedVarianceViz />) : currentLevel === 9"
);

fs.writeFileSync('app/data/page.tsx', code, 'utf8');
console.log("Fixed page.tsx");
