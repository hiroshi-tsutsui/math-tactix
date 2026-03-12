const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/data/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes('HistogramBoxPlotViz')) {
  // Add import
  content = content.replace(
    "import DataTransformViz from './components/DataTransformViz';",
    "import DataTransformViz from './components/DataTransformViz';\nimport HistogramBoxPlotViz from './components/HistogramBoxPlotViz';"
  );
  
  // Update logic to handle level 7
  content = content.replace(
    "{currentLevel === 6 ? (<FrequencyTableViz",
    "{currentLevel === 7 ? (<HistogramBoxPlotViz onComplete={() => { if (!showUnlock) { setShowUnlock(true); addLog('ヒストグラムとの対応を確認しました。'); } }} />) : currentLevel === 6 ? (<FrequencyTableViz"
  );
  
  fs.writeFileSync(pagePath, content);
  console.log('Updated page.tsx with HistogramBoxPlotViz');
} else {
  console.log('Already updated');
}
