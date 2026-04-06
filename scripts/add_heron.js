const fs = require('fs');
const file = 'app/trig_ratios/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const heronViz = `
// --- Heron's Formula Viz (Level 12) ---
const HeronsFormulaViz = () => {
  const [a, setA] = useState(13);
  const [b, setB] = useState(14);
  const [c, setC] = useState(15);
  
  const s = (a + b + c) / 2;
  const areaSq = s * (s - a) * (s - b) * (s - c);
  const area = areaSq > 0 ? Math.sqrt(areaSq) : 0;
  
  const isValid = a + b > c && a + c > b && b + c > a;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
      <section className="shrink-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 relative h-[300px]">
        <div className="w-full max-w-md aspect-video bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-inner overflow-hidden relative">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <defs>
              <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6">
                <circle cx="5" cy="5" r="5" fill="#3B82F6" />
              </marker>
            </defs>
            {isValid ? (() => {
               // Draw a triangle given 3 side lengths
               // A at origin (0, 0), B at (c, 0), C at (x, y)
               const scale = 180 / Math.max(a, b, c);
               const visualC = c * scale;
               const visualA = a * scale;
               const visualB = b * scale;
               
               const cosA = (visualB * visualB + visualC * visualC - visualA * visualA) / (2 * visualB * visualC);
               const sinA = Math.sqrt(1 - cosA * cosA);
               
               const cx = visualB * cosA;
               const cy = visualB * sinA;
               
               const offsetX = (400 - visualC) / 2;
               const offsetY = 200 - (200 - cy) / 2; // Center vertically somewhat
               
               return (
                 <g transform={\`translate(\${offsetX}, \${offsetY})\`}>
                    <path d={\`M 0 0 L \${visualC} 0 L \${cx} \${-cy} Z\`} fill="rgba(59, 130, 246, 0.1)" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
                    
                    <text x={visualC/2} y={15} fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">c = {c}</text>
                    <text x={cx/2 - 10} y={-cy/2} fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">b = {b}</text>
                    <text x={(cx + visualC)/2 + 10} y={-cy/2} fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">a = {a}</text>
                 </g>
               );
            })() : (
               <text x="200" y="100" fontSize="14" fill="#ef4444" textAnchor="middle">三角形が成立しません</text>
            )}
          </svg>
        </div>
      </section>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">辺 a: {a}</label>
              <input type="range" min="1" max="30" value={a} onChange={e => setA(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">辺 b: {b}</label>
              <input type="range" min="1" max="30" value={b} onChange={e => setB(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">辺 c: {c}</label>
              <input type="range" min="1" max="30" value={c} onChange={e => setC(Number(e.target.value))} className="w-full accent-blue-500" />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
            <h3 className="font-bold flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-blue-500" /> ヘロンの公式 (Heron's Formula)</h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">s = (a + b + c) / 2</span>
                <span className="font-bold text-blue-600">s = {s}</span>
              </div>
              <div className="flex flex-col bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 mb-1">S = √[s(s-a)(s-b)(s-c)]</span>
                {isValid ? (
                  <span className="font-bold text-blue-600">S = √[{s}({s-a})({s-b})({s-c})] = {area % 1 === 0 ? area : area.toFixed(2)}</span>
                ) : (
                  <span className="font-bold text-red-500">三角形不成立</span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              三辺の長さから直接面積を求める公式です。「半周」である <MathComponent tex="s" /> を使うことで、シンプルに計算できます。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
`;

content = content.replace('// --- Angle Bisector Viz (Level 11) ---', heronViz + '\n\n// --- Angle Bisector Viz (Level 11) ---');

fs.writeFileSync(file, content);
