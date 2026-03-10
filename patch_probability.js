const fs = require('fs');

let file = fs.readFileSync('app/probability/page.tsx', 'utf8');

// Insert level 4 drawing logic
const level4Drawing = `
      // Level 4: Independent Trials
      if (level === 4) {
          const dy = 30;
          const dx = 40;
          const startY = oy - 120;
          const p = probA;
          
          ctx.font = "12px Geist Sans";
          ctx.textAlign = "center";
          
          for (let i = 0; i <= n; i++) {
              for (let j = 0; j <= i; j++) {
                  const nodeX = ox + (j * dx) - ((i - j) * dx);
                  const nodeY = startY + i * dy;
                  
                  // Draw connections
                  if (i < n) {
                      const leftX = ox + (j * dx) - ((i + 1 - j) * dx);
                      const rightX = ox + ((j + 1) * dx) - ((i - j) * dx);
                      const nextY = startY + (i + 1) * dy;
                      
                      // Left (Failure)
                      ctx.beginPath();
                      ctx.moveTo(nodeX, nodeY);
                      ctx.lineTo(leftX, nextY);
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.lineWidth = 1;
                      ctx.stroke();
                      
                      // Right (Success)
                      ctx.beginPath();
                      ctx.moveTo(nodeX, nodeY);
                      ctx.lineTo(rightX, nextY);
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.stroke();
                  }
                  
                  // Draw Node
                  ctx.beginPath();
                  ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
                  const isTarget = i === n && j === r;
                  ctx.fillStyle = isTarget ? colors.primary : colors.bg;
                  ctx.fill();
                  ctx.strokeStyle = isTarget ? colors.primary : colors.secondary;
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  
                  if (isTarget) {
                     ctx.fillStyle = colors.text;
                     ctx.fillText(\`\${n}C\${r}\`, nodeX, nodeY + 20);
                  }
              }
          }
          
          // Explain
          ctx.font = "16px Geist Sans";
          ctx.fillStyle = colors.text;
          ctx.fillText(\`\${n}回中 \${r}回 成功する確率\`, ox, startY + n * dy + 60);
          ctx.font = "14px Geist Sans";
          ctx.fillStyle = colors.secondary;
          ctx.fillText(\`\${n}C\${r} × p^\${r} × (1-p)^\${n-r}\`, ox, startY + n * dy + 85);
      }
`;

// Find where level 3 drawing ends
let drawRegex = /(ctx\.setLineDash\(\[\]\);\s*\}\s*)\}\s*;\s*render\(\);/s;
file = file.replace(drawRegex, `$1${level4Drawing}\n    };\n    render();`);

// Insert level 4 to menu
file = file.replace(
  '{ id: 3, title: "Level 3: 条件付き確率", desc: "事象Bが起こった時の事象Aの確率", icon: Target }',
  '{ id: 3, title: "Level 3: 条件付き確率", desc: "事象Bが起こった時の事象Aの確率", icon: Target },\n                      { id: 4, title: "Level 4: 反復試行の確率", desc: "同じ試行をn回繰り返す確率", icon: Activity }'
);

// Level 4 controls
const level4Controls = `
                    {level === 4 && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>試行回数 (n): {n}</span>
                                </div>
                                <input type="range" min="1" max="8" step="1" value={n} 
                                    onChange={e => dispatch({type: 'SET_N', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>成功回数 (r): {r}</span>
                                </div>
                                <input type="range" min="0" max={n} step="1" value={r} 
                                    onChange={e => dispatch({type: 'SET_R', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>1回の成功確率 (p): {probA.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0.1" max="0.9" step="0.1" value={probA} 
                                    onChange={e => dispatch({type: 'SET_PROBA', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-black cursor-pointer" />
                            </div>
                        </div>
                    )}
`;

let controlRegex = /(\{level === 3 && \(\s*<div className="space-y-4">.*?\s*<\/div>\s*\)\})/;
// Not easy, let's just insert before {level === 3 && ...
file = file.replace(
  "{level === 3 && (",
  `${level4Controls}\n                    {level === 3 && (`
);

fs.writeFileSync('app/probability/page.tsx', file);
