const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const blocksToAdd = `
            {currentLevel === 20 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値を含む不等式 (場合分け)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値の場合分けと、最終的な解の適・不適を視覚的に理解します。
                  </p>
                  <AbsoluteInequalityCaseSplitViz />
                </div>
              </div>
            )}

            {currentLevel === 21 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">置き換えによる因数分解</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    共通部分をAと置いて因数分解し、元に戻すプロセスを視覚化します。
                  </p>
                  <FactoringSubstitutionViz />
                </div>
              </div>
            )}

            {currentLevel === 22 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">1次不等式の文章題 (食塩水・濃度)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    食塩水に水を追加したときの濃度変化と、それが不等式でどう表されるかを視覚的に理解します。
                  </p>
                  <SaltWaterInequalityViz />
                </div>
              </div>
            )}
`;

content = content.replace('          </div>\n        </div>\n      </div>\n    </div>\n  );\n}', blocksToAdd + '\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}');
fs.writeFileSync(file, content);
