const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Add import
if (!content.includes('BiQuadraticFactoringViz')) {
  content = content.replace(
    /import ParametricLinearInequalityViz from '\.\/components\/ParametricLinearInequalityViz';/,
    "import ParametricLinearInequalityViz from './components/ParametricLinearInequalityViz';\nimport BiQuadraticFactoringViz from './components/BiQuadraticFactoringViz';"
  );
}

// 2. Add to levels
if (!content.includes("{ id: 15, title: '複二次式の因数分解 (平方の差)'")) {
  content = content.replace(
    /{ id: 14, title: '文字係数の1次不等式', type: 'parametric_linear_inequality' }\n  \];/,
    "{ id: 14, title: '文字係数の1次不等式', type: 'parametric_linear_inequality' },\n        { id: 15, title: '複二次式の因数分解 (平方の差)', type: 'biquadratic_factoring' }\n  ];"
  );
}

// 3. Add to switch statement
if (!content.includes("case 'biquadratic_factoring':")) {
  const switchContent = `
      case 'biquadratic_factoring':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-3">Level 15: 複二次式の因数分解 (平方の差を作る)</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              <InlineMath math="x^4 + ax^2 + b" /> の形をした式を複二次式と呼びます。単なる置き換え <InlineMath math="X = x^2" /> では解けない場合、無理やり <InlineMath math="A^2 - B^2" /> の形を作るという高度な式変形が求められます。
            </p>
            <BiQuadraticFactoringViz />
          </div>
        );`;
        
  content = content.replace(
    /case 'parametric_linear_inequality':\s*return \([\s\S]*?<\/[a-zA-Z]+>\s*\);\s*/,
    match => match + switchContent + "\n"
  );
}

fs.writeFileSync(targetPath, content, 'utf-8');
console.log('Successfully added BiQuadraticFactoringViz to page.tsx');
