import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const TasukigakeViz = () => {
  const [p, setP] = useState(1);
  const [q, setQ] = useState(2);
  const [r, setR] = useState(3);
  const [s, setS] = useState(4);

  const a = p * r;
  const c = q * s;
  const b = p * s + q * r;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-2">たすき掛けの視覚化</h3>
        <BlockMath math={`${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = (${p}x ${q >= 0 ? '+' : ''}${q})(${r}x ${s >= 0 ? '+' : ''}${s})`} />
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">係数 p (xの係数 1)</label>
            <input type="range" min="-10" max="10" step="1" value={p} onChange={(e) => setP(parseInt(e.target.value))} className="w-full accent-indigo-600" />
            <div className="text-center text-sm font-mono mt-1">{p}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">定数項 q (定数 1)</label>
            <input type="range" min="-10" max="10" step="1" value={q} onChange={(e) => setQ(parseInt(e.target.value))} className="w-full accent-indigo-600" />
            <div className="text-center text-sm font-mono mt-1">{q}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">係数 r (xの係数 2)</label>
            <input type="range" min="-10" max="10" step="1" value={r} onChange={(e) => setR(parseInt(e.target.value))} className="w-full accent-indigo-600" />
            <div className="text-center text-sm font-mono mt-1">{r}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">定数項 s (定数 2)</label>
            <input type="range" min="-10" max="10" step="1" value={s} onChange={(e) => setS(parseInt(e.target.value))} className="w-full accent-indigo-600" />
            <div className="text-center text-sm font-mono mt-1">{s}</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="relative w-48 h-32">
            <div className="absolute top-0 left-0 text-2xl font-bold font-mono text-indigo-700">{p}</div>
            <div className="absolute top-0 right-16 text-2xl font-bold font-mono text-emerald-600">{q}</div>
            
            <div className="absolute bottom-4 left-0 text-2xl font-bold font-mono text-indigo-700">{r}</div>
            <div className="absolute bottom-4 right-16 text-2xl font-bold font-mono text-emerald-600">{s}</div>

            {/* Cross Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: '1rem', top: '1rem', width: 'calc(100% - 4rem)', height: 'calc(100% - 2rem)' }}>
              <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="#cbd5e1" strokeWidth="2" />
            </svg>

            {/* Results */}
            <div className="absolute top-0 right-0 text-lg font-mono text-slate-600 flex items-center justify-end w-12">
              <span className="text-xs text-slate-400 mr-2">x</span>{q * r}
            </div>
            <div className="absolute bottom-4 right-0 text-lg font-mono text-slate-600 flex items-center justify-end w-12">
              <span className="text-xs text-slate-400 mr-2">x</span>{p * s}
            </div>
          </div>
          
          <div className="w-full border-t-2 border-slate-800 my-4"></div>
          
          <div className="w-full flex justify-between px-2">
            <div className="text-xl font-bold text-indigo-700 text-center w-8">
              <div className="text-xs text-slate-400 font-normal">a</div>
              {a}
            </div>
            <div className="text-xl font-bold text-emerald-600 text-center w-8">
              <div className="text-xs text-slate-400 font-normal">c</div>
              {c}
            </div>
            <div className="text-xl font-bold text-rose-600 text-center w-12">
              <div className="text-xs text-slate-400 font-normal">b</div>
              {b}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasukigakeViz;
