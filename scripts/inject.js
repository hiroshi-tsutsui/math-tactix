const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Import
content = content.replace("import RootAbsoluteSimplificationViz from './components/RootAbsoluteSimplificationViz';", 
"import RootAbsoluteSimplificationViz from './components/RootAbsoluteSimplificationViz';\nimport SymmetricThreeVariablesViz from './components/SymmetricThreeVariablesViz';");

// 2. Add to LEVELS
content = content.replace("{ id: 33, title: 'たすき掛けの応用 (2変数の因数分解)', type: 'tasukigake_twice' },",
"{ id: 33, title: 'たすき掛けの応用 (2変数の因数分解)', type: 'tasukigake_twice' },\n        { id: 34, title: '対称式と式の値 (3変数)', type: 'symmetric_three_variables' },");

// 3. Add to Render
const renderBlock = `
            {currentLevel === 34 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">対称式と式の値 (3変数)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    a³+b³+c³-3abc の因数分解は、数学Iの最重要公式の1つです。丸暗記ではなく、自分で式を変形して「作る」方法を身につけましょう。
                  </p>
                  <SymmetricThreeVariablesViz />
                </div>
              </div>
            )}
`;
// Inject right before the last closing tags
const targetIndex = content.lastIndexOf('          </div>\n        </div>\n      </div>');
if (targetIndex !== -1) {
  content = content.substring(0, targetIndex) + renderBlock + content.substring(targetIndex);
}

fs.writeFileSync(file, content);
console.log("Injected successfully");
