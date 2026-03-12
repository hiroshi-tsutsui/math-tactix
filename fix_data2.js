const fs = require('fs');
const path = './app/data/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const level8Render = `currentLevel === 8 ? (<CovarianceViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('共分散の性質を確認しました。'); } }} />) : currentLevel === 7`;
const level9Render = `currentLevel === 9 ? (<OutlierViz />) : currentLevel === 8 ? (<CovarianceViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('共分散の性質を確認しました。'); } }} />) : currentLevel === 7`;

if (code.includes(level8Render)) {
  code = code.replace(level8Render, level9Render);
}

fs.writeFileSync(path, code);
