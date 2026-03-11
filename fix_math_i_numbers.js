const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let data = fs.readFileSync(file, 'utf8');

if (!data.includes("{ id: 13, title: '絶対値を含む方程式 (場合分け)', type: 'absolute_case_split' }")) {
    data = data.replace(
        "{ id: 12, title: '最低次数の文字で整理する因数分解', type: 'factoring_lowest_degree' }",
        "{ id: 12, title: '最低次数の文字で整理する因数分解', type: 'factoring_lowest_degree' },\n        { id: 13, title: '絶対値を含む方程式 (場合分け)', type: 'absolute_case_split' }"
    );
}

const block12 = `
            {currentLevel === 12 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">最低次数の文字で整理する因数分解 (Factoring by Lowest Degree)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    複数の文字を含む複雑な式を因数分解する際の鉄則は、「最も次数の低い文字に着目して整理する」ことです。<br/>
                    これにより、式全体の見通しが良くなり、共通因数やたすき掛けの公式が見つけやすくなります。
                  </p>
                  <FactoringLowestDegreeViz />
                </div>
              </div>
            )}
`;

const block13 = `
            {currentLevel === 13 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値を含む方程式 (場合分け) (Absolute Value Case Splitting)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値記号を含む方程式を解く基本は、絶対値の中身の正負によって場合分け（Case Splitting）を行うことです。<br/>
                    また、求めた解が最初の「場合分けの条件」を満たしているか（不適でないか）を必ず確認する必要があります。
                  </p>
                  <AbsoluteCaseSplitViz />
                </div>
              </div>
            )}
`;

if (!data.includes('currentLevel === 12')) {
    data = data.replace(
        "          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
        block12 + "\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}"
    );
}

if (!data.includes('currentLevel === 13')) {
    data = data.replace(
        "          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
        block13 + "\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}"
    );
}

fs.writeFileSync(file, data);
console.log("Fixed page.tsx");
