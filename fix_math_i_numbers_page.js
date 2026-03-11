const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let data = fs.readFileSync(file, 'utf8');

// Add import
if (!data.includes('ParametricLinearInequalityViz')) {
    data = data.replace(
        "import AbsoluteCaseSplitViz from './components/AbsoluteCaseSplitViz';",
        "import AbsoluteCaseSplitViz from './components/AbsoluteCaseSplitViz';\nimport ParametricLinearInequalityViz from './components/ParametricLinearInequalityViz';"
    );
}

// Add to levels
if (!data.includes("{ id: 14, title: '文字係数の1次不等式', type: 'parametric_linear_inequality' }")) {
    data = data.replace(
        "{ id: 13, title: '絶対値を含む方程式 (場合分け)', type: 'absolute_case_split' }",
        "{ id: 13, title: '絶対値を含む方程式 (場合分け)', type: 'absolute_case_split' },\n        { id: 14, title: '文字係数の1次不等式', type: 'parametric_linear_inequality' }"
    );
}

const block14 = `
            {currentLevel === 14 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">文字係数の1次不等式 (Parametric Linear Inequality)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    不等式 <InlineMath math="ax > b" /> のように文字係数が含まれる場合、安易に <InlineMath math="a" /> で割ってはいけません。<br/>
                    <InlineMath math="a" /> が正の数か、負の数か、それとも0かによって、不等号の向きが変わったり、解の形が根本的に変わるため、3つの場合分けが必須です。
                  </p>
                  <ParametricLinearInequalityViz />
                </div>
              </div>
            )}
`;

if (!data.includes('currentLevel === 14')) {
    data = data.replace(
        "          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
        block14 + "\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}"
    );
}

fs.writeFileSync(file, data);
console.log("Injected Level 14 successfully.");
