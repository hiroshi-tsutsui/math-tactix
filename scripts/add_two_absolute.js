const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'math_i_numbers', 'page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Add import if not exists
if (!pageContent.includes('TwoAbsoluteValuesInequalityViz')) {
  pageContent = pageContent.replace(
    /import ValueAbsoluteViz from '\.\.\/components\/ValueAbsoluteViz';/,
    `import ValueAbsoluteViz from '../components/ValueAbsoluteViz';\nimport TwoAbsoluteValuesInequalityViz from '../components/TwoAbsoluteValuesInequalityViz';`
  );
}

// Add Level 42 section (or next available)
const block = `
        {/* レベル42: 2つの絶対値を含む不等式 */}
        {currentLevel === 42 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">レベル42: 2つの絶対値を含む不等式</h2>
            </div>
            
            <p className="text-slate-600 mb-6">
              2つの絶対値を含む方程式や不等式は、絶対値の中身が0になる点を境に数直線を3つの区間に分けて考えます。
              グラフを描いて考えると、解の範囲が視覚的にわかりやすくなります。
            </p>

            <TwoAbsoluteValuesInequalityViz />
          </div>
        )}
`;

if (!pageContent.includes('currentLevel === 42')) {
  pageContent = pageContent.replace(
    /(\{\/\* レベル40[\s\S]*?\}\)[\s\S]*?\})/,
    `$1\n${block}`
  );
  fs.writeFileSync(pagePath, pageContent, 'utf8');
  console.log('Successfully added Level 42 block.');
} else {
  console.log('Level 42 block already exists.');
}
