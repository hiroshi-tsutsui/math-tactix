const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add import
if (!content.includes('IntegerFractionalPartViz')) {
  content = content.replace(
    "import RepeatingDecimalViz from '../components/math/RepeatingDecimalViz';",
    "import RepeatingDecimalViz from '../components/math/RepeatingDecimalViz';\nimport IntegerFractionalPartViz from '../components/math/IntegerFractionalPartViz';"
  );
}

// 2. Add to levels
if (!content.includes("{ id: 9, title: '無理数の整数部分と小数部分', type: 'integer_fractional' }")) {
  content = content.replace(
    "{ id: 8, title: '循環小数と分数', type: 'repeating_decimal' }",
    "{ id: 8, title: '循環小数と分数', type: 'repeating_decimal' },\n    { id: 9, title: '無理数の整数部分と小数部分', type: 'integer_fractional' }"
  );
}

// 3. Add to rendering logic
if (!content.includes("currentLevel === 9")) {
  const renderBlock = `            {currentLevel === 8 && (
              <div className="animate-fade-in">
                <RepeatingDecimalViz />
              </div>
            )}
            {currentLevel === 9 && (
              <div className="animate-fade-in">
                <IntegerFractionalPartViz />
              </div>
            )}`;
            
  content = content.replace(
    /\{\s*currentLevel === 8 && \([\s\S]*?<\/\s*div>\s*\)\s*\}/m,
    renderBlock
  );
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully added Level 9: IntegerFractionalPartViz');
