const fs = require('fs');
let code = fs.readFileSync('app/probability/page.tsx', 'utf-8');

// Fix Level 4 duplication in menu
code = code.replace(
`{ id: 4, title: "Level 4: 反復試行の確率", desc: "同じ試行をn回繰り返す確率", icon: Activity },
                      { id: 4, title: "Level 4: 反復試行の確率", desc: "同じ試行をn回繰り返す確率", icon: Activity }`,
`{ id: 4, title: "Level 4: 反復試行の確率", desc: "同じ試行をn回繰り返す確率", icon: Activity },
                      { id: 5, title: "Level 5: 最大値の確率", desc: "さいころの最大値がkになる確率", icon: Trophy }`
);

// Add visual engine for Level 5
const visualLevel5 = `
      // Level 5: Maximum Value Probability (n=2 dice)
      if (level === 5) {
          const faces = 6;
          const k = r || 4; // use r as the target max value
          const cellSize = 30;
          const startX = ox - (faces * cellSize) / 2;
          const startY = oy - (faces * cellSize) / 2;
          
          ctx.font = "12px Geist Sans";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          for (let i = 1; i <= faces; i++) {
              for (let j = 1; j <= faces; j++) {
                  const x = startX + (i - 1) * cellSize;
                  const y = startY + (faces - j) * cellSize; // y axis goes up
                  
                  ctx.beginPath();
                  ctx.rect(x, y, cellSize, cellSize);
                  
                  // Logic for max value
                  const cellMax = Math.max(i, j);
                  
                  if (cellMax === k) {
                      ctx.fillStyle = 'rgba(0, 122, 255, 0.2)'; // target "exactly k"
                      ctx.fill();
                      ctx.strokeStyle = colors.primary;
                      ctx.lineWidth = 2;
                  } else if (cellMax < k) {
                      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // inside "less than k"
                      ctx.fill();
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.lineWidth = 1;
                  } else {
                      ctx.fillStyle = '#ffffff'; // outside
                      ctx.fill();
                      ctx.strokeStyle = colors.itemBorder;
                      ctx.lineWidth = 1;
                  }
                  
                  ctx.stroke();
                  
                  if (cellMax <= k) {
                      ctx.fillStyle = cellMax === k ? colors.primary : colors.text;
                      ctx.fillText(cellMax.toString(), x + cellSize/2, y + cellSize/2);
                  }
              }
          }
          
          // Labels
          ctx.font = "bold 14px Geist Sans";
          ctx.fillStyle = colors.text;
          ctx.fillText("サイコロ 1", ox, startY + faces * cellSize + 20);
          
          ctx.save();
          ctx.translate(startX - 20, oy);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText("サイコロ 2", 0, 0);
          ctx.restore();
          
          // Explain text
          ctx.font = "14px Geist Sans";
          ctx.fillStyle = colors.primary;
          ctx.fillText(\`最大値が \${k} になる組み合わせ: \${k*k - (k-1)*(k-1)}通り\`, ox, startY - 20);
      }
`;

code = code.replace(`if (level === 4) {`, visualLevel5 + `\n      if (level === 4) {`);

// Add UI controls for Level 5
const uiControlsLevel5 = `
                    {level === 5 && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>目標の最大値 (k): {r || 4}</span>
                                </div>
                                <input type="range" min="1" max="6" step="1" value={r || 4} 
                                    onChange={e => dispatch({type: 'SET_R', payload: Number(e.target.value)})} 
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none accent-blue-500 cursor-pointer" />
                            </div>
                        </div>
                    )}
`;
code = code.replace(`{level === 4 && (`, uiControlsLevel5 + `\n                    {level === 4 && (`);

// Add Explanations for Level 4 and 5
const explanations = `
                        {level === 4 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-purple-500" /> 反復試行の確率</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    確率 <MathComponent tex="p" /> の事象が、<MathComponent tex="n" /> 回中ちょうど <MathComponent tex="r" /> 回起こる確率です。
                                    「どのタイミングで成功するか」の選び方が <MathComponent tex="{}_{n}\\mathrm{C}_{r}" /> 通りあるため、これを掛け合わせます。
                                </p>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                                    <MathComponent tex="{}_{n}\\mathrm{C}_{r} \\times p^r \\times (1-p)^{n-r}" className="text-xl font-bold text-purple-700 block mb-2" />
                                </div>
                            </div>
                        )}
                        
                        {level === 5 && (
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2"><Trophy className="w-4 h-4 text-blue-500" /> 最大値の確率</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    2個のサイコロを投げて、<strong>最大値がちょうど k</strong> になる確率を求めます。
                                    これは「最大値が k 以下」の正方形の面積から、「最大値が k-1 以下」の正方形の面積を引くことで視覚的に求められます（L字型の部分）。
                                </p>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                    <MathComponent tex="P(\\text{最大値} = k) = \\frac{k^2 - (k-1)^2}{6^2}" className="text-lg font-bold text-blue-700 block mb-2" />
                                    <span className="text-xs text-blue-600">kの面積 から (k-1)の面積 を引く</span>
                                </div>
                            </div>
                        )}
`;
code = code.replace(`{level === 3 && (
                            <div className="space-y-4">`, explanations + `\n                        {level === 3 && (
                            <div className="space-y-4">`);

fs.writeFileSync('app/probability/page.tsx', code);
console.log('patched probability page');
