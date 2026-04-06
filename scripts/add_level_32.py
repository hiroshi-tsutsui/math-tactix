import re

with open('app/math_i_numbers/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
import_statement = "import MaxIntegerSolutionViz from './components/MaxIntegerSolutionViz';\n"
if "MaxIntegerSolutionViz" not in content:
    content = content.replace("import ExpansionSubstitutionViz", import_statement + "import ExpansionSubstitutionViz")

# Add render block
render_block = """
            {currentLevel === 32 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">最大整数解から定数の範囲を決定</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    不等式を満たす最大の整数から、定数の範囲を視覚的に決定します。<br/>
                    定数aの値を動かして、条件が満たされる範囲（3 &lt; a ≦ 4）を確認しましょう。
                  </p>
                  <MaxIntegerSolutionViz />
                </div>
              </div>
            )}
"""
if "{currentLevel === 32" not in content:
    content = content.replace("{currentLevel === 31", render_block + "{currentLevel === 31")

with open('app/math_i_numbers/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
