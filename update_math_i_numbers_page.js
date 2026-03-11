const fs = require('fs');

const path = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add level
content = content.replace(
  "{ id: 5, title: '対称式の値 (基本定理)', type: 'symmetric_polynomials' }",
  "{ id: 5, title: '対称式の値 (基本定理)', type: 'symmetric_polynomials' },\n    { id: 6, title: '分母の有理化', type: 'rationalization' }"
);

// Add component block
const block = `
            {currentLevel === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">分母の有理化 (Rationalizing the Denominator)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    分母にルートが含まれる場合、計算を簡単にするために分母からルートをなくす操作を「分母の有理化」と呼びます。<br/>
                    和と差の積の展開公式 <InlineMath math="(x+y)(x-y) = x^2 - y^2" /> を用いて、共役な無理数を分母と分子に掛けます。
                  </p>
                  <RationalizationViz />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(
  /          <\/div>\n        <\/div>\n      <\/div>\n    <\/div>\n  \);\n}/,
  block
);

fs.writeFileSync(path, content);
