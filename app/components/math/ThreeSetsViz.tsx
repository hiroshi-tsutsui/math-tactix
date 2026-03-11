import React, { useState } from "react";

export default function ThreeSetsViz() {
  const [nA, setNA] = useState(30);
  const [nB, setNB] = useState(25);
  const [nC, setNC] = useState(20);
  const [nAB, setNAB] = useState(10);
  const [nBC, setNBC] = useState(8);
  const [nCA, setNCA] = useState(7);
  const [nABC, setNABC] = useState(3);

  const total = nA + nB + nC - nAB - nBC - nCA + nABC;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-bold text-slate-800">3つの集合の要素の個数</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center h-64 relative overflow-hidden">
          <div className="absolute w-32 h-32 rounded-full border-2 border-blue-500 bg-blue-100/50 flex items-center justify-center top-4 left-1/4 -translate-x-1/2">A: {nA}</div>
          <div className="absolute w-32 h-32 rounded-full border-2 border-red-500 bg-red-100/50 flex items-center justify-center top-4 right-1/4 translate-x-1/2">B: {nB}</div>
          <div className="absolute w-32 h-32 rounded-full border-2 border-green-500 bg-green-100/50 flex items-center justify-center bottom-4 left-1/2 -translate-x-1/2">C: {nC}</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold z-10">{nABC}</div>
        </div>
        
        <div className="bg-white p-4 rounded shadow-sm border space-y-2">
          <div className="text-sm text-slate-600 mb-2">式: n(A∪B∪C) = n(A) + n(B) + n(C) - n(A∩B) - n(B∩C) - n(C∩A) + n(A∩B∩C)</div>
          <div className="font-mono text-lg bg-slate-100 p-2 rounded">
            {total} = {nA} + {nB} + {nC} - {nAB} - {nBC} - {nCA} + {nABC}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">n(A) = {nA}</label>
            <input type="range" min="15" max="50" value={nA} onChange={(e) => setNA(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">n(B) = {nB}</label>
            <input type="range" min="15" max="50" value={nB} onChange={(e) => setNB(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">n(C) = {nC}</label>
            <input type="range" min="15" max="50" value={nC} onChange={(e) => setNC(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">n(A∩B) = {nAB}</label>
            <input type="range" min="0" max="20" value={nAB} onChange={(e) => setNAB(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">n(B∩C) = {nBC}</label>
            <input type="range" min="0" max="20" value={nBC} onChange={(e) => setNBC(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">n(C∩A) = {nCA}</label>
            <input type="range" min="0" max="20" value={nCA} onChange={(e) => setNCA(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">n(A∩B∩C) = {nABC}</label>
            <input type="range" min="0" max="10" value={nABC} onChange={(e) => setNABC(parseInt(e.target.value))} className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
