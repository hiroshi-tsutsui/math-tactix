const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('ExpansionSubstitutionViz />')) {
  const searchStr = `<FormulaValuesViz />
                </div>
              </div>
            )}`;

  const injectStr = `
            {currentLevel === 31 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">展開の工夫 (置き換え)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    複雑な展開は共通の「カタマリ」を見つけて1つの文字に置き換えることで劇的に簡単になります。
                  </p>
                  <ExpansionSubstitutionViz />
                </div>
              </div>
            )}`;

  code = code.replace(searchStr, searchStr + "\n" + injectStr);
  fs.writeFileSync(file, code);
  console.log("Injected Level 31 render block");
} else {
  console.log("Already injected");
}
