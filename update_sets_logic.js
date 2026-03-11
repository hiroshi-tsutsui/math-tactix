const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'sets_logic', 'page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Check if already imported
if (!pageContent.includes('ConditionNumberLineViz')) {
  // Add import
  const importStatement = "import ConditionNumberLineViz from '../components/math/ConditionNumberLineViz';\n";
  pageContent = pageContent.replace(/(import.*?\n)(?!import)/s, `$1${importStatement}`);

  // Add to levels array
  const newLevel = "    { id: 8, title: '必要条件・十分条件と数直線', type: 'condition_number_line' }";
  pageContent = pageContent.replace(/id: 7.*?\}[\n\r]*\s*\]/s, match => {
    return match.replace(/\]/, `,\n${newLevel}\n  ]`);
  });

  // Add to render logic
  const newRender = `
            {currentLevel === 8 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">必要条件・十分条件と数直線 (Necessary and Sufficient Conditions)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    不等式で与えられた条件 <InlineMath math="P" /> と <InlineMath math="Q" /> の包含関係を視覚化します。<br/>
                    <InlineMath math="P" /> の範囲を動かして、いつ「十分条件 (<InlineMath math="P \\subset Q" />)」や「必要条件 (<InlineMath math="Q \\subset P" />)」になるかを確認しましょう。
                  </p>
                  <ConditionNumberLineViz />
                </div>
              </div>
            )}
`;
  pageContent = pageContent.replace(/(<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\})/s, `${newRender}$1`);

  fs.writeFileSync(pagePath, pageContent);
  console.log("Successfully added ConditionNumberLineViz to sets_logic/page.tsx");
} else {
  console.log("ConditionNumberLineViz is already in sets_logic/page.tsx");
}
