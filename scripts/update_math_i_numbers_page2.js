const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(file, 'utf8');

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
    "          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
    block + "          </div>\n        </div>\n      </div>\n    </div>\n  );\n}"
  );
  fs.writeFileSync(file, content);
  console.log('Appended rendering block');
} else {
  console.log('Block already exists');
}
