import React, { useRef, useEffect, useState } from 'react';

const ProfitMaximizationViz = () => {
  const [priceChange, setPriceChange] = useState(0); 
  
  const basePrice = 100;
  const baseSales = 1000;
  const priceInc = 10;
  const salesDrop = 50;

  const currentPrice = basePrice + priceChange * priceInc;
  const currentSales = baseSales - priceChange * salesDrop;
  const profit = currentPrice * currentSales;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    const mapX = (x: number) => (x + 10) * (w / 30);
    const mapY = (y: number) => h - (y / 120000) * h * 0.9;

    ctx.beginPath();
    ctx.moveTo(0, mapY(0)); ctx.lineTo(w, mapY(0)); 
    ctx.moveTo(mapX(0), 0); ctx.lineTo(mapX(0), h); 
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6'; 
    ctx.lineWidth = 2;
    for (let x = -10; x <= 20; x += 0.5) {
      const p = (100 + 10*x)*(1000 - 50*x);
      if (x === -10) ctx.moveTo(mapX(x), mapY(p));
      else ctx.lineTo(mapX(x), mapY(p));
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mapX(5), mapY(112500), 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; 
    ctx.fill();

    ctx.beginPath();
    ctx.arc(mapX(priceChange), mapY(profit), 6, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981'; 
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.stroke();

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#9ca3af';
    ctx.beginPath();
    ctx.moveTo(mapX(priceChange), mapY(profit));
    ctx.lineTo(mapX(priceChange), mapY(0));
    ctx.moveTo(mapX(priceChange), mapY(profit));
    ctx.lineTo(mapX(0), mapY(profit));
    ctx.stroke();
    ctx.setLineDash([]);
  }, [priceChange, profit]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b dark:border-slate-700 pb-2">利益の最大化 (文章題への応用)</h3>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mb-6 border border-slate-100 dark:border-slate-700/50">
        <p className="text-slate-700 dark:text-slate-300 font-medium mb-2 leading-relaxed">
          ある商品を100円で売ると、1日に1000個売れる。<br/>
          価格を10円値上げするごとに、売上個数は50個減る。<br/>
          利益（売上金額）を最大にするには、価格をいくらにすればよいか。
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          値上げの回数を <span className="font-semibold text-slate-700 dark:text-slate-300">x</span> 回とすると：<br/>
          価格 = <span className="text-blue-600 dark:text-blue-400">100 + 10x</span> (円)<br/>
          売上個数 = <span className="text-indigo-600 dark:text-indigo-400">1000 - 50x</span> (個)<br/>
          利益 = (100 + 10x)(1000 - 50x)
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 flex justify-center">
          <canvas 
            ref={canvasRef} 
            width={320} 
            height={240} 
            className="border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 shadow-inner w-full max-w-[320px]" 
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">値上げ回数 (x): {priceChange}回</label>
              <span className="text-sm text-slate-500 dark:text-slate-500">{-10} から {20}</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="20" 
              step="1"
              value={priceChange} 
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full accent-blue-600 dark:accent-blue-500"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">販売価格</span>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{currentPrice} <span className="text-sm font-normal">円</span></p>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">売上個数</span>
                <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{currentSales} <span className="text-sm font-normal">個</span></p>
              </div>
              <div className="col-span-2 pt-2 border-t border-blue-200 dark:border-blue-800/50 mt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">総利益</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {profit.toLocaleString()} <span className="text-lg font-normal">円</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 dark:bg-slate-950 p-4 rounded-lg">
            <p className="text-slate-300 text-sm mb-1 font-mono text-center">
              y = -500(x - <span className="text-emerald-400 font-bold">5</span>)² + <span className="text-emerald-400 font-bold">112500</span>
            </p>
            <p className="text-center text-xs text-slate-400 mt-2">
              {priceChange === 5 
                ? "✨ 利益が最大化されました！ (頂点)" 
                : "頂点 (x=5) に向かってスライダーを動かしてください"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitMaximizationViz;