const fs = require('fs');
let content = fs.readFileSync('app/math_i_numbers/page.tsx', 'utf-8');

// I will just replace the messed up part manually
content = content.replace(/<AlternatingPolynomialViz \/>[\s\S]*\}\)/, 
`<AlternatingPolynomialViz />
                </div>
              </div>
            )}
            
            {currentLevel === 26 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">平方根と絶対値 (文字式の簡約化)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    ルートの中の平方を外すとき、中身が正か負かで絶対値の外れ方が変わります。<br/>
                    数直線上で x の位置を動かし、それぞれの項が「そのまま外れる」か「マイナスをつけて外れる」かを視覚的に確認しましょう。
                  </p>
                  <RootAbsoluteSimplificationViz />
                </div>
              </div>
            )}`);
            
fs.writeFileSync('app/math_i_numbers/page.tsx', content);
