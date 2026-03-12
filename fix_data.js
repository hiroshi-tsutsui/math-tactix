const fs = require('fs');
let content = fs.readFileSync('app/data/page.tsx', 'utf8');

const level9 = `,
    {
      id: 9,
      targetR: 0,
      name: '外れ値と代表値',
      desc: '極端な値（外れ値）が平均値と中央値に与える影響のロバスト性を視覚化する',
      logStart: '代表値シミュレータ起動',
      logGuide: '外れ値を動かして、平均と中央値の変化量の違いを確認してください。'
    }`;

const level10 = `,
    {
      id: 10,
      targetR: 0,
      name: '2つの集団の結合と分散',
      desc: '2つの集団を合わせた全体の分散がどのように計算されるか視覚的に理解する',
      logStart: '結合分散シミュレータ起動',
      logGuide: '各集団の人数・平均・分散を調整し、全体分散への影響を確認してください。'
    }`;

if (!content.includes("id: 9,")) {
  content = content.replace(/id: 8,[\s\S]*?logGuide: '[^']*'\n    \}/, match => match + level9 + level10);
}

if (!content.includes('import CombinedVarianceViz')) {
  content = content.replace("import OutlierViz from './components/OutlierViz';", "import OutlierViz from './components/OutlierViz';\nimport CombinedVarianceViz from './components/CombinedVarianceViz';");
}

if (!content.includes('currentLevel === 10')) {
  content = content.replace('currentLevel === 9 ? (<OutlierViz />)', 'currentLevel === 10 ? (<CombinedVarianceViz />) : currentLevel === 9 ? (<OutlierViz />)');
}

fs.writeFileSync('app/data/page.tsx', content);
