const fs = require('fs');
const path = require('path');

const code = `
"use client";
import React, { useState } from 'react';

export default function RightTriangleRectangleViz() {
  const [x, setX] = useState(2);
  const base = 4;
  const height = 4;
  
  const rectHeight = height - (height / base) * x;
  const area = x * rectHeight;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm text-black my-4">
      <h3 className="text-lg font-bold mb-2">直角三角形に内接する長方形の面積の最大値</h3>
      <p className="text-sm mb-4">底辺4, 高さ4の直角三角形に内接する長方形の面積を最大化します。</p>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-64 h-64 border-b-2 border-l-2 border-gray-400 bg-gray-50">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 0,100 100,100" fill="rgba(200,200,255,0.3)" stroke="blue" strokeWidth="2" />
            <rect 
              x="0" 
              y={100 - (rectHeight / height) * 100} 
              width={(x / base) * 100} 
              height={(rectHeight / height) * 100} 
              fill="rgba(255,100,100,0.5)" 
              stroke="red" 
              strokeWidth="2" 
            />
          </svg>
        </div>
        
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold mb-1">長方形の幅 x: {x.toFixed(1)}</label>
          <input 
            type="range" 
            min="0" 
            max="4" 
            step="0.1" 
            value={x} 
            onChange={(e) => setX(parseFloat(e.target.value))} 
            className="w-full mb-4 cursor-pointer"
          />
          <div className="bg-gray-100 p-3 rounded mb-2">
            <p className="text-sm">高さ y = 4 - x : <strong>{rectHeight.toFixed(1)}</strong></p>
            <p className="text-sm">面積 S = x(4 - x) : <strong className="text-red-600 text-lg">{area.toFixed(2)}</strong></p>
          </div>
          <p className="text-xs text-gray-600">
            xを変化させ、面積Sがいつ最大になるか確認しましょう。<br/>
            S = -x² + 4x = -(x-2)² + 4 より、x=2 のとき最大値 4 です。
          </p>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(process.cwd(), 'components/RightTriangleRectangleViz.tsx'), code);

const pagePath = path.join(process.cwd(), 'app/quadratics/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');
if (!page.includes('RightTriangleRectangleViz')) {
  page = page.replace(
    'import QuadraticInequalityGraphViz from "../../components/QuadraticInequalityGraphViz";',
    'import QuadraticInequalityGraphViz from "../../components/QuadraticInequalityGraphViz";\nimport RightTriangleRectangleViz from "../../components/RightTriangleRectangleViz";'
  );
  
  const sectionStr = `
          {activeSection === "level49" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Level 49: 2次不等式の解とグラフの関係</h2>
              <QuadraticInequalityGraphViz />
            </div>
          )}
  `;
  
  const newSectionStr = `
          {activeSection === "level49" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Level 49: 2次不等式の解とグラフの関係</h2>
              <QuadraticInequalityGraphViz />
            </div>
          )}

          {activeSection === "level50" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Level 50: 直角三角形に内接する長方形の面積の最大値</h2>
              <RightTriangleRectangleViz />
            </div>
          )}
  `;
  
  page = page.replace(sectionStr, newSectionStr);
  
  // add level 50 to menu
  page = page.replace(
    '{ id: "level49", title: "Level 49: 2次不等式の解とグラフの関係" }',
    '{ id: "level49", title: "Level 49: 2次不等式の解とグラフの関係" },\n    { id: "level50", title: "Level 50: 2次関数の最大・最小の応用 (図形)" }'
  );
  
  fs.writeFileSync(pagePath, page);
  console.log('Updated app/quadratics/page.tsx');
}
