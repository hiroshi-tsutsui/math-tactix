const fs = require('fs');
let content = fs.readFileSync('app/probability/components/CombinationRepetitionViz.tsx', 'utf8');

content = content.replace("import { Button } from '@/components/ui/button';", "");
content = content.replace("import { Card } from '@/components/ui/card';", "");
content = content.replace("import { Slider } from '@/components/ui/slider';", "");

content = content.replace(
  /<Button/g, 
  '<button className="px-4 py-2 font-semibold rounded-lg"'
).replace(/<\/Button>/g, '</button>');

content = content.replace(
  /<Slider\s+value={\[n\]}\s+min={1}\s+max={10}\s+step={1}\s+onValueChange={\(val\) => setN\(val\[0\]\)}\s+className="w-full"\s+\/>/g,
  '<input type="range" min="1" max="10" step="1" value={n} onChange={(e) => setN(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />'
);

content = content.replace(
  /<Slider\s+value={\[r\]}\s+min={2}\s+max={5}\s+step={1}\s+onValueChange={\(val\) => setR\(val\[0\]\)}\s+className="w-full"\s+\/>/g,
  '<input type="range" min="2" max="5" step="1" value={r} onChange={(e) => setR(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />'
);

fs.writeFileSync('app/probability/components/CombinationRepetitionViz.tsx', content);
console.log("Fixed components.");
