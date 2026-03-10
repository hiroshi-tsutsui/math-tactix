const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app/data/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
content = content.replace("import BoxPlotViz from './components/BoxPlotViz';", "import BoxPlotViz from './components/BoxPlotViz';\nimport HypothesisTestingViz from './components/HypothesisTestingViz';");

// 2. Add Level 4 to getLevels
content = content.replace(
  "logGuide: t('modules.data.levels.3.log_guide')\n    }\n  ];",
  "logGuide: t('modules.data.levels.3.log_guide')\n    },\n    {\n      id: 4,\n      targetR: 0,\n      name: '仮説検定の考え方',\n      desc: '偶然か意味ある差かを有意水準5%で検定します。',\n      logStart: 'シミュレーション開始',\n      logGuide: 'コイントスを実行してください。'\n    }\n  ];"
);

// 3. Update level logic
content = content.replace(
  "if (progress.includes(2)) nextLvl = 3;\n    setCurrentLevel(nextLvl);",
  "if (progress.includes(2)) nextLvl = 3;\n    if (progress.includes(3)) nextLvl = 4;\n    setCurrentLevel(nextLvl);"
);

// 4. Update total level counter in navbar
content = content.replace(
  "{t('common.level')} {currentLevel} / 3",
  "{t('common.level')} {currentLevel} / 4"
);

// 5. Render component logic
content = content.replace(
  "{currentLevel === 2 ? (<VarianceViz",
  "{currentLevel === 4 ? (<HypothesisTestingViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('検定完了'); } }} />) : currentLevel === 2 ? (<VarianceViz"
);

fs.writeFileSync(file, content);
console.log("Patched page.tsx");
