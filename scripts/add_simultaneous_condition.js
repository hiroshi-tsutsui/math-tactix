const fs = require('fs');

const PAGE_PATH = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(PAGE_PATH, 'utf8');

// 1. Add import
if (!content.includes('ConditionForSimultaneousInequalitiesViz')) {
  content = content.replace(
    "import SumOfAbsoluteValuesViz from './components/SumOfAbsoluteValuesViz';",
    "import SumOfAbsoluteValuesViz from './components/SumOfAbsoluteValuesViz';\nimport ConditionForSimultaneousInequalitiesViz from './components/ConditionForSimultaneousInequalitiesViz';"
  );
}

// 2. Add component render block right before the Quiz section
const newLevelHtml = `
            {/* Level 18 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
              <div className="bg-slate-50 border-b border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Level 18</span>
                  <h2 className="text-lg font-bold text-slate-800">連立不等式が解をもつ条件 (Conditions for Solutions in Simultaneous Inequalities)</h2>
                </div>
                <p className="text-slate-600 text-sm">
                  1次不等式 <InlineMath math="-2 < x < 3" /> と <InlineMath math="x > a" /> が同時に成り立つ <InlineMath math="x" /> が存在するための定数 <InlineMath math="a" /> の範囲を視覚化します。
                </p>
              </div>
              <div className="p-6">
                <ConditionForSimultaneousInequalitiesViz />
              </div>
            </div>
`;

if (!content.includes('Level 18')) {
  content = content.replace(
    '{/* --- Test/Quiz Section --- */}',
    newLevelHtml + '\n            {/* --- Test/Quiz Section --- */}'
  );
}

fs.writeFileSync(PAGE_PATH, content, 'utf8');
console.log('Successfully added Level 18 to page.tsx');
