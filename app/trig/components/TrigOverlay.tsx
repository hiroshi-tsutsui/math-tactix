"use client";

import React from 'react';

interface TrigOverlayProps {
  level: number;
  angle: number;
  sinVal: string;
  cosVal: string;
  sinSq: string;
  cosSq: string;
  // Level 4
  sideA: string;
  radiusVal: number;
  diameter: string;
  ratioCalc: string;
  // Level 5
  sideB_val: number;
  sideC_val: number;
  sideA_val: string;
  // Level 6
  area_b: number;
  area_c: number;
  area_sinA: number;
  area_S: string;
}

export default function TrigOverlay({
  level,
  angle,
  sinVal,
  cosVal,
  sinSq,
  cosSq,
  sideA,
  radiusVal,
  diameter,
  ratioCalc,
  sideB_val,
  sideC_val,
  sideA_val,
  area_b,
  area_c,
  area_sinA,
  area_S,
}: TrigOverlayProps) {
  return (
    <>
      {/* Level 3 Overlay: Pythagorean Identity */}
      {level === 3 && (
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Pythagorean Identity</div>
          <div className="flex flex-col gap-1 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="text-blue-500 font-bold">cos²{angle}°</span>
              <span>+</span>
              <span className="text-red-500 font-bold">sin²{angle}°</span>
              <span>=</span>
              <span className="font-bold">1</span>
            </div>
            <div className="text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              {cosSq} + {sinSq} ≈ 1.000
            </div>
          </div>
        </div>
      )}

      {/* Level 4 Overlay: Sine Rule */}
      {level === 4 && (
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Sine Rule</div>
          <div className="flex flex-col gap-1 text-sm font-mono">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-500 font-bold">a / sin A</span>
              <span>=</span>
              <span className="font-bold">2R</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
              <div>a = {sideA}</div>
              <div>R = {radiusVal}</div>
              <div>sin A = {sinVal}</div>
              <div>2R = {diameter}</div>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              {sideA} / {sinVal} ≈ {ratioCalc}
            </div>
          </div>
        </div>
      )}

      {/* Level 5 Overlay: Cosine Rule */}
      {level === 5 && (
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Cosine Rule</div>
          <div className="flex flex-col gap-1 text-sm font-mono">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-secondary font-bold">a²</span>
              <span>=</span>
              <span className="font-bold">b² + c² - 2bc cosA</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
              <div>b = {sideB_val}</div>
              <div>c = {sideC_val}</div>
              <div>cos {angle}° = {cosVal}</div>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              a² = {sideB_val}² + {sideC_val}² - {2*sideB_val*sideC_val}({cosVal})
            </div>
            <div className="text-sm font-bold text-red-500 mt-1">
              a = {sideA_val}
            </div>
          </div>
        </div>
      )}

      {/* Level 6 Overlay: Area */}
      {level === 6 && (
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Triangle Area</div>
          <div className="flex flex-col gap-1 text-sm font-mono">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-secondary font-bold">S</span>
              <span>=</span>
              <span className="font-bold">1/2 bc sin A</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
              <div>b = {area_b}</div>
              <div>c = {area_c}</div>
              <div>sin A = {area_sinA.toFixed(2)}</div>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              S = 1/2 × {area_b} × {area_c} × {area_sinA.toFixed(2)}
            </div>
            <div className="text-sm font-bold text-green-500 mt-1">
              Area = {area_S}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
