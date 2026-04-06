const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

const targetStr = '{currentLevel === 40 && <AtLeastOnePositiveRootViz />}';
const injection = `{currentLevel === 38 && <MovingRightEdgeViz />}\n        {currentLevel === 39 && <IndependentVariablesViz />}\n        {currentLevel === 41 && <TranslationDeterminationViz />}\n        {currentLevel === 42 && <DifferentSignsViz />}\n        {currentLevel === 43 && <ProfitMaximizationViz />}\n        {currentLevel === 44 && <OneRealRootConditionViz />}`;

if (content.includes(targetStr) && !content.includes('<MovingRightEdgeViz />')) {
  content = content.replace(targetStr, targetStr + '\n        ' + injection);
  fs.writeFileSync(pagePath, content);
  console.log('Successfully injected missing viz components!');
} else {
  console.log('Target string not found or already injected.');
}
