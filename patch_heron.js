const fs = require('fs');
let code = fs.readFileSync('app/trig_ratios/page.tsx', 'utf-8');

const heronViz = `
// --- Heron's Formula Viz (Level 12) ---
const HeronFormulaViz = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sideA, setSideA] = useState(5);
    const [sideB, setSideB] = useState(6);
    const [sideC, setSideC] = useState(7);

    // Calculate s and Area
    const s = (sideA + sideB + sideC) / 2;
    const areaSq = s * (s - sideA) * (s - sideB) * (s - sideC);
    const isValid = areaSq > 0 && sideA + sideB > sideC && sideB + sideC > sideA && sideC + sideA > sideB;
    const area = isValid ? Math.sqrt(areaSq) : 0;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!isValid) {
            ctx.fillStyle = "#ef4444";
            ctx.font = "bold 24px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("三角形が成立しません", canvas.width / 2, canvas.height / 2);
            return;
        }

        const cosC = (sideA*sideA + sideB*sideB - sideC*sideC) / (2 * sideA * sideB);
        const angleC = Math.acos(cosC);
        
        const scale = 30; // pixels per unit
        
        const cx = canvas.width / 2 - (sideA * scale) / 2;
        const cy = canvas.height / 2 + (Math.sin(angleC) * sideB * scale) / 2;

        const bx = cx + sideA * scale;
        const by = cy;

        const ax = cx + sideB * Math.cos(angleC) * scale;
        const ay = cy - sideB * Math.sin(angleC) * scale;

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fillStyle = "rgba(168, 85, 247, 0.1)";
        ctx.fill();

        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("a=" + sideA, (cx + bx) / 2, cy + 20);
        ctx.fillText("b=" + sideB, (cx + ax) / 2 - 10, (cy + ay) / 2 - 10);
        ctx.fillText("c=" + sideC, (ax + bx) / 2 + 10, (ay + by) / 2 - 10);

        ctx.fillStyle = "#a855f7";
        [ [ax,ay,"A"], [bx,by,"B"], [cx,cy,"C"] ].forEach(([x, y, label]) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });

    }, [sideA, sideB, sideC, isValid]);

    return (
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
            <div className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black">ヘロンの公式 (Heron's Formula)</h2>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold border border-purple-200">
                        Level 12
                    </span>
                </div>
                
                <div className="flex-1 relative min-h-[300px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                    <canvas ref={canvasRef} width={600} height={400} className="w-full h-full object-contain" />
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">辺 a</label>
                        <input type="range" min="1" max="15" step="1" value={sideA} onChange={(e) => setSideA(Number(e.target.value))} className="w-full accent-purple-500" />
                        <div className="text-center font-bold text-xl mt-2">{sideA}</div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">辺 b</label>
                        <input type="range" min="1" max="15" step="1" value={sideB} onChange={(e) => setSideB(Number(e.target.value))} className="w-full accent-purple-500" />
                        <div className="text-center font-bold text-xl mt-2">{sideB}</div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">辺 c</label>
                        <input type="range" min="1" max="15" step="1" value={sideC} onChange={(e) => setSideC(Number(e.target.value))} className="w-full accent-purple-500" />
                        <div className="text-center font-bold text-xl mt-2">{sideC}</div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-96 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/50">
                    <h3 className="font-bold flex items-center gap-2 text-blue-800 dark:text-blue-300 mb-4">
                        <Zap className="w-5 h-5" /> 面積の計算
                    </h3>
                    
                    {!isValid ? (
                        <div className="p-4 bg-red-100 text-red-700 rounded-xl font-bold text-center">
                            三角形の成立条件を満たしていません。<br/>(2辺の和 &gt; 他の1辺)
                        </div>
                    ) : (
                        <div className="space-y-4 text-slate-700 dark:text-slate-300">
                            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="text-sm font-bold text-slate-400 mb-2">1. s を求める</div>
                                <div className="text-center text-lg">
                                    <MathComponent tex={"s = \\\\frac{a+b+c}{2} = \\\\frac{" + sideA + "+" + sideB + "+" + sideC + "}{2} = " + s} />
                                </div>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="text-sm font-bold text-slate-400 mb-2">2. 面積 S を求める</div>
                                <div className="text-center text-lg">
                                    <MathComponent tex={"S = \\\\sqrt{s(s-a)(s-b)(s-c)}"} />
                                </div>
                                <div className="text-center text-lg mt-2">
                                    <MathComponent tex={"= \\\\sqrt{" + s + "(" + (s-sideA) + ")(" + (s-sideB) + ")(" + (s-sideC) + ")}"} />
                                </div>
                                <div className="text-center text-2xl font-black mt-4 text-purple-600">
                                    S ≈ {area.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-green-500" /> 学習のポイント
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        ヘロンの公式は、3辺の長さがわかっているときに、角度（cos や sin）を計算せずに直接面積を求められる強力な公式です。辺の長さが整数のときに特に威力を発揮します。
                    </p>
                </div>
            </div>
        </div>
    );
};
`;

code = code.replace(/const TrigEqIneqViz =/, heronViz + "\nconst TrigEqIneqViz =");

code = code.replace(
    `{ id: 11, title: "Level 11: 空間図形・測量", desc: "2地点からの仰角と高さ", icon: Target },
                      { id: 12, title: "Level 12: 実践演習", desc: "三角比の基礎マスター試験", icon: Trophy }`,
    `{ id: 11, title: "Level 11: 空間図形・測量", desc: "2地点からの仰角と高さ", icon: Target },
                      { id: 12, title: "Level 12: ヘロンの公式", desc: "3辺から面積を直接計算", icon: Target },
                      { id: 13, title: "Level 13: 実践演習", desc: "三角比の基礎マスター試験", icon: Trophy }`
);

code = code.replace(
    `{/* Level 10: Angle Bisector */}
      {level === 10 && (
          <AngleBisectorViz />
      )}

      {/* Level 11: Tactics Mode (Quiz) */}
      {level === 10 && (`,
    `{/* Level 10: Angle Bisector */}
      {level === 10 && (
          <AngleBisectorViz />
      )}

      {/* Level 11: Surveying */}
      {level === 11 && (
          <SurveyingViz />
      )}

      {/* Level 12: Heron's Formula */}
      {level === 12 && (
          <HeronFormulaViz />
      )}

      {/* Level 13: Tactics Mode (Quiz) */}
      {level === 13 && (`
);

fs.writeFileSync('app/trig_ratios/page.tsx', code);
