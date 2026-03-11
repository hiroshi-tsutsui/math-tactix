const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add import
if (!content.includes('SymmetricPolynomialsViz')) {
  content = content.replace(
    "import TasukigakeViz from '../components/math/TasukigakeViz';",
    "import TasukigakeViz from '../components/math/TasukigakeViz';\nimport SymmetricPolynomialsViz from '../components/math/SymmetricPolynomialsViz';"
  );
}

// Add to levels array
if (!content.includes("title: '対称式の値'")) {
  content = content.replace(
    "{ id: 4, title: 'たすき掛け (因数分解)', type: 'tasukigake' }",
    "{ id: 4, title: 'たすき掛け (因数分解)', type: 'tasukigake' },\n    { id: 5, title: '対称式の値 (基本定理)', type: 'symmetric_polynomials' }"
  );
}

// Add the rendering logic for level 5
if (!content.includes("currentLevel === 5")) {
  const newLevelHtml = `
            {currentLevel === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">対称式の値 (Symmetric Polynomials)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    <InlineMath math="x" /> と <InlineMath math="y" /> を入れ替えても値が変わらない式を「対称式」と呼びます。<br/>
                    すべての対称式は、基本対称式である和 <InlineMath math="x+y" /> と積 <InlineMath math="xy" /> だけで表すことができます。<br/>
                    ここでは、最もよく使われる <InlineMath math="x^2 + y^2 = (x+y)^2 - 2xy" /> の公式を、面積モデルで直感的に理解しましょう。
                  </p>
                  <SymmetricPolynomialsViz />
                </div>
              </div>
            )}
`;
  content = content.replace(
    "          </div>\n        </div>\n      </div>",
    newLevelHtml + "          </div>\n        </div>\n      </div>"
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated app/math_i_numbers/page.tsx');
