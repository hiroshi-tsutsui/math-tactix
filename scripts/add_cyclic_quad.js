const fs = require('fs');
const file = 'app/trig_ratios/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The new component to inject
const componentCode = `
// --- Cyclic Quadrilateral Viz (Level 13) ---
const CyclicQuadrilateralViz = () => {
  const [angleA, setAngleA] = useState(210);
  const [angleB, setAngleB] = useState(150);
  const [angleC, setAngleC] = useState(30);
  const [angleD, setAngleD] = useState(330);
  
  const R = 100;
  const cx = 150;
  const cy = 150;

  const toRad = (deg) => deg * Math.PI / 180;
  
  // Get coordinates
  const getPoint = (ang) => ({
    x: cx + R * Math.cos(toRad(ang)),
    y: cy - R * Math.sin(toRad(ang)) // SVG y is down
  });

  const ptA = getPoint(angleA);
  const ptB = getPoint(angleB);
  const ptC = getPoint(angleC);
  const ptD = getPoint(angleD);

  // Calculate side lengths
  const dist = (p1, p2) => Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
  const a = dist(ptA, ptB);
  const b = dist(ptB, ptC);
  const c = dist(ptC, ptD);
  const d = dist(ptD, ptA);
  const diagAC = dist(ptA, ptC);

  // Calculate interior angles
  const calcAngle = (p1, p2, p3) => {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x**2 + v1.y**2);
    const mag2 = Math.sqrt(v2.x**2 + v2.y**2);
    const cosTheta = dot / (mag1 * mag2);
    return Math.acos(cosTheta) * 180 / Math.PI;
  };

  const intB = calcAngle(ptA, ptB, ptC);
  const intD = calcAngle(ptC, ptD, ptA);

  const formatSide = (val) => (val/50).toFixed(1);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-4 bg-white text-gray-800 rounded-lg shadow w-full max-w-4xl mx-auto space-y-6 md:space-y-0 md:space-x-8">
      
      <div className="relative border border-gray-300 bg-slate-50 w-[300px] h-[300px] flex-shrink-0">
        <svg width="300" height="300">
          <circle cx={cx} cy={cy} r={R} stroke="#cbd5e1" strokeWidth="2" fill="none" />
          
          {/* Polygon */}
          <polygon points={\`\${ptA.x},\${ptA.y} \${ptB.x},\${ptB.y} \${ptC.x},\${ptC.y} \${ptD.x},\${ptD.y}\`} fill="#bfdbfe" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
          
          {/* Diagonal */}
          <line x1={ptA.x} y1={ptA.y} x2={ptC.x} y2={ptC.y} stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Points */}
          <circle cx={ptA.x} cy={ptA.y} r="5" fill="#1e40af" />
          <text x={ptA.x - 15} y={ptA.y - 10} fontSize="14" fontWeight="bold">A</text>
          
          <circle cx={ptB.x} cy={ptB.y} r="5" fill="#1e40af" />
          <text x={ptB.x - 15} y={ptB.y + 20} fontSize="14" fontWeight="bold">B</text>
          
          <circle cx={ptC.x} cy={ptC.y} r="5" fill="#1e40af" />
          <text x={ptC.x + 10} y={ptC.y + 15} fontSize="14" fontWeight="bold">C</text>
          
          <circle cx={ptD.x} cy={ptD.y} r="5" fill="#1e40af" />
          <text x={ptD.x + 10} y={ptD.y - 10} fontSize="14" fontWeight="bold">D</text>

          {/* Angles */}
          <text x={ptB.x + (cx - ptB.x)*0.2} y={ptB.y + (cy - ptB.y)*0.2} fontSize="12" fill="#d97706">{intB.toFixed(1)}°</text>
          <text x={ptD.x + (cx - ptD.x)*0.2} y={ptD.y + (cy - ptD.y)*0.2} fontSize="12" fill="#d97706">{intD.toFixed(1)}°</text>

          {/* Sides */}
          <text x={(ptA.x+ptB.x)/2 - 15} y={(ptA.y+ptB.y)/2} fontSize="12" fill="#059669">a={formatSide(a)}</text>
          <text x={(ptB.x+ptC.x)/2 + 5} y={(ptB.y+ptC.y)/2 + 15} fontSize="12" fill="#059669">b={formatSide(b)}</text>
          <text x={(ptC.x+ptD.x)/2 + 10} y={(ptC.y+ptD.y)/2 - 5} fontSize="12" fill="#059669">c={formatSide(c)}</text>
          <text x={(ptD.x+ptA.x)/2 - 15} y={(ptD.y+ptA.y)/2 - 10} fontSize="12" fill="#059669">d={formatSide(d)}</text>

        </svg>

        {/* Sliders for angles */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1 bg-white/80 p-1 rounded text-xs">
          <label>A: <input type="range" min="180" max="270" value={angleA} onChange={(e)=>setAngleA(Number(e.target.value))} className="w-16"/></label>
          <label>B: <input type="range" min="90" max="179" value={angleB} onChange={(e)=>setAngleB(Number(e.target.value))} className="w-16"/></label>
          <label>C: <input type="range" min="0" max="89" value={angleC} onChange={(e)=>setAngleC(Number(e.target.value))} className="w-16"/></label>
          <label>D: <input type="range" min="271" max="359" value={angleD} onChange={(e)=>setAngleD(Number(e.target.value))} className="w-16"/></label>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h4 className="font-bold text-lg mb-2 text-blue-700">円に内接する四角形</h4>
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-4 text-sm">
          <p className="font-semibold text-orange-800 mb-1">向かい合う角の和は180°</p>
          <p>∠B + ∠D = {intB.toFixed(1)}° + {intD.toFixed(1)}° = <strong>{(intB + intD).toFixed(1)}°</strong></p>
          <p className="mt-1">これにより、<MathComponent tex="\\cos D = \\cos(180^\\circ - B) = -\\cos B" /></p>
          <p>面積では、<MathComponent tex="\\sin D = \\sin(180^\\circ - B) = \\sin B" /></p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
          <p className="font-semibold text-gray-700 mb-1">対角線 AC を2通りで表す（余弦定理）</p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li>△ABC: <MathComponent tex="AC^2 = a^2 + b^2 - 2ab \\cos B" /></li>
            <li>△ADC: <MathComponent tex="AC^2 = c^2 + d^2 - 2cd \\cos D" /></li>
          </ul>
          <p className="text-blue-600 bg-blue-50 p-2 rounded">
            <MathComponent tex="a^2 + b^2 - 2ab \\cos B = c^2 + d^2 + 2cd \\cos B" />
          </p>
          <p className="mt-2 text-xs text-gray-500">この等式を解くことで cos B を求め、四角形の面積や対角線の長さを計算します。</p>
        </div>
      </div>
    </div>
  );
};
`;

// Insert the component before the final export default function Page()
content = content.replace('export default function TrigRatiosPage() {', componentCode + '\nexport default function TrigRatiosPage() {');

// Add level 13 to the sidebar levels
const levelsString = `
                      { id: 11, title: "Level 11: 空間図形・測量", desc: "2地点からの仰角と高さ", icon: Target },
                      { id: 12, title: "Level 12: ヘロンの公式", desc: "三辺から面積を直接求める", icon: Target },
                      { id: 13, title: "Level 13: 円に内接する四角形", desc: "向かい合う角と余弦定理", icon: Target },
                      { id: 14, title: "Level 14: 実践演習", desc: "三角比の基礎マスター試験", icon: Trophy }
`;

content = content.replace(/\{ id: 11,.*?\n\s*\{ id: 12,.*?\n\s*\{ id: 13,.*?/, levelsString.trim());

// Render component when level === 13
const contentSwitch = `
        {level === 12 && (
          <HeronsFormulaViz />
        )}
        {level === 13 && (
          <CyclicQuadrilateralViz />
        )}
`;
content = content.replace(/\{\s*level === 12 && \([\s\S]*?<\/\s*div>\s*\)\s*\}/, contentSwitch + '\n        </div>\n      )');


// Save
fs.writeFileSync(file, content);
console.log('Successfully patched trig_ratios/page.tsx with Cyclic Quadrilateral Viz');
