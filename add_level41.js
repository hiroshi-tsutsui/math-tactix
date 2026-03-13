const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes('TwoAbsoluteValuesInequalityViz')) {
  // Add import
  content = content.replace(
    "import TriangleInequalityViz from './components/TriangleInequalityViz';",
    "import TriangleInequalityViz from './components/TriangleInequalityViz';\nimport TwoAbsoluteValuesInequalityViz from './components/TwoAbsoluteValuesInequalityViz';"
  );

  // Add to levels array
  content = content.replace(
    "{ id: 40, title: 'ガウス記号 (Gauss Symbol)', type: 'gauss_symbol' }",
    "{ id: 40, title: 'ガウス記号 (Gauss Symbol)', type: 'gauss_symbol' },\n        { id: 41, title: '2つの絶対値を含む方程式・不等式', type: 'two_absolute_values_inequality' }"
  );

  // Add rendering block
  const renderBlock = `                {currentLevel === 40 && (
                  <GaussSymbolViz />
                )}`;
                
  const newRenderBlock = `                {currentLevel === 40 && (
                  <GaussSymbolViz />
                )}
                {currentLevel === 41 && (
                  <TwoAbsoluteValuesInequalityViz />
                )}`;
                
  content = content.replace(renderBlock, newRenderBlock);
  fs.writeFileSync(pagePath, content, 'utf8');
  console.log('Added Level 41');
} else {
  console.log('Level 41 already exists');
}
