const fs = require('fs');

let page = fs.readFileSync('app/math_i_numbers/page.tsx', 'utf8');

if (!page.includes("TriangleInequalityViz")) {
  page = page.replace(
    "import ReciprocalSymmetricViz from './components/ReciprocalSymmetricViz';",
    "import ReciprocalSymmetricViz from './components/ReciprocalSymmetricViz';\nimport TriangleInequalityViz from './components/TriangleInequalityViz';"
  );
}

if (!page.includes("{ id: 39, title: '絶対値の不等式 (三角不等式)', type: 'triangle_inequality' }")) {
  page = page.replace(
    "{ id: 38, title: '対称式の値 (分数型)', type: 'reciprocal_symmetric' }",
    "{ id: 38, title: '対称式の値 (分数型)', type: 'reciprocal_symmetric' },\n        { id: 39, title: '絶対値の不等式 (三角不等式)', type: 'triangle_inequality' }"
  );
}

const render39 = `
            {currentLevel === 39 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値の不等式 (三角不等式)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    |a| + |b| ≧ |a + b| という絶対値の重要な性質（三角不等式）を視覚的に理解します。等号が成立する条件（同符号のとき）を確認しましょう。
                  </p>
                  <TriangleInequalityViz />
                </div>
              </div>
            )}
`;

if (!page.includes("currentLevel === 39")) {
  page = page.replace(
    "          </div>\n        </div>\n      </div>\n    </div>",
    render39 + "          </div>\n        </div>\n      </div>\n    </div>"
  );
}

fs.writeFileSync('app/math_i_numbers/page.tsx', page);
console.log("Updated page.tsx with Level 39 (Triangle Inequality)");
