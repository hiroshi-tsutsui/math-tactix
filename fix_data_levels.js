const fs = require('fs');
let file = fs.readFileSync('app/data/page.tsx', 'utf8');

const replacement = `const getLevels = () => [
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
    }
  ];`;

file = file.replace(/const getLevels = \(\) => \[[\s\S]*?\}\n  \];/g, replacement);

fs.writeFileSync('app/data/page.tsx', file);
