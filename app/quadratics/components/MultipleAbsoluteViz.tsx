import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Maximize2, RefreshCw } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathComponent = ({ tex, className = "" }: { tex: string; className?: string }) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        if (containerRef.current) {
            katex.render(tex, containerRef.current, { throwOnError: false, displayMode: false });
        }
    }, [tex]);
    return <span ref={containerRef} className={className} />;
};

export default function MultipleAbsoluteViz() {
    const [a, setA] = useState(-2);
    const [b, setB] = useState(2);
    const [k, setK] = useState(5);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const scaleX = w / 12;
        const scaleY = h / 12;
        const offsetX = w / 2;
        const offsetY = h - 20; // y=0 is near the bottom

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let i = -6; i <= 6; i++) {
            ctx.beginPath();
            ctx.moveTo(offsetX + i * scaleX, 0);
            ctx.lineTo(offsetX + i * scaleX, h);
            ctx.stroke();
        }
        for (let i = 0; i <= 12; i++) {
            ctx.beginPath();
            ctx.moveTo(0, offsetY - i * scaleY);
            ctx.lineTo(w, offsetY - i * scaleY);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(w, offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, h);
        ctx.stroke();

        const a1 = Math.min(a, b);
        const a2 = Math.max(a, b);

        // Draw f(x) = |x - a| + |x - b|
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = -6; x <= 6; x += 0.1) {
            const y = Math.abs(x - a1) + Math.abs(x - a2);
            const px = offsetX + x * scaleX;
            const py = offsetY - y * scaleY;
            if (x === -6) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Draw y = k
        const ky = offsetY - k * scaleY;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, ky);
        ctx.lineTo(w, ky);
        ctx.stroke();

        // Intersections
        const solutions = [];
        const minY = a2 - a1; // Minimum value of |x - a1| + |x - a2| is |a1 - a2|
        
        ctx.fillStyle = '#10b981';
        if (k > minY) {
            // Two solutions: x = (k + a1 + a2)/2 and x = (-k + a1 + a2)/2
            const sol1 = (a1 + a2 - k) / 2;
            const sol2 = (a1 + a2 + k) / 2;
            solutions.push(sol1, sol2);
        } else if (k === minY) {
            // Infinite solutions between a1 and a2. We'll just highlight the segment.
            ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
            ctx.fillRect(offsetX + a1 * scaleX, ky - 4, (a2 - a1) * scaleX, 8);
        }

        solutions.forEach(sol => {
            const px = offsetX + sol * scaleX;
            ctx.beginPath();
            ctx.arc(px, ky, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Dashed line to x-axis
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = '#10b981';
            ctx.beginPath();
            ctx.moveTo(px, ky);
            ctx.lineTo(px, offsetY);
            ctx.stroke();
            ctx.setLineDash([]);
        });

    }, [a, b, k]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-500" />
                複数の絶対値と直線の交点
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="relative aspect-video bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                        <canvas ref={canvasRef} width={800} height={450} className="w-full h-full" />
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex justify-center text-lg">
                        <MathComponent tex={`y = |x - (${a})| + |x - (${b})|`} />
                        <span className="mx-4 text-slate-400">vs</span>
                        <MathComponent tex={`y = ${k}`} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="text-sm font-bold text-slate-700 block mb-2">定数 a (左の折れ目)</label>
                        <input type="range" min="-5" max={b - 1} step="1" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-blue-500" />
                        <div className="text-right text-xs text-slate-500 font-mono mt-1">a = {a}</div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="text-sm font-bold text-slate-700 block mb-2">定数 b (右の折れ目)</label>
                        <input type="range" min={a + 1} max="5" step="1" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-blue-500" />
                        <div className="text-right text-xs text-slate-500 font-mono mt-1">b = {b}</div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <label className="text-sm font-bold text-red-700 block mb-2">直線 y = k</label>
                        <input type="range" min="0" max="10" step="1" value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-red-500" />
                        <div className="text-right text-xs text-red-500 font-mono mt-1">k = {k}</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <h4 className="font-bold text-green-800 mb-2 text-sm">解の個数と視覚的意味</h4>
                        <p className="text-xs text-green-700 leading-relaxed mb-2">
                            このグラフは、底が平らな「バケツ型」になります。底の高さは <MathComponent tex={`|a - b| = ${Math.abs(a - b)}`} /> です。
                        </p>
                        <ul className="text-xs text-green-700 space-y-1 list-disc pl-4">
                            <li>k &lt; {Math.abs(a - b)} のとき: 共有点なし (0個)</li>
                            <li>k = {Math.abs(a - b)} のとき: 底と重なる (無数に存在)</li>
                            <li>k &gt; {Math.abs(a - b)} のとき: 左右の斜面と交わる (2個)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
