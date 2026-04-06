const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('import GaussSymbolViz')) {
  content = content.replace("import 'katex/dist/katex.min.css';", "import 'katex/dist/katex.min.css';\nimport GaussSymbolViz from './components/GaussSymbolViz';");
}

// Add to levels array
if (!content.includes("id: 40, title: 'ガウス記号 (Gauss Symbol)'")) {
  content = content.replace(
    "{ id: 39, title: '絶対値の不等式 (三角不等式)', type: 'triangle_inequality' }",
    "{ id: 39, title: '絶対値の不等式 (三角不等式)', type: 'triangle_inequality' },\n        { id: 40, title: 'ガウス記号 (Gauss Symbol)', type: 'gauss_symbol' }"
  );
}

// Add rendering block
if (!content.includes("currentLevel === 40")) {
  const block = `
            {currentLevel === 40 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">ガウス記号 (Gauss Symbol)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    実数 <InlineMath math="x" /> を超えない最大の整数を <InlineMath math="[x]" /> と表します。<br/>
                    正の数では単に小数を切り捨てることになりますが、負の数では「数直線上で左側にある直近の整数」となることに注意が必要です。
                  </p>
                  <GaussSymbolViz />
                </div>
              </div>
            )}
`;
  
  content = content.replace(
    /\{\s*currentLevel === 39 && \([\s\S]*?\}\s*\)\s*\}/,
    match => match + "\n" + block
  );
}

fs.writeFileSync(file, content);
console.log('Updated app/math_i_numbers/page.tsx successfully');
