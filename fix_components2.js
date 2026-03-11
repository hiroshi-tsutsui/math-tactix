const fs = require('fs');
let content = fs.readFileSync('app/probability/components/CombinationRepetitionViz.tsx', 'utf8');

content = content.replace(/<Slider[\s\S]*?onValueChange={\(val\) => setN\(val\[0\]\)}[\s\S]*?\/>/g, '<input type="range" min="1" max="10" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />');

content = content.replace(/<Slider[\s\S]*?onValueChange={\(val\) => setR\(val\[0\]\)}[\s\S]*?\/>/g, '<input type="range" min="2" max="5" step="1" value={r} onChange={(e) => setR(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />');

fs.writeFileSync('app/probability/components/CombinationRepetitionViz.tsx', content);
