const fs = require('fs');

let page = fs.readFileSync('app/math_i_numbers/page.tsx', 'utf8');

// Add import
page = page.replace(
  "import IntegerSolutionsViz from '../components/math/IntegerSolutionsViz';",
  "import IntegerSolutionsViz from '../components/math/IntegerSolutionsViz';\nimport TasukigakeViz from '../components/math/TasukigakeViz';"
);

// Add to levels
page = page.replace(
  "{ id: 3, title: '1次不等式の整数解の個数', type: 'integer_solutions' }",
  "{ id: 3, title: '1次不等式の整数解の個数', type: 'integer_solutions' },\n    { id: 4, title: 'たすき掛け (因数分解)', type: 'tasukigake' }"
);

// Add the visualization block
const newBlock = `
            {currentLevel === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">たすき掛け (Cross Multiplication Method)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    2次式 <InlineMath math="ax^2 + bx + c" /> を因数分解する際、<InlineMath math="a = pr, c = qs, b = ps + qr" /> となるような整数 <InlineMath math="p, q, r, s" /> を見つける手法です。<br/>
                    斜め（たすき）に掛けて足し合わせることで、中央の係数 <InlineMath math="b" /> に一致するかを視覚的に確認します。
                  </p>
                  <TasukigakeViz />
                </div>
              </div>
            )}
`;

page = page.replace(
  "          </div>\n        </div>",
  `${newBlock}          </div>\n        </div>`
);

fs.writeFileSync('app/math_i_numbers/page.tsx', page);
console.log("Updated page.tsx");
