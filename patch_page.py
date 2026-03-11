import re

with open("app/math_i_numbers/page.tsx", "r") as f:
    content = f.read()

# Add import
import_statement = "import IntegerSolutionsInequalityViz from './components/IntegerSolutionsInequalityViz';\n"
if "IntegerSolutionsInequalityViz" not in content:
    content = content.replace("import ConditionForSimultaneousInequalitiesViz from './components/ConditionForSimultaneousInequalitiesViz';", 
                              "import ConditionForSimultaneousInequalitiesViz from './components/ConditionForSimultaneousInequalitiesViz';\n" + import_statement)

# Add levels 18 and 19
if "id: 18" not in content:
    content = content.replace("{ id: 17, title: '絶対値の和と最小値 (メジアン)', type: 'sum_of_absolute_values' }", 
                              "{ id: 17, title: '絶対値の和と最小値 (メジアン)', type: 'sum_of_absolute_values' },\n        { id: 18, title: '連立不等式が解をもつ条件', type: 'condition_simultaneous' },\n        { id: 19, title: '不等式の整数解の個数', type: 'integer_solutions_range' }")

# Add render blocks
render_blocks = """
            {currentLevel === 17 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">絶対値の和と最小値 (メジアン)</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    絶対値の和が最小になるのは「中央値 (メジアン)」の部分です。グラフの形を見て確認しましょう。
                  </p>
                  <SumOfAbsoluteValuesViz />
                </div>
              </div>
            )}

            {currentLevel === 18 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">連立不等式が解をもつ条件</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    解をもつためには、不等式の範囲が重なる必要があります。境界が白丸か黒丸かに注意してください。
                  </p>
                  <ConditionForSimultaneousInequalitiesViz />
                </div>
              </div>
            )}

            {currentLevel === 19 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">不等式の整数解の個数</h2>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    整数解が指定された個数になるように、範囲を調整します。「境界（白丸・黒丸）」の扱いがカギになります。
                  </p>
                  <IntegerSolutionsInequalityViz />
                </div>
              </div>
            )}
          </div>
"""

if "currentLevel === 17" not in content:
    content = content.replace("          </div>\n        </div>", render_blocks + "        </div>")

with open("app/math_i_numbers/page.tsx", "w") as f:
    f.write(content)

print("Patched.")
