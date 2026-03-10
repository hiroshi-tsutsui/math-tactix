const fs = require('fs');
const file = 'app/sets_logic/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const contraVizCode = `
function ContrapositiveViz() {
  const [mode, setMode] = useState<"original" | "converse" | "inverse" | "contra">("original");

  const pSetColor = "bg-red-100 border-red-300 text-red-600";
  const qSetColor = "bg-blue-100 border-blue-300 text-blue-600";
  const notPSetColor = "bg-red-900 border-red-700 text-red-100";
  const notQSetColor = "bg-blue-900 border-blue-700 text-blue-100";

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <section className="shrink-0 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative h-[300px]">
          <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-slate-200/60 shadow-inner overflow-hidden relative flex items-center justify-center">
            
            {/* Base Diagram: P is inside Q */}
            {(mode === "original" || mode === "converse") && (
              <div className="relative w-48 h-48 rounded-full border-4 border-blue-300 bg-blue-100 flex items-start justify-center pt-4">
                <span className="text-blue-600 font-bold">Q</span>
                <div className="absolute bottom-4 w-24 h-24 rounded-full border-4 border-red-300 bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-bold">P</span>
                </div>
              </div>
            )}

            {/* Negation Diagram: not Q is inside not P */}
            {(mode === "inverse" || mode === "contra") && (
              <div className="relative w-full h-full bg-slate-100 flex items-center justify-center">
                <div className="absolute inset-0 border-[16px] border-slate-200"></div>
                <div className="relative w-64 h-64 rounded-full border-4 border-red-700 bg-red-900 flex items-start justify-center pt-4">
                  <span className="text-red-100 font-bold z-10">\\overline{P}</span>
                  <div className="absolute bottom-4 w-32 h-32 rounded-full border-4 border-blue-700 bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-100 font-bold">\\overline{Q}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-md mx-auto space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setMode("original")} className={\`p-4 rounded-xl border-2 font-bold \${mode === "original" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}\`}>
                      <div className="text-xs text-slate-400 mb-1">元の命題 (真)</div>
                      <MathComponent tex="P \\implies Q" />
                  </button>
                  <button onClick={() => setMode("converse")} className={\`p-4 rounded-xl border-2 font-bold \${mode === "converse" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}\`}>
                      <div className="text-xs text-slate-400 mb-1">逆 (必ずしも真ではない)</div>
                      <MathComponent tex="Q \\implies P" />
                  </button>
                  <button onClick={() => setMode("inverse")} className={\`p-4 rounded-xl border-2 font-bold \${mode === "inverse" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}\`}>
                      <div className="text-xs text-slate-400 mb-1">裏 (必ずしも真ではない)</div>
                      <MathComponent tex="\\overline{P} \\implies \\overline{Q}" />
                  </button>
                  <button onClick={() => setMode("contra")} className={\`p-4 rounded-xl border-2 font-bold \${mode === "contra" ? "border-slate-800 bg-slate-50 text-slate-900" : "border-slate-200 bg-white"}\`}>
                      <div className="text-xs text-slate-400 mb-1">対偶 (必ず真)</div>
                      <MathComponent tex="\\overline{Q} \\implies \\overline{P}" />
                  </button>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="space-y-4">
                      <h3 className="font-bold">命題と集合の包含関係</h3>
                      {mode === "original" && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          「<MathComponent tex="P \\implies Q" />」が真であるとは、集合Pが集合Qに完全に含まれている状態（<MathComponent tex="P \\subset Q" />）を指します。
                        </p>
                      )}
                      {mode === "converse" && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          「<MathComponent tex="Q \\implies P" />」は、QがPに含まれている状態ですが、図を見るとQの外側にはみ出る部分があるため、逆は必ずしも真になりません。
                        </p>
                      )}
                      {mode === "inverse" && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          「<MathComponent tex="\\overline{P} \\implies \\overline{Q}" />」は、Pの外側がQの外側に含まれるかですが、図でPの外側にQの部分が含まれているため、裏も必ずしも真になりません。
                        </p>
                      )}
                      {mode === "contra" && (
                        <p className="text-sm text-slate-600 leading-relaxed text-blue-700 font-bold bg-blue-50 p-4 rounded-lg">
                          「<MathComponent tex="\\overline{Q} \\implies \\overline{P}" />」は、Qの外側が完全にPの外側に含まれる状態です。図のように、「外側」を考えると包含関係が逆転するため、元の命題が真なら対偶も必ず真になります。
                        </p>
                      )}
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
}
`;

// Insert after NecessarySufficientViz
content = content.replace(
  'export default function SetsLogicPage',
  contraVizCode + '\nexport default function SetsLogicPage'
);

// We need to fix the JSX in string replacing to be exact because of katex syntax.
// Wait, katex backslashes in template literals: we need double backslashes in string literal definition.
// Wait, I did use double backslashes \\overline
// It looks fine.
fs.writeFileSync(file, content);
