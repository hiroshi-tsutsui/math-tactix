const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

if (!content.includes("{ id: 23, title: '次数下げによる高次式の値'")) {
    content = content.replace(
        "{ id: 22, title: '1次不等式の文章題 (食塩水・濃度)', type: 'salt_water_inequality' },",
        "{ id: 22, title: '1次不等式の文章題 (食塩水・濃度)', type: 'salt_water_inequality' },\n        { id: 23, title: '次数下げによる高次式の値', type: 'higher_degree_value' },"
    );
}

const level23Block = `
            {currentLevel === 23 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">次数下げによる高次式の値</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    $x = \\frac{1 + \\sqrt{5}}{2}$ のような値を高次式に代入する際、直接代入せず、2次方程式を作って次数を下げる（割り算を利用する）テクニックを視覚化します。
                  </p>
                  <HigherDegreeValueViz />
                </div>
              </div>
            )}
`;

if (!content.includes('currentLevel === 23')) {
    content = content.replace(
        "          </div>\n        </div>",
        level23Block + "\n          </div>\n        </div>"
    );
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated page.tsx with Level 23.');
