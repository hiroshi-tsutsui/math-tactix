const fs = require('fs');
let content = fs.readFileSync('app/data/page.tsx', 'utf8');

// Add import
content = content.replace(
  "import HypothesisTestingViz from './components/HypothesisTestingViz';",
  "import HypothesisTestingViz from './components/HypothesisTestingViz';\nimport DataTransformViz from './components/DataTransformViz';"
);

// Add to getLevels()
content = content.replace(
  "    {\n      id: 4,\n      targetR: 0,\n      name: '仮説検定の考え方',",
  "    {\n      id: 5,\n      targetR: 0,\n      name: 'データの変換',\n      desc: '変量xを y=ax+b で変換したときの平均・分散・標準偏差の変化',\n      logStart: '変換シミュレータ起動',\n      logGuide: 'aとbを操作してください。'\n    },\n    {\n      id: 4,\n      targetR: 0,\n      name: '仮説検定の考え方',"
);

// Fix level progression
content = content.replace(
  "if (progress.includes(3)) nextLvl = 4;",
  "if (progress.includes(3)) nextLvl = 4;\n    if (progress.includes(4)) nextLvl = 5;"
);

// Fix level completion
content = content.replace(
  "if (currentLevel < 3) {",
  "if (currentLevel < 5) {"
);
content = content.replace(
  "{currentLevel < 3 ? t('common.next') : t('common.root')}",
  "{currentLevel < 5 ? t('common.next') : t('common.root')}"
);

// Fix rendering
content = content.replace(
  "{currentLevel === 4 ? (<HypothesisTestingViz",
  "{currentLevel === 5 ? (<DataTransformViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('変量変換完了'); } }} />) : currentLevel === 4 ? (<HypothesisTestingViz"
);
content = content.replace(
  "{t('common.level')} {currentLevel} / 4",
  "{t('common.level')} {currentLevel} / 5"
);

fs.writeFileSync('app/data/page.tsx', content);
console.log('Patched app/data/page.tsx');
